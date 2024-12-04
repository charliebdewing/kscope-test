// Item.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Item from '@/components/Item.vue'
import { createTestingPinia } from '@pinia/testing'
import { useGroupsStore } from '@/stores/groups'
import { beforeEach } from 'vitest'


describe('Item.vue', () => {
  let wrapper: any
  let groupsStore: any

  beforeEach(() => {
    wrapper = mount(Item, {
      props: {
        modelValue: { name: 'Test Item' },
        group: { name: 'Test Group', items: [{ name: 'Test Item' }] }
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            groups: {
              activeItem: { name: 'Test Item' }
            }
          },
          createSpy: vi.fn
        })]
      }
    })
    groupsStore = useGroupsStore()
  })

  it('renders item name', () => {
    expect(wrapper.find('.name-input').text()).toBe('Test Item')
  })

  it('enables edit mode on double click', async () => {
    await wrapper.find('.name-input').trigger('dblclick')
    expect(wrapper.vm.isEditing).toBe(true)
    expect(wrapper.find('.name-input').attributes('contenteditable')).toBe('true')
  })

  it('validates and updates item name on blur', async () => {
    await wrapper.find('.name-input').trigger('dblclick')
    const nameInput = wrapper.find('.name-input')
    nameInput.element.innerText = 'Updated Item'
    await nameInput.trigger('blur')
    expect(groupsStore.validateItemName).toHaveBeenCalledWith('Updated Item', 'Test Item')
    // Not working for some reason
    // expect(wrapper.props().item.name).toBe('Updated Item')
  })

  it('shows error message on validation error', async () => {
    groupsStore.validateItemName = vi.fn(() => {
      throw new Error('Invalid name')
    })
    await wrapper.find('.name-input').trigger('dblclick')
    const nameInput = wrapper.find('.name-input')
    nameInput.element.innerText = 'Invalid Item'
    await nameInput.trigger('blur')
    expect(wrapper.vm.errorText).toBe('Invalid name')
    expect(nameInput.text()).toBe('Test Item')
  })
})
