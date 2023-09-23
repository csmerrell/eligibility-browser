//test libs
import { describe, it, expect } from 'vitest'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import Event from '@/views/eligibility/components/history/Event.vue'

//util
import { formatDate } from '@/util/dates/formatDate'

//mock data
const defaultEvent = {
  date: new Date(),
  desc: 'Default desc',
  type: 'eligibility',
  length: '100px',
  position: { x: 50, y: 100 }
}
const mockEvents = {
  default: defaultEvent,
  edge: {
    date: new Date(0),
    desc: 'Edge desc',
    type: 'eligibility',
    length: null,
    position: { x: 0, y: -10 }
  },
  claim: {
    ...defaultEvent,
    type: 'claim',
    claim: {}
  }
}

const positionCheckRecursive = (
  wrapper: VueWrapper<InstanceType<typeof Event>>,
  x: string,
  y: string,
  lineLength: string
) => {
  return new Promise((resolve, done) => {
    const checkPosition = (
      wrapper: VueWrapper<InstanceType<typeof Event>>,
      x: string,
      y: string
    ) => {
      if (wrapper.emitted()['visibleStylesSet']) {
        const styles = window.getComputedStyle(wrapper.element)
        const lineStyles = window.getComputedStyle(wrapper.get('.line').element)
        try {
          expect(styles.left).toBe(x)
          expect(styles.top).toBe(y)
          expect(lineStyles.width).toBe(lineLength)
          resolve(true)
        } catch (e) {
          done(e)
        }
      } else {
        setTimeout(() => {
          checkPosition(wrapper, x, y)
        }, 100)
      }
    }
    checkPosition(wrapper, x, y)
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
    return positionCheckRecursive(
      wrapper,
      `${mockEvents.default.position.x}px`,
      `${mockEvents.default.position.y}px`,
      mockEvents.default.length
    )
  })

  it('renders edge case coordinates', () => {
    const wrapper = shallowMount(Event, { global, props: mockEvents.edge })
    return positionCheckRecursive(
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
