<!-- TODO: This was pointless. Je regrette. -->
<template>
  <li
    class="draggable-wrapper"
    :draggable="true"
    @dragstart="handleDragStart"
    @dragend.prevent="handleDragEnd"
    @dragover.prevent
  >
    <slot :dragging="dragging">Drag me</slot>
  </li>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { useGroupsStore } from '@/stores/groups'

const groupsStore = useGroupsStore()

const { item, group } = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
})

let ghostEle: HTMLElement | null = null
let dragEle: HTMLElement | null = null

let dragging: Boolean = false

function handleDragStart(e: DragEvent) {
  dragEle = e.target as HTMLElement
  if (!dragEle) return

  dragging = true

  ghostEle = dragEle.cloneNode(true) as HTMLElement
  ghostEle.classList.add('dragging-ghost')
  document.body.appendChild(ghostEle)

  const nodeRect = dragEle.getBoundingClientRect()

  e.dataTransfer?.setData('text/plain', 'text')
  e.dataTransfer?.setDragImage(ghostEle, e.clientX - nodeRect.left, e.clientY - nodeRect.top)

  groupsStore.handleDragStart(item, group)
}

function handleDragEnd(e: DragEvent) {
  dragging = false

  e.preventDefault()
  ghostEle?.remove()

  groupsStore.handleDragEnd()
}
</script>

<style>
.draggable-wrapper {
  cursor: grab;
  user-select: none;
}

.dragging-ghost {
  display: flex;
  width: 13rem;
}

.dragging-ghost > .item {
  transform: rotate(15deg);
  max-width: 13rem;
  position: absolute;
  left: -9999px;
}
</style>
