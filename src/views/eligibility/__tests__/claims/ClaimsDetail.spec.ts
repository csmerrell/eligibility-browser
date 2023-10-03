//test libs
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import ClaimsDetail from '@/views/eligibility/components/claims/ClaimsDetail.vue'

//mock data
import mockData from '@/../public/claimant-records-legacy.json'
import { Claimant, type RawClaimant } from '@/views/eligibility/model/Claimant'
const mockClaimant = new Claimant(mockData[2] as RawClaimant)

import { useEligibilityStore } from '@/stores/eligibility'
import mockEvents from '../mock/events'

describe('ClaimsDetail', () => {
  it('renders an empty claimant list', () => {
    const wrapper = shallowMount(ClaimsDetail, { global })
    expect(wrapper.find('claim-stub').exists()).toBeFalsy()
  })

  it("renders claims when they're populated.", async () => {
    const wrapper = shallowMount(ClaimsDetail, { global })
    const store = useEligibilityStore()
    store.renderedEvents = Object.values(mockEvents)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('claim-stub')).toHaveLength(store.renderedClaims.length)
  })

  it('computes total claims costs and renders correctly', async () => {
    const wrapper = shallowMount(ClaimsDetail, { global })
    const store = useEligibilityStore()
    store.selectedClaimant = mockClaimant
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.claims-total').text()).toBe(
      `Total Claims: $${mockClaimant.totalClaimAmount}`
    )
  })
})
