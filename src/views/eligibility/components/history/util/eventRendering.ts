import type { ClaimantProps } from "@/views/eligibility/model/Claimant";
import { isClaimEvent, isEligibilityEvent, type RenderedClaim, type RenderedEvent, type TimelineEvent } from "@/views/eligibility/model/Event";

export interface GetRenderEventProps {
  canvasHeight: number
  canvasTop: number
  firstEventTime: number
  lineProgress: number 
  lineCenter: number
  pixelTimespan: number
  remainingEvents: TimelineEvent[], 
}

export interface GetRenderEventResult {
  remainingEvents?: TimelineEvent[],
  nextEvent?: RenderedEvent
}

export const lineLengths = {
  eligibilityRect: 8,
  eligibility: 150,
  other: 25
}

function getLength(event: TimelineEvent) {
  if(isEligibilityEvent(event)) {
    return event.desc.match(/Eligibility Started|Eligibility Terminated/) ? `${lineLengths.eligibility}px` : `${lineLengths.other}px`
  }
  return '100%'
}

export function getMeasurements(claimant: ClaimantProps, canvasHeight: number) {
  const firstEvent = claimant.timelineEvents[0]
  const lastEvent = claimant.timelineEvents[claimant.timelineEvents.length - 1]

  //Significant event dates. Used for generating the timeline's scale.
  const birthDate = claimant.date_of_birth.getTime()
  const firstEventTime = firstEvent.date.getTime();
  const lastEventTime = lastEvent.date.getTime()

  //Birth > First Event timeline dilation buffer
  const topDilateThreshold = new Date(1000 * 60 * 24 * 365 * 35).getTime() //Caps at 35 years
  //Dilated top pixel buffer. Caps at 150px for anything over 35 years
  const topBuffer = Math.min((firstEventTime - birthDate) / topDilateThreshold, 1) * 150 

  //Last Event > Now timeline dilation buffer.
  const bottomDilateThreshold = new Date(1000 * 60 * 24 * 365 * 5).getTime() //Caps at 5 years
  //Dilated bottom pixel buffer. Caps at 400px for anything over 3 years. Can't be smaller than 80px;
  const bottomBuffer = Math.max(Math.min((new Date().getTime() - lastEventTime) / bottomDilateThreshold, 1) * 400, 80) 

  //get timeHeightRatio
  const timespan = lastEventTime - firstEventTime;
  const availableHeight = canvasHeight - topBuffer - bottomBuffer;
  const pixelTimespan = timespan / Math.max((availableHeight), 1);

  return {
    firstEventTime,
    pixelTimespan,
    topBuffer
  }
}

export function getNextRenderEvent(props: GetRenderEventProps): GetRenderEventResult {
  const { canvasHeight, canvasTop, firstEventTime, lineCenter, lineProgress, pixelTimespan } = props;
  const events = [...props.remainingEvents];

  const currTime = firstEventTime + pixelTimespan * canvasHeight * lineProgress;

  if(events.length > 0 && currTime > events[0].date.getTime()) {
    const event = events.splice(0,1)[0];
    let renderedEvent = {
      desc: event.desc,
      length: getLength(event),
      date: event.date,
      type: event.type,
      position: {
        x: lineCenter,
        y: canvasTop + canvasHeight * lineProgress
      }
    }

    if(isClaimEvent(event)) {
      renderedEvent.position.x += lineLengths.eligibility - lineLengths.eligibilityRect;
      (renderedEvent as RenderedClaim).claim = event.claim;
    }

    
    return {
      remainingEvents: events,
      nextEvent: renderedEvent
    }
  }
  return {}
}