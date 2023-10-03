//test libs
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { global } from '../setup'

//component
import ClaimantList from '@/views/eligibility/components/people/ClaimantList.vue'

//mock data
import mockData from '@/../public/claimant-records-legacy.json'
import { Claimant, type RawClaimant } from '../../model/Claimant'
import { useEligibilityStore } from '@/stores/eligibility'

const mockClaimants = mockData.map((item) => {
  return new Claimant(item as RawClaimant)
})

describe('ClaimantList', () => {
  it('renders an empty claimant list', () => {
    const wrapper = mount(ClaimantList, { props: { claimants: [] } })
    expect(wrapper.find('.claimant').exists()).toBeFalsy()
  })

  it('renders a non-empty with all claimants', () => {
    const wrapper = mount(ClaimantList, { global, props: { claimants: mockClaimants } })
    expect(wrapper.findAll('.claimant')).toHaveLength(8)
  })

  it('generates a unique key for all claimants', () => {
    const wrapper = mount(ClaimantList, { global, props: { claimants: mockClaimants } })
    const keys = wrapper.findAll('.claimant-wrapper').map((elWrapper) => {
      return elWrapper.element.getAttribute('id')
    })
    const set = new Set(keys)
    expect(Array.from(set).length).toEqual(keys.length)
  })

  it("updates the store's `selectedClaimant` prop when claimants are clicked.", async () => {
    const wrapper = mount(ClaimantList, { global, props: { claimants: mockClaimants } })
    const store = useEligibilityStore()
    expect(store.selectedClaimant).toBeNull()

    const claimantEls = wrapper.findAll('.claimant')
    await claimantEls[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(store.selectedClaimant?.uniqueId).toEqual(mockClaimants[0].uniqueId)

    await claimantEls[1].trigger('click')
    await wrapper.vm.$nextTick()
    expect(store.selectedClaimant?.uniqueId).toEqual(mockClaimants[1].uniqueId)
  })
})
