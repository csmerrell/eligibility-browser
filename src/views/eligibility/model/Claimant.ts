import { Claim, type RawClaim } from './Claim'
import { type RawEligibilityRecord, EligibilityRecord } from './Eligibility'
import { type TimelineEvent, type TimelineClaimEvent, isEligibilityEvent } from './Event'

export interface RawClaimant {
  claims: RawClaim[]
  date_of_birth: string
  eligibility_history: RawEligibilityRecord[]
  first_name: string
  last_name: string
}

export interface ClaimantProps {
  totalClaimAmount: number
  status: string
  timelineEvents: TimelineEvent[]
  date_of_birth: Date
  first_name: string
  last_name: string
  uniqueId: string
  full_name: string
  id: number
}

export class Claimant {
  //derived
  totalClaimAmount: number
  status!: string
  timelineEvents: TimelineEvent[]
  date_of_birth: Date
  uniqueId: string
  full_name: string

  //inherited
  id!: number
  eligibility_history!: RawEligibilityRecord[]
  first_name!: string
  last_name!: string

  constructor(rawClaimant: RawClaimant) {
    const { date_of_birth, claims, ...rest } = rawClaimant

    this.full_name = `${rawClaimant.last_name}, ${rawClaimant.first_name}`
    this.date_of_birth = new Date(date_of_birth)
    this.uniqueId = `${rawClaimant.first_name} ${rawClaimant.last_name} ${rawClaimant.date_of_birth}`

    this.timelineEvents = []
    this.totalClaimAmount = 0
    //get total claim sum, add claims to timeline events
    claims.forEach((rawClaim) => {
      const claim = new Claim(rawClaim)
      this.totalClaimAmount += claim.claim_amount
      this.timelineEvents.push({
        date: claim.claim_date,
        desc: claim.description,
        type: 'claim',
        claim: claim
      } as TimelineClaimEvent)
    })

    //concat eligibility events to timeline events
    rawClaimant.eligibility_history.forEach((rawRecord) => {
      const record = new EligibilityRecord(rawRecord)
      this.timelineEvents = this.timelineEvents.concat(record.events)
    })

    //sort all timeline events (ascending)
    this.timelineEvents = this.timelineEvents.sort((e1, e2) => {
      const [time1, time2] = [e1.date.getTime(), e2.date.getTime()]

      //For same day events: Hire > Eligibility started > claim > Terminated > Elibility Terminated
      const priority: Record<string, number> = {
        Hired: 4,
        'Eligibility Started': 3,
        Terminated: 1,
        'Eligbility Terminated': 0
      }

      if (time1 === time2) {
        const [p1, p2] = [
          priority[e1.desc] ? priority[e1.desc] : 2,
          priority[e2.desc] ? priority[e2.desc] : 2
        ]
        return p2 - p1
      }

      return time1 - time2
    })

    //set this.status to the latest eligibility event's status
    for (let backIdx = this.timelineEvents.length - 1; backIdx >= 0; backIdx--) {
      const event = this.timelineEvents[backIdx]
      if (isEligibilityEvent(event)) {
        this.status = event.status
        break
      }
    }

    //The rest don't need any parsing, so assign them as they are
    Object.assign(this, rest)
  }

  static equals(self: Claimant | ClaimantProps, other: Claimant | null): boolean {
    if (other === null) return false
    if (other.first_name !== self.first_name) return false
    if (other.last_name !== self.last_name) return false
    if (other.date_of_birth !== self.date_of_birth) return false
    return true
  }
}
