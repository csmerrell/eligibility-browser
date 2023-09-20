import type { EventDescription, TimelineEligibilityEvent } from "./Event"

const RecordDescriptions: Record<string, Record<string, EventDescription>> = {
  "employee": {
    "start_date": {
      status: "Employee",
      description: "Hired",
    },
    "elig_start_date": {
      status: "Employee",
      description: "Eligibility Started",
    },
    "termed_date": {
      status: "Former Employee",
      description: "Terminated"
    },
    "elig_term_date": {
      status: "Former Employee, Termed",
      description: "Eligibility Terminated"
    } 
  },
  "dependent": {
    "elig_start_date": {
      status: "Dependent",
      description: "Eligibility Started",
    },
    "elig_term_date": {
      status: "Former Dependent",
      description: "Eligibility Terminated"
    }
  },
  "retiree": {
    "elig_start_date": {
      status: "Retiree",
      description: "Eligibility Started",
    },
    "elig_term_date": {
      status: "Retiree, Termed",
      description: "Eligibility Terminated"
    }
  }
}

export interface RawEligibilityRecord {
  elig_start_date: string
  start_date: string
  type: string
  elig_term_date?: string
  termed_date?: string
}

export class EligibilityRecord {
  //derived
  events: TimelineEligibilityEvent[]

  //inherited
  elig_start_date!: string
  start_date!: string
  type!: string
  elig_term_date?: string
  termed_date?: string

  constructor(rawRecord: RawEligibilityRecord) {
    //spread all of the raw record values into this one.
    Object.assign(this, rawRecord);

    this.events = []
    Object.entries(rawRecord).forEach(([key, val]) => {
      const eventDesc = RecordDescriptions[rawRecord.type]?.[key] 
      if (!eventDesc) return;
      this.events.push({
        date: new Date(val),
        desc: eventDesc.description,
        type: "eligibility",
        status: eventDesc.status
      })
    })
  }
}