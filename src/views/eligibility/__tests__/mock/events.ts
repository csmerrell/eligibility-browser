//mock data
const defaultEvent = {
  date: new Date(),
  desc: 'Default desc',
  type: 'eligibility',
  length: '100px',
  position: { x: 50, y: 100 }
}
export const mockEvents = {
  default: defaultEvent,
  edge: {
    date: new Date(0),
    desc: 'Edge desc',
    type: 'eligibility',
    length: null,
    position: { x: 0, y: -10 }
  },
  claim: {
    ...defaultEvent,
    type: 'claim',
    claim: {
      claim_amount: 63.24,
      claim_date: new Date('June 1 2023')
    }
  }
}

export default mockEvents
