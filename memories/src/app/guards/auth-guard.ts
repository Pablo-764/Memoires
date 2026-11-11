import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { AppStore } from '../servicios/app-store'

export const requireUser: CanActivateFn = () => {
  const store = inject(AppStore)
  const router = inject(Router)
  if (!store.loggedIn()) return router.parseUrl('/entrar')
  if (!store.onboarded()) return router.parseUrl('/bienvenida')
  return true
}
