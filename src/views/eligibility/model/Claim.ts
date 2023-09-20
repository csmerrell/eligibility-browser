import type { TimelineClaimEvent } from "./Event"

export interface RawClaim {
  claim_amount: string
  claim_date: string
  claim_id: string
  description: string
  provider: string
  type: string
}

export class Claim {
  //derived
  claim_amount: number
  claim_date: Date

  //inherited
  claim_id!: string
  description!: string
  provider!: string
  type!: string

  constructor(rawClaim: RawClaim) {
    const { claim_amount, claim_date, ...rest } = rawClaim;
    this.claim_amount = parseFloat(rawClaim.claim_amount.split('$')[1]);
    this.claim_date = new Date(rawClaim.claim_date)
    if(!this.claim_date) {
      debugger;
    }
    
    //the rest don't need any parsing. Assign them as they are.
    Object.assign(this, rest);    
  }
}