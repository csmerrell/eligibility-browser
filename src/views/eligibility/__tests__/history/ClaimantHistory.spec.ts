//test libs
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import ClaimantHistory from '@/views/eligibility/components/history/ClaimantHistory.vue'

//mock data
import mockData from '@/../public/api-data.json'
import { Claimant, type RawClaimant } from '../../model/Claimant'
import { useEligibilityStore } from '@/stores/eligibility'

const mockClaimant = new Claimant(mockData[0] as RawClaimant)

describe('Claimant History', () => {
  it('mounts nothing if selected claimant is undefined', () => {
    const wrapper = shallowMount(ClaimantHistory, { global, props: mockClaimant })
    expect(wrapper.find('*').exists()).toBe(false)
  })

  it('mounts all of the history sub-components when claimant is selected', async () => {
    const store = useEligibilityStore()
    await store.setSelectedClaimant(mockClaimant)

    const wrapper = shallowMount(ClaimantHistory, { global, props: mockClaimant })
    expect(wrapper.get('panel-header-stub'))
    expect(wrapper.get('timeline-stub'))
    expect(wrapper.get('events-stub'))
  })
})
