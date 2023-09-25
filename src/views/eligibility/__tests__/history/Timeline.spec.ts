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

const checkCanvasAsync = (
  wrapper: TimelineInstance,
  dimensions: { height: number; width: number }
) => {
  return new Promise((resolve, reject) => {
    const checkFn = (wrapper: TimelineInstance) => {
      const canvasEl = wrapper.get('canvas').element
      const context = canvasEl.getContext('2d') as MockCanvasRenderingContext2D
      if (context && wrapper.emitted()['drawingStarted']) {
        expect(canvasEl.height).toBe(150)

        const maxY = context._events.reduce((max, e) => (e.props.y > max ? e.props.y : max), 0)
        if (!wrapper.emitted()['drawingDone']) {
          try {
            //Line draw in progress. 0 < endpoint < dimensions.height.
            expect(maxY).toBeLessThan(dimensions.height)
            expect(maxY).toBeGreaterThan(0)
            resolve(true)
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

describe('Timeline', () => {
  let wrapper: TimelineInstance
  const dimensions = {
    height: 800,
    width: 400
  }

  beforeEach(() => {
    wrapper = mount(Timeline, {
      global,
      props: {
        ...mockClaimant,
        dimensions
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the canvas', () => {
    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
  })

  it('animates a timeline on the canvas when mounted', () => {
    checkCanvasAsync(wrapper, dimensions)
  })

  it("adds all claimaint events into the store's `renderedEvents` array", async () => {
    //use a separate pinia to prevent issues from async test access
    const pinia = createPinia()
    const global = {
      plugins: [pinia]
    }
    const dimensions = {
      height: 800,
      width: 800
    }
    const asyncSafeWrapper = mount(Timeline, {
      global,
      props: {
        ...mockClaimant,
        dimensions
      }
    })
    await checkDrawingDone(asyncSafeWrapper)
    const store = useEligibilityStore()
    expect(store.renderedEvents).toHaveLength(8) //born + all lifetime events
  })
})
