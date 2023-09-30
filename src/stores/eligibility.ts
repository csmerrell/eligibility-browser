//vue
import { defineStore } from 'pinia'

//types
import type { ClaimantProps } from '@/views/eligibility/model/Claimant'
import type { RenderedEvent, RenderedClaim } from '@/views/eligibility/model/Event'
type FocusPane = 'left' | 'main' | 'right'

export const useEligibilityStore = defineStore({
  id: 'eligibility',

  state: () => ({
    renderedEvents: [] as RenderedEvent[],
    selectedClaimant: null as ClaimantProps | null,
    timelineAnimating: false,
    focusPane: null as FocusPane | null
  }),

  getters: {
    numClaims(): number {
      return (
        this.selectedClaimant?.timelineEvents.filter((event) => event.type === 'claim').length ?? 0
      )
    },
    hasClaims(): boolean {
      return this.numClaims > 0
    },
    renderedClaims(): RenderedClaim[] {
      return this.renderedEvents.filter((event) => event.type === 'claim') as RenderedClaim[]
    }
  },

  actions: {
    addRenderedEvent(event: RenderedEvent) {
      this.renderedEvents.push(event)
    },
    clearRenderedEvents() {
      this.renderedEvents = []
    },
    setSelectedClaimant(value: ClaimantProps): void {
      if (this.selectedClaimant?.uniqueId == value.uniqueId) {
        this.selectedClaimant = null
      } else {
        this.selectedClaimant = value
      }

      if (this.selectedClaimant) {
        this.focusPane = 'main'
      } else {
        this.focusPane = 'left'
      }
    },
    setTimelineAnimating(val: boolean) {
      this.timelineAnimating = val
    }
  }
})
