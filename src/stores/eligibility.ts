import { defineStore } from 'pinia';
import type { ClaimantProps } from '@/views/eligibility/model/Claimant';
import type { RenderedEvent, RenderedClaim } from '@/views/eligibility/model/Event';

// Use the `defineStore` method to define a new store
export const useEligibilityStore = defineStore({
  // unique identifier of the store across your application
  id: 'eligibility',

  // state properties (single source of truth)
  state: () => ({
    renderedEvents: [] as RenderedEvent[],
    selectedClaimant: null as ClaimantProps | null,
    timelineAnimating: false,
    setRightPaneVisiblity: (val: boolean) => {}
  }),

  // getters
  getters: {
    numClaims(): number {
      return this.selectedClaimant?.timelineEvents.filter(event => event.type === "claim").length ?? 0
    },
    hasClaims(): boolean {
      return this.numClaims > 0
    },
    renderedClaims(): RenderedClaim[] {
      return this.renderedEvents.filter(event => event.type === "claim") as RenderedClaim[]
    }
  },

  // actions (public mutations)
  actions: {
    setSelectedClaimant(value: ClaimantProps) {
      this.selectedClaimant = value
    },
    addRenderedEvent(event: RenderedEvent) {
      this.renderedEvents.push(event)
    },
    clearRenderedEvents() {
      this.renderedEvents = []
    },
    setTimelineAnimating(val: boolean) {
      this.timelineAnimating = val
    },
  },
});

