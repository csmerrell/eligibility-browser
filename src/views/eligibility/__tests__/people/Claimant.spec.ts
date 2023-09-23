//test libs
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import ClaimantVue from '@/views/eligibility/components/people/Claimant.vue'

//mock data
import mockData from '@/../public/api-data.json'
import { Claimant, type RawClaimant } from '../../model/Claimant'
import { useEligibilityStore } from '@/stores/eligibility'

const mockClaimant = new Claimant(mockData[0] as RawClaimant)

describe('Claimant', () => {
  it('renders with claimant properties', () => {
    const wrapper = shallowMount(ClaimantVue, { global, props: mockClaimant })
    expect(wrapper.get('.name').text()).toBe(
      `${mockClaimant.last_name}, ${mockClaimant.first_name}`
    )
    expect(wrapper.get('.status').text()).toBe(`(${mockClaimant.status})`)
  })

  it('reads store to apply correct selected/not selected', async () => {
    const wrapper = shallowMount(ClaimantVue, { global, props: mockClaimant })

    //test that it ignores a null selectedClaimant
    const store = useEligibilityStore()
    expect(wrapper.find('.selected').exists()).toBe(false)

    //test that it correctly identifies the right claimant
    store.setSelectedClaimant(mockClaimant)
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.selected'))

    //test that it correct ignores a different claimant
    const altClaimant = new Claimant(mockData[1] as RawClaimant)
    store.setSelectedClaimant(altClaimant)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.selected').exists()).toBe(false)
  })
})
