import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import ClaimantList from '@/views/eligibility/components/people/ClaimantList.vue'
import mockData from '@/../public/api-data.json'
import { Claimant, type RawClaimant } from '../../model/Claimant'

const mockClaimants = mockData.map((item) => {
  return new Claimant(item as RawClaimant)
})

describe('ClaimantList', () => {
  it('renders an empty claimant list', () => {
    const wrapper = shallowMount(ClaimantList, { props: { claimants: mockClaimants } })
    expect(wrapper.findAll('claimant-stub')).toHaveLength(0)
  })

  it('renders a non-empty with all claimants', () => {
    const wrapper = shallowMount(ClaimantList, { props: { claimants: mockClaimants } })
    expect(wrapper.findAll('claimant-item-stub')).toHaveLength(8)
  })

  it('generates a unique key for all claimants', () => {
    const wrapper = shallowMount(ClaimantList, { props: { claimants: mockClaimants } })
    const keys = wrapper.findAll('.claimant-wrapper').map((elWrapper) => {
      return elWrapper.element.getAttribute('id')
    })
    const set = new Set(keys)
    expect(Array.from(set).length).toEqual(keys.length)
  })
})
