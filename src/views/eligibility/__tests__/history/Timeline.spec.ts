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

const mockClaimant = new Claimant(mockData[2] as RawClaimant)

type TimelineInstance = VueWrapper<InstanceType<typeof Timeline>>
type CanvasCheckFn = (wrapper: TimelineInstance) => Promise<boolean | Error>

const checkCanvasAsync = (...args: Parameters<CanvasCheckFn>) => {
  return new Promise((resolve, reject) => {
    const checkFn = (...args: Parameters<CanvasCheckFn>) => {
      const [wrapper] = args
      if (wrapper.emitted()['drawingDone']) {
        try {
          debugger
          resolve(true)
        } catch (e) {
          reject(e)
        }
      } else {
        setTimeout(() => checkFn(...args), 100)
      }
    }
    checkFn(...args)
  })
}

describe('YourComponent', () => {
  let wrapper: TimelineInstance

  beforeEach(() => {
    wrapper = mount(Timeline, { global, props: mockClaimant })
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

  it('draws on the canvas when mounted', async () => {
    const canvas = wrapper.find('canvas').element
    const context = canvas.getContext('2d')

    await checkCanvasAsync(wrapper)
  })

  // You can write more tests to test specific logic, props, emitted events, etc.
})
