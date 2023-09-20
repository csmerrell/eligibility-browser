import { ref } from 'vue'
import type { SidePaneEmits, SidePaneProps } from '../model/FlexHud'

export default function useSidePane(props: SidePaneProps, emit: SidePaneEmits) {
  //observables
  const expanded = ref(props.initExpanded)
  const toggling = ref(false)
  const contentEl = ref<HTMLElement | null>(null)

  //methods
  const unlockToggling = (event: Event) => {
    if (event.target != contentEl.value) return
    toggling.value = false
    contentEl.value?.removeEventListener('transitionend', unlockToggling)
    emit('toggleAvailable')
  }

  const toggle = () => {
    if (!toggling.value) {
      toggling.value = true
      expanded.value = !expanded.value
      contentEl.value?.addEventListener('transitionend', unlockToggling)
      emit('toggled', expanded.value)
    }
  }

  return {
    props,
    expanded,
    toggling,
    contentEl,
    unlockToggling,
    toggle
  }
}
