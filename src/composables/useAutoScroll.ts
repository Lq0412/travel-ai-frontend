import { ref, nextTick, watch } from 'vue'

export function useAutoScroll<T extends HTMLElement>(listRef: { value: T | null }, endRef: { value: T | null }, deps?: { getLength?: () => number }) {
  const scrollToBottom = (smooth = true) => {
    nextTick(() => {
      const el = listRef.value
      if (!el) return
      const anchor = endRef.value as unknown as HTMLElement | null
      if (anchor && typeof anchor.scrollIntoView === 'function') {
        try {
          anchor.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end', inline: 'nearest' })
          return
        } catch {}
      }
      const target = Math.max(0, el.scrollHeight - el.clientHeight)
      try {
        const scrollable = el as unknown as { scrollTo?: (opts: { top: number; behavior?: ScrollBehavior }) => void } & HTMLElement
        if (typeof scrollable.scrollTo === 'function') {
          scrollable.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
        } else {
          ;(el as HTMLElement).scrollTop = target
        }
      } catch {
        ;(el as HTMLElement).scrollTop = target
      }
    })
  }

  if (deps?.getLength) {
    watch(deps.getLength, () => scrollToBottom(true))
  }

  return { scrollToBottom }
}


