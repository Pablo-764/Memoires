import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { type ActivatedRouteSnapshot, provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router'
import { routes } from './app.routes'

const NAV_ORDER = ['descubre', 'conexiones', 'planes', 'perfil', 'suscripcion', 'ajustes']

function leafPath(snapshot: ActivatedRouteSnapshot) {
  let node = snapshot
  while (node.firstChild) node = node.firstChild
  return node.routeConfig?.path ?? ''
}

// Cada recorrido entra por su propio lado
function transitionKind(from: string, to: string) {
  if (to.startsWith('chat') || to.startsWith('persona')) return 'push'
  if (from.startsWith('chat') || from.startsWith('persona')) return 'pop'
  const a = NAV_ORDER.indexOf(from)
  const b = NAV_ORDER.indexOf(to)
  if (a < 0 || b < 0) return 'fade'
  return b > a ? 'down' : 'up'
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions({
        skipInitialTransition: true,
        // Los nombres solo existen durante la transición para no crear contextos de apilamiento permanentes
        onViewTransitionCreated: ({ transition, from, to }) => {
          const root = document.documentElement
          root.dataset['vtKind'] = transitionKind(leafPath(from), leafPath(to))
          root.classList.add('vt-route')
          const clear = () => root.classList.remove('vt-route')
          transition.finished.then(clear, clear)
        },
      }),
    ),
  ],
}
