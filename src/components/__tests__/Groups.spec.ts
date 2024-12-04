import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Groups from '@/components/Groups.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGroupsStore } from '@/stores/groups'

describe('Groups.vue', () => {
  let wrapper: any
  let groupsStore: ReturnType<typeof useGroupsStore>
  beforeEach(() => {

    wrapper = mount(Groups, {
      global: {
        plugins: [createTestingPinia({
          initialState: { groups: { groups: { TeamA: { name: 'TeamA', items: [{ name: 'Jon' }] }, TeamB: { name: 'TeamB', items: [{ name: 'Tara' }] } } } },
          createSpy: vi.fn,
          stubActions: false
        })],
      },
    })
    groupsStore = useGroupsStore()
  })

  it('renders groups correctly', () => {
    expect(wrapper.findComponent({ name: 'Group' }).exists()).toBe(true)
  })

  it('handles drag and drop correctly', async () => {
    const item: Item = { name: 'John' }
    const group: Group = { name: 'TeamA', items: [item] }
    await groupsStore.handleDragStart(item, group)
    expect(groupsStore.activeItem).toEqual(item)
    expect(groupsStore.activeGroup).toEqual(group)
  })

  // TODO: Add a drag enter test

  it('validates item names correctly', () => {
    expect(() => groupsStore.validateItemName('', 'John')).toThrow('Name cannot be empty')
    expect(() => groupsStore.validateItemName('a'.repeat(51), 'John')).toThrow('Name cannot be longer than 50 characters')
    expect(() => groupsStore.validateItemName('John@', 'John')).toThrow('Name must be alphanumeric')
    expect(() => groupsStore.validateItemName('Jon', 'John')).toThrow('Name is already in use')
    expect(groupsStore.validateItemName('NewName', 'John')).toBeNull()
  })

  it('adds and removes items from groups correctly', async () => {
    const item: Item = { name: 'John' }
    const group: Group = { name: 'TeamA', items: [] }
    await groupsStore.addItemToGroup(0, item, group)
    expect(group.items).toContain(item)

    await groupsStore.removeItemFromGroup({ item, group })
    expect(group.items).not.toContain(item)
  })

  it('moves items within a group correctly', async () => {
    const group: Group = { name: 'TeamA', items: [{ name: 'John' }, { name: 'Doe' }] }
    await groupsStore.moveItemInGroup(group, 0, 1)
    expect(group.items[0].name).toBe('Doe')
    expect(group.items[1].name).toBe('John')
  })
})
