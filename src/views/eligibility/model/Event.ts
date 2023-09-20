import type { Claim } from './Claim'

export interface TimelineEvent {
  date: Date
  desc: string
  type: string
}

export interface TimelineClaimEvent extends TimelineEvent {
  claim: Claim
}

export interface TimelineEligibilityEvent extends TimelineEvent {
  status: string
}

//typeguards
export const isTimelineEvent = (x: unknown): x is TimelineEvent => {
  const casted = x as TimelineEvent
  if (!(casted?.date && casted.desc && casted.type)) return false
  return true
}

export const isClaimEvent = (x: unknown): x is TimelineClaimEvent => {
  const casted = x as TimelineClaimEvent
  if (!(isTimelineEvent(casted) && casted.claim)) return false
  return true
}

export const isEligibilityEvent = (x: unknown): x is TimelineEligibilityEvent => {
  const casted = x as TimelineEligibilityEvent
  if (!(isTimelineEvent(casted) && casted.status)) return false
  return true
}

export interface EventDescription {
  status: string
  description: string
}

export interface RenderedEvent extends TimelineEvent {
  length: string | null
  position: {
    x: number
    y: number
  }
}

export interface RenderedClaim extends RenderedEvent {
  claim: Claim
}
