<template>
  <div class="item" :class="{ placeholder: isPlaceholder, editing: isEditing }">
    <span
      ref="nameElement"
      spellcheck="false"
      class="name-input"
      @blur="validate"
      @keydown="errorText = ''"
      @keydown.enter.prevent="validate"
      @dblclick="enableEditMode"
      :contenteditable="isEditing"
    >
      {{ item.name }}
    </span>
    <span class="error" v-if="errorText">{{ errorText }}</span>
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed, ref, useTemplateRef, onMounted, nextTick } from 'vue'
import { useGroupsStore } from '@/stores/groups'
import { storeToRefs } from 'pinia'

const item = defineModel({ type: Object as PropType<Item>, required: true })

const { group } = defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true,
  },
})

// State variables
const errorText = ref('')
let originalName = item.value.name
const isEditing = ref(false)

// Access the groups store
const groupsStore = useGroupsStore()
const { activeItem } = storeToRefs(groupsStore)

// Computed property to check if the item is a placeholder
const isPlaceholder = computed(() => activeItem.value?.name === item.value.name)

// Reference to the name element
const nameElement = useTemplateRef('nameElement')

onMounted(() => {
  if (!item.value.name) {
    isEditing.value = true
  }
})

// Function to enable edit mode
function enableEditMode() {
  isEditing.value = true
  nextTick(() => {
    nameElement.value?.focus()
  })
}

// Function to validate the item name
function validate(event: Event) {
  if (!nameElement.value || !nameElement.value.innerText.trim()) {
    // Delete item if name is empty
    if (!group) return
    groupsStore.removeItemFromGroup({ index: group.items.length - 1, group: group })
    return
  }

  const text = nameElement.value.innerText.trim()
  const input = event.target as HTMLInputElement

  try {
    groupsStore.validateItemName(text, originalName)
    item.value.name = text
    originalName = text

    input.blur()
    isEditing.value = false
    //TODO: select all text inside the input
  } catch (error: any) {
    errorText.value = (error as Error).message
    nameElement.value.innerText = originalName || 'Name'
  }
}
</script>

<style>
@import '@/assets/base.css';

.item {
  background: #f9fafa;
  border-radius: 0.25rem;
  min-height: 3rem;
  height: auto;
  width: 11rem;
  position: relative;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  transition: transform 0.15s ease-out;
}

.item:not(.placeholder) {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.name-input {
  cursor: text;
  text-align: left;
  max-width: 100%;
  width: 100%;
  font-weight: bold;
  color: black;
  border: 1px solid transparent;
  min-width: 3rem;
  padding: 0.25rem 0.5rem;
  line-break: anywhere;
}

.name-input:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.item.editing .name-input {
  /* Add hover effects for edit mode */
  border: 1px solid #ccc;
}

.name-input[contenteditable='false'] {
  cursor: pointer;
}

.name-input[contenteditable='true'] {
  cursor: text;
}

.error {
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: center;
}

.placeholder:before {
  content: '';
  display: block;
  border-radius: 0.25rem;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* This is a bit of a cheat to avoid having to hide the text */
  background-color: #dbe2e6;
  z-index: 1;
}
</style>
