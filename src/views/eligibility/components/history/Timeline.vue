<script setup lang="ts">
//vue
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

//store
import { useEligibilityStore } from '@/stores/eligibility'
import { useFlexHudStore } from 'flex-hud'

//util
import { getNextRenderEvent, getMeasurements, lineLengths } from './util/eventRendering'

//types
import type { ClaimantProps } from '@/views/eligibility/model/Claimant'
import type { RenderedEvent } from '../../model/Event'
type TimelineProps = ClaimantProps & {
  dimensions?: {
    height: number
    width: number
  }
  duration?: number
}

const store = useEligibilityStore()
const hudStore = useFlexHudStore()

const props = defineProps<TimelineProps>()
const { dimensions, duration: durationOverride } = props

const el = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const showCanvas = ref(true)
const resizeDebounceCt = ref(0)
const rem = 16

const resizeDelay = 500
let animationFrameId: number | null = null

let resizeHandler: () => void

let remainingEvents = [...props.timelineEvents]
let lastWindowHeight = 0

const emit = defineEmits(['drawingStarted', 'drawingDone'])
defineExpose({ remainingEvents })

onMounted(() => {
  if (canvasRef.value) {
    store.renderedEvents = []
    const ctx = canvasRef.value.getContext('2d')
    // Initialize canvas dimensions
    resizeCanvas()
    // Initialize your canvas
    nextTick(() => {
      drawCanvas(ctx)
    })
  }

  resizeHandler = () => {
    //debounce
    resizeDebounceCt.value = new Date().getTime()
    showCanvas.value = false

    setTimeout(() => {
      const now = new Date().getTime()
      if (now - resizeDebounceCt.value < resizeDelay) return
      // Attach resize handler
      if (window.outerHeight === lastWindowHeight) return //only re-render on height changes

      showCanvas.value = true
      nextTick(() => {
        if (canvasRef.value) {
          const ctx = canvasRef.value.getContext('2d')
          resizeCanvas()
          drawCanvas(ctx)
        }
      })
    }, resizeDelay)
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', resizeHandler)
})

function resizeCanvas() {
  lastWindowHeight = window.outerHeight

  if (el.value && canvasRef.value) {
    const rect = el.value.getBoundingClientRect()
    canvasRef.value.width = dimensions?.width ?? rect.width - rem * 3
    canvasRef.value.height = dimensions?.height ?? rect.height - rem * 3
  }
}

const redraw = () => {
  nextTick(() => {
    //clear last claimant's events
    remainingEvents = [...props.timelineEvents]
    store.clearRenderedEvents()

    // hide right panel if there are no claims
    if (store.numClaims == 0) {
      hudStore.collapseRightPane()
    }

    //redraw the graphic
    const ctx = canvasRef.value!.getContext('2d')
    // resizeCanvas();
    drawCanvas(ctx)
  })
}

watch(() => props.uniqueId, redraw)
watch(
  () => hudStore.mainPaneToggling,
  (next, prev) => {
    nextTick(() => {
      if (!next) {
        resizeCanvas()
        redraw()
      }
    })
  }
)

function drawCanvas(ctx: CanvasRenderingContext2D | null) {
  if (!ctx) return
  store.setTimelineAnimating(true)

  //constants
  const startTime = Date.now()
  const duration = durationOverride ?? 800 // 800ms
  const mainLineCenter = Math.min(Math.max(ctx.canvas.width / 8, 150), 170)

  //used for eligbility drawing
  type EligibilityWindow = { start: number; end?: number }
  const eligibilityWindows: EligibilityWindow[] = []

  //lastFrameTime used to debounce event assessments
  let lastFrameTime = startTime

  //Add a first event at the start of the line
  addBirthEvent({ x: mainLineCenter, y: el.value!.offsetTop + 7 })

  //Renders events if the drawing has passed their date.
  const conditionallyRenderEvent = (
    currentTime: number,
    progress: number,
    topBuffer: number,
    firstEventTime: number,
    pixelTimespan: number
  ): RenderedEvent | undefined => {
    const canvasHeight = Math.max(ctx.canvas.height, dimensions?.height ?? 0)

    // if (store.selectedClaimant!.status === 'Dependent') {
    //   console.log('Current Time', currentTime)
    //   console.log('Progress', progress)
    //   console.log('lastFrameTime', lastFrameTime)
    //   console.log('firstEventTime', firstEventTime)
    //   console.log('pixelTimespan', currentTime)
    //   console.log('canvasHeight * progress', canvasHeight * progress)
    //   console.log('topBuffer', topBuffer)
    // }

    if (currentTime - lastFrameTime > 15 && canvasHeight * progress > topBuffer) {
      lastFrameTime = currentTime

      console.log('pre-nextRenderedEvent')
      const { nextEvent, remainingEvents: shiftedEvents } = getNextRenderEvent({
        canvasHeight,
        canvasTop: el.value?.offsetTop ?? 0,
        lineProgress: progress,
        firstEventTime,
        lineCenter: mainLineCenter,
        pixelTimespan,
        remainingEvents
      })
      if (nextEvent && shiftedEvents) {
        store.addRenderedEvent(nextEvent)
        remainingEvents = [...shiftedEvents]
        return nextEvent
      }
    }
  }

  const checkEligibilityChange = (nextEvent: RenderedEvent): boolean | undefined => {
    //push start/end windows to eligibility windows
    if (nextEvent.desc === 'Eligibility Started') {
      return true
    } else if (nextEvent.desc === 'Eligibility Terminated') {
      return false
    }
    return
  }

  const drawTimeline = () => {
    const currentTime = Date.now()
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    const lineHeight = Math.max(ctx.canvas.height, dimensions?.height ?? 0)

    const { firstEventTime, pixelTimespan, topBuffer } = getMeasurements(props, lineHeight)

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, lineHeight)

    // Draw the 1rem bar at the top
    ctx.fillStyle = '#000'
    ctx.fillRect(mainLineCenter - rem / 2, 0, rem, 2)

    // Draw the 1px stroke line
    const lineLength = lineHeight * progress
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(mainLineCenter, 2) // Start 2 pixels from the top
    ctx.lineTo(mainLineCenter, 9) // Move down to 6 pixels from the top

    // Draw zigzag
    const angle = 45 * (Math.PI / 180) // Convert to radians

    // 1 half-zig
    ctx.lineTo(mainLineCenter + Math.cos(angle) * 3, 9 + Math.sin(angle) * 3) // Right 3 pixels at 45 degrees

    // 1 full zig, 1 half zag
    ctx.lineTo(mainLineCenter + Math.cos(angle) * -3, 9 + Math.sin(angle) * 6) // Left 6 pixels at 45 degrees
    ctx.lineTo(mainLineCenter, 9 + Math.sin(angle) * 9) // Right 3 pixels at 45 degrees

    // Draw main vertical line
    ctx.lineTo(mainLineCenter, lineLength)
    ctx.stroke()

    const nextEvent = conditionallyRenderEvent(
      currentTime,
      progress,
      topBuffer,
      firstEventTime,
      pixelTimespan
    )
    if (nextEvent) {
      const eligible = checkEligibilityChange(nextEvent)
      if (eligible !== undefined) {
        if (eligible) {
          eligibilityWindows.push({
            start: progress
          })
        } else {
          eligibilityWindows[eligibilityWindows.length - 1].end = progress
        }
      }
    }

    // Draw caret arrow if the line is fully drawn
    if (progress === 1) {
      ctx.strokeStyle = '#000'
      ctx.beginPath()
      ctx.moveTo(mainLineCenter, lineHeight)
      ctx.lineTo(mainLineCenter - rem / 2, lineHeight - 10)
      ctx.moveTo(mainLineCenter, lineHeight)
      ctx.lineTo(mainLineCenter + rem / 2, lineHeight - 10)
      ctx.stroke()
      store.setTimelineAnimating(false)
      emit('drawingDone')
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(drawTimeline)
    }

    const drawEligibilityWindow = () => {
      eligibilityWindows.forEach((eligWindow) => {
        // Determine the effective end point for this window, using either the window's end point
        // or the current main timeline's progress, whichever is smaller.
        const effectiveEnd =
          eligWindow.end !== undefined ? Math.min(eligWindow.end, progress) : progress

        const startLineLength = lineHeight * eligWindow.start - 7
        const endLineLength = lineHeight * effectiveEnd - (eligWindow.end ? 8 : 0)

        // Setup for the rectangle
        ctx.strokeStyle = '#4d2277'
        ctx.lineWidth = 1
        ctx.fillStyle = '#e6d7f4'
        ctx.beginPath()

        // Draw the rectangle
        ctx.rect(
          mainLineCenter + lineLengths.eligibility - lineLengths.eligibilityRect,
          startLineLength,
          lineLengths.eligibilityRect,
          endLineLength - startLineLength
        )
        ctx.stroke()
        ctx.fill()
      })
    }

    drawEligibilityWindow()
  }

  emit('drawingStarted')
  drawTimeline()
}

const addBirthEvent = (position: { x: number; y: number }): void => {
  if (store.renderedEvents.length === 0) {
    store.addRenderedEvent({
      date: store.selectedClaimant!.date_of_birth,
      desc: 'Born',
      length: null,
      position,
      type: 'eligibility'
    })
  }
}
</script>

<template>
  <div v-if="!hudStore.mainPaneToggling" ref="el" class="timeline">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.timeline {
  padding: 1rem 0;
}
</style>
