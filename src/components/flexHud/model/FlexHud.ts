export type SidePaneProps = {
  initExpanded?: boolean
  transitionDelay?: string
  width?: string
}

export type SidePaneEmits = (event: 'toggled' | 'toggleAvailable', ...args: any[]) => void

export type FlexHudProps = {
  singleSidePane?: boolean
  leftPaneConfig?: SidePaneProps
  rightPaneConfig?: SidePaneProps
}

export type FlexHudEmits = (event: 'toggleStarted' | 'toggleComplete', ...args: any[]) => void
