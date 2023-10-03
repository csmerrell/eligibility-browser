//test libs
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import 'vitest-canvas-mock'
import { VueWrapper, mount } from '@vue/test-utils'
import { global } from '../setup'

//component
import Timeline from '../../components/history/Timeline.vue'

//data
import mockData from '@/../public/api-data.json'
import { Claimant, type RawClaimant } from '@/views/eligibility/model/Claimant'
import { useEligibilityStore } from '@/stores/eligibility'
import { createPinia } from 'pinia'

const mockClaimant = new Claimant(mockData[2] as RawClaimant)

type TimelineInstance = VueWrapper<InstanceType<typeof Timeline>>
type MockCanvasRenderingContext2D = CanvasRenderingContext2D & {
  _events: {
    type: string
    transform: number[]
    props: {
      x: number
      y: number
      width: number
      height: number
    }
  }[]
}

describe('Timeline', () => {
  it('renders the component', () => {
    const wrapper = mount(Timeline, {
      global,
      props: mockClaimant
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('renders the canvas', () => {})
})

describe('Timeline: Async safe tests', () => {
  const dimensions = {
    height: 1200,
    width: 400
  }
  it('animates a timeline on the canvas when mounted', () => {
    const checkCanvasAsync = (
      wrapper: TimelineInstance,
      dimensions: { height: number; width: number }
    ) => {
      return new Promise((resolve, reject) => {
        const checkFn = (wrapper: TimelineInstance) => {
          const canvasEl = wrapper.get('canvas').element
          const context = canvasEl.getContext('2d') as MockCanvasRenderingContext2D
          if (context && wrapper.emitted()['drawingStarted']) {
            expect(canvasEl.height).toBe(dimensions.height)

            // Testing for the highest maxY is a simple heuristic to test canvas animation.
            // A more comprehensive test would be beneficial, but difficult to design.
            const maxY = context._events.reduce((max, e) => (e.props.y > max ? e.props.y : max), 0)
            if (!wrapper.emitted()['drawingDone']) {
              try {
                //Line draw in progress. 0 < endpoint < dimensions.height.
                expect(maxY).toBeLessThan(dimensions.height)
                expect(maxY).toBeGreaterThan(0)
              } catch (e) {
                reject(e)
              }
            } else {
              try {
                //Line completely drawn. Endpoint matches canvas height.
                expect(maxY).toBe(dimensions.height)
                resolve(true)
              } catch (e) {
                reject(e)
              }
            }
          }

          if (!wrapper.emitted()['drawingDone']) {
            setTimeout(() => checkFn(wrapper), 100)
          }
        }
        checkFn(wrapper)
      })
    }

    const pinia = createPinia()
    const global = {
      plugins: [pinia]
    }

    const asyncSafeWrapper = mount(Timeline, {
      global,
      props: {
        ...mockClaimant,
        dimensions,
        duration: 400
      }
    })

    checkCanvasAsync(asyncSafeWrapper, dimensions)
  })

  it("adds all claimaint events into the store's `renderedEvents` array", async () => {
    const checkDrawingDone = (wrapper: TimelineInstance) => {
      return new Promise((resolve) => {
        const checkFn = (wrapper: TimelineInstance) => {
          if (wrapper.emitted()['drawingDone']) {
            resolve(true)
          } else {
            setTimeout(() => checkFn(wrapper), 100)
          }
        }
        checkFn(wrapper)
      })
    }
    //use a separate pinia to prevent issues from async test access
    const pinia = createPinia()
    const global = {
      plugins: [pinia]
    }
    const asyncSafeWrapper = mount(Timeline, {
      global,
      props: {
        ...mockClaimant,
        dimensions,
        duration: 400
      }
    })
    await checkDrawingDone(asyncSafeWrapper)
    const store = useEligibilityStore()
    expect(store.renderedEvents).toHaveLength(8) //born + all lifetime events
  })
})
