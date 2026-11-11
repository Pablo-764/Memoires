import type { ApplicationRef } from '@angular/core'

// Anima el reacomodo de una lista: los elementos con data-vt viajan a su nueva posición
export function runListTransition(appRef: ApplicationRef, update: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) {
    update()
    return
  }
  const root = document.documentElement
  root.classList.add('vt-list')
  const transition = document.startViewTransition(() => {
    update()
    appRef.tick()
  })
  const clear = () => root.classList.remove('vt-list')
  transition.finished.then(clear, clear)
  // Se rechaza si otra transición la interrumpe; la actualización ya se aplicó
  transition.ready.catch(() => {})
}
