import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import { createTestingPinia } from '@pinia/testing'

describe('HomeView.vue', () => {
  it('renders FileDrop component when showGroups is false', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia({
          initialState: { groups: { groups: {} } },
          createSpy: vi.fn
        })],
      },
    })
    expect(wrapper.findComponent({ name: 'FileDrop' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Groups' }).exists()).toBe(false)
  })

  it('renders Groups component when showGroups is true', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia({
          initialState: { groups: { groups: { someGroup: {} } } },
          createSpy: vi.fn
        })],
      },
    })
    expect(wrapper.findComponent({ name: 'FileDrop' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Groups' }).exists()).toBe(true)
  })

  it('initializes correctly', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
