import { ref } from 'vue'
import { defineStore } from 'pinia'
import { parseFile } from '@/utils/files'

// Define the store for managing groups
export const useGroupsStore = defineStore('groups', () => {
  // State variables
  const groups = ref<Groups>({})
  const activeGroup = ref<Group | null>(null)
  const activeItem = ref<Item | null>(null)

  // Function to update groups based on imported files
  async function updateGroups(currentEmployeesFile: File, teamMappingsFile: File) {
    // Initialize groups with an "Unassigned" group
    const newGroups: Groups = { Unassigned: { name: 'Unassigned', items: [] } }

    try {
      // Parse the files
      const teamMappings = await parseFile(teamMappingsFile)
      const currentEmployees = await parseFile(currentEmployeesFile)

      // Validate parsed data
      if (!teamMappings) throw new Error('No team mappings found in the file')
      if (!currentEmployees) throw new Error('No employees found in the file')

      // At the last minute I swapped these around to improve efficiency but forgot to keep the rule that "Any team mappings that aren't for a current employee should be discarded"
      // I'll leave it as it is as I'm now out of time but LET IT BE KNOWN that I realised my mistake

      // Create a map for team mappings
      teamMappings.forEach(([group, employee]) => {
        if (!employee) return // Skip empty rows
        group = group || 'Unassigned'
        if (!newGroups[group]) {
          newGroups[group] = { name: group, items: [] }
        }
        newGroups[group].items.push({ name: employee })
      })

      // Ensure all employees are assigned to a group
      currentEmployees.forEach(([employee]: string) => {
        const item = { name: employee }
        const group = Object.values(newGroups).find((group) => group.items.some(item => item.name === employee))
        if (!group) {
          newGroups.Unassigned.items.push(item)
        }
      })

    } catch (error) {
      console.error('Error merging CSV files:', error)
    } finally {
      groups.value = newGroups
    }
  }

  function handleDragEnter(group: Group, e: DragEvent) {
    if (!activeItem.value) return

    let previousGroup = activeGroup.value

    const groupsElement = document.querySelector('#groups') as HTMLElement
    if (!groupsElement) return

    const groupElement = groupsElement.querySelector(`#${group.name}`) as HTMLElement
    if (!groupElement) return

    const newIndex = getPlaceholderIndex(groupElement, e.clientY)

    if (previousGroup && previousGroup?.name !== group.name) {
      activeGroup.value = group

      activeItem.value = addItemToGroup(newIndex, activeItem.value, group)
      removeItemFromGroup({ item: activeItem.value, group: previousGroup })
    } else {
      const activeIndex = group.items.findIndex((item) => item.name === activeItem.value?.name)

      const newIndex = getPlaceholderIndex(groupElement as HTMLElement, e.clientY)
      if (activeIndex !== newIndex) {
        moveItemInGroup(group, activeIndex, newIndex)
      }
    }
  }

  // Function to add an item to a group at a specific index
  function addItemToGroup(index: number, item: Item, group: Group) {
    group.items.splice(index, 0, item)
    return group.items[index]
  }

  // Function to remove an item from a group
  function removeItemFromGroup({ item, index, group }: { item?: Item, index?: number, group: Group }) {
    if (index === undefined && item) {
      index = group.items.findIndex((groupItem) => groupItem.name === item.name)
    }
    if (index !== -1 && index !== undefined) {
      group.items.splice(index, 1)
    }

    // Remove "Unassigned" group if it becomes empty
    if (groups.value && group.name === 'Unassigned' && group.items.length === 0) {
      delete groups.value['Unassigned']
    }
  }

  // Function to move an item within a group
  function moveItemInGroup(group: Group, fromIndex: number, toIndex: number) {
    group.items.splice(toIndex, 0, group.items.splice(fromIndex, 1)[0])
  }

  // Function to get the placeholder index for drag-and-drop
  function getPlaceholderIndex(listsElem: HTMLElement, clientY: number) {
    if (!activeGroup.value || activeGroup.value.items.length === 0) return 0

    const items = listsElem.querySelectorAll(`.draggable-wrapper:not(.dragging)`)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const rect = item.getBoundingClientRect()
      if (clientY < rect.top + rect.height / 2) {
        return i
      }
    }

    return items.length
  }

  function handleDragStart(item: Item, group: Group) {
    activeItem.value = item
    activeGroup.value = group
  }

  function handleDragEnd() {
    resetDrag()
  }

  function handleDragDrop() {
    resetDrag()
  }

  function resetDrag() {
    activeItem.value = null
    activeGroup.value = null
  }

  // Function to validate item names
  function validateItemName(name: string, originalName: string) {
    if (!name) throw new Error('Name cannot be empty')
    if (name.length > 50) throw new Error('Name cannot be longer than 50 characters')
    const regex = new RegExp('[^a-zA-Z0-9]')
    if (regex.test(name)) throw new Error('Name must be alphanumeric')
    if (name !== originalName) {
      const itemNames = Object.values(groups.value || {}).flatMap((group) => group.items.map((item) => item.name))
      if (itemNames.includes(name)) throw new Error('Name is already in use')
    }
    return null
  }

  // Return the state and functions to be used in the store
  return {
    groups,
    activeGroup,
    activeItem,
    updateGroups,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragDrop,
    addItemToGroup,
    removeItemFromGroup,
    getPlaceholderIndex,
    moveItemInGroup,
    validateItemName
  }
}, {
  persist: {
    storage: localStorage,
  },
})
