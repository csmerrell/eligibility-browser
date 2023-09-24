//test libs
import { describe, it, expect } from 'vitest'
import { type VueWrapper, shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import Event from '@/views/eligibility/components/history/Event.vue'

//util
import { formatDate } from '@/util/dates/formatDate'

import mockEvents from '../mock/events'

type PositionCheckFn = (
  wrapper: VueWrapper<InstanceType<typeof Event>>,
  x: string,
  y: string,
  lineLength: string
) => Promise<boolean | Error>

const positionCheckAsync = (...args: Parameters<PositionCheckFn>) => {
  return new Promise((resolve, reject) => {
    const checkPosition = (...args: Parameters<PositionCheckFn>) => {
      const [wrapper, x, y, lineLength] = args
      if (wrapper.emitted()['visibleStylesSet']) {
        const styles = window.getComputedStyle(wrapper.element)
        const lineStyles = window.getComputedStyle(wrapper.get('.line').element)
        try {
          expect(styles.left).toBe(x)
          expect(styles.top).toBe(y)
          expect(lineStyles.width).toBe(lineLength)
          resolve(true)
        } catch (e) {
          reject(e)
        }
      } else {
        setTimeout(() => {
          checkPosition(...args)
        }, 100)
      }
    }
    checkPosition(...args)
  })
}

describe('Event', () => {
  it('renders default values', () => {
    const wrapper = shallowMount(Event, { global, props: mockEvents.default })
    expect(wrapper.get('.event-contents'))
    expect(wrapper.get('.line'))
    expect(wrapper.get('.description').text()).toBe(mockEvents.default.desc)
    expect(wrapper.get('.date').text()).toBe(formatDate(mockEvents.default.date))
  })

  it('renders with absolute coordinates', () => {
    const wrapper = shallowMount(Event, { global, props: mockEvents.default })
    return positionCheckAsync(
      wrapper,
      `${mockEvents.default.position.x}px`,
      `${mockEvents.default.position.y}px`,
      mockEvents.default.length
    )
  })

  it('renders edge case coordinates', () => {
    const wrapper = shallowMount(Event, { global, props: mockEvents.edge })
    return positionCheckAsync(
      wrapper,
      `${mockEvents.edge.position.x}px`,
      `${mockEvents.edge.position.y}px`,
      ''
    )
  })

  it('applies claim style appropriately', () => {
    const wrapper = shallowMount(Event, { global, props: mockEvents.claim })
    expect(wrapper.classes()).toContain('claim')
  })
})
