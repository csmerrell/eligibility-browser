//test libs
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import Events from '@/views/eligibility/components/history/Events.vue'

//data
import mockEvents from '../mock/events'
import { useEligibilityStore } from '@/stores/eligibility'

describe('Event', () => {
  const wrapper = shallowMount(Events, { global })
  const store = useEligibilityStore()

  it('renders no events when stores "renderedEvents" is empty', () => {
    expect(wrapper.find('event-stub').exists()).toBe(false)
  })

  it("renders events from the store when they're populated", async () => {
    const eventArray = Object.values(mockEvents)
    store.renderedEvents = eventArray

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('event-stub')).toHaveLength(eventArray.length)
  })
})
