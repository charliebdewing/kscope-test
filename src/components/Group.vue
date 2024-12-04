<template>
  <div
    class="group"
    ref="root"
    @drop.prevent="handleDragDrop"
    :id="group.name"
    :class="{ active: isActive }"
    @dragover.prevent="handleDragEnter"
    @dragenter.prevent="handleDragEnter"
  >
    <h2 class="group--header">{{ group.name }}</h2>
    <TransitionGroup name="list" class="items" tag="ul">
      <DraggableWrapper
        v-for="(item, itemIndex) in group.items"
        :item="item"
        :group="group"
        :key="item.name"
      >
        <template #default="{ dragging }">
          <Item v-model="group.items[itemIndex]" :group="group" :class="{ dragging }"></Item>
        </template>
      </DraggableWrapper>
    </TransitionGroup>
    <div class="group--footer">
      <AddItem @click="addItem">Add Item</AddItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import DraggableWrapper from '@/components/DraggableWrapper.vue'
import AddItem from '@/components/AddItem.vue'
import Item from '@/components/Item.vue'
import { useGroupsStore } from '@/stores/groups'
import { storeToRefs } from 'pinia'
import { throttle } from 'lodash'
import { type PropType, useTemplateRef, computed, nextTick } from 'vue'

const group = defineModel({ type: Object as PropType<Group>, required: true })

const groupsStore = useGroupsStore()
const { activeGroup } = storeToRefs(groupsStore)

// Template for a new item
const templateItem = (): Item => {
  return { name: '' }
}

// Reference to the root element
const root = useTemplateRef('root')

// Computed property to check if the group is active
const isActive = computed(() => activeGroup.value?.name === group.value.name)

function handleDragDrop() {
  groupsStore.handleDragDrop()
}

// Function to add a new item to the group
function addItem() {
  groupsStore.addItemToGroup(group.value.items.length, templateItem(), group.value)

  // Need to wait for next tick to ensure the item is rendered
  nextTick(() => {
    if (!root.value) return
    const items = root.value.querySelectorAll('.draggable-wrapper')
    const lastItem = items[items.length - 1] as HTMLElement
    lastItem.scrollIntoView({ behavior: 'smooth' })
    const nameInput = lastItem.querySelector('.name-input') as HTMLInputElement
    if (!nameInput) return

    nameInput.focus()
  })
}

// Throttling this event to prevent too many calls
const handleDragEnter: (e: DragEvent) => void = throttle(
  (e: DragEvent) => {
    if (!e.target) return
    groupsStore.handleDragEnter(group.value, e)
  },
  200,
  { leading: true, trailing: false },
)
</script>

<style>
@import '@/assets/base.css';

.droppable-wrapper {
  cursor: grab;
  user-select: none;
}

/* TODO: height transition */
.group {
  height: auto;
  min-height: 500px;
  /* Allows the empty group to shrink when not in use */
  min-width: 9rem;
  background: #e8ecee;
  border: solid 2px transparent;
  border-radius: 15px;
  transition:
    border-color 0.15s ease,
    width 0.15s ease;
}

.group.active {
  border-color: #a419f3;
}

.group--header {
  padding: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.items {
  padding: 1rem;
  list-style: none;
}

.item {
  margin-bottom: 1rem;
}

.group--footer {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Transitions */
/* Annoyingly had issues with move causing flickering */
.list-move {
  transition: all 0.15s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.15s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px), scale(0.9);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

.group:not(.active) .item:hover {
  transform: scale(1.05);
}
</style>
