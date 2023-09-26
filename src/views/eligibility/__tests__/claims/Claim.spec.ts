//test libs
import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { global } from '../setup'

//component
import Claim from '@/views/eligibility/components/claims/Claim.vue'

//types
import type { RenderedClaim } from '../../model/Event'

//mock data
import mockEvents from '../mock/events'
const mockClaim = Object.values(mockEvents).find((event) => event.type === 'claim') as RenderedClaim

describe('ClaimsDetail', () => {
  it('renders a claim with date & claim amount', () => {
    const wrapper = shallowMount(Claim, { global, props: { ...mockClaim } })
    expect(wrapper.get('a').text()).toBe('2023, Jun, 01')
    expect(wrapper.get('a').element.getAttribute('title')).toBe(mockClaim.desc)
    expect(wrapper.get('span').text()).toBe(`$${mockClaim.claim.claim_amount}`)
  })
})
