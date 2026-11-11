import { Routes } from '@angular/router'
import { requireUser } from './guards/auth-guard'

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing) },
  { path: 'entrar', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/register/register').then((m) => m.Register) },
  { path: 'bienvenida', loadComponent: () => import('./pages/onboarding/onboarding').then((m) => m.Onboarding) },
  { path: 'descanso', loadComponent: () => import('./pages/rest/rest').then((m) => m.Rest) },
  { path: 'privacidad', loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin) },
  {
    path: 'app',
    canActivate: [requireUser],
    loadComponent: () => import('./componentes/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'descubre' },
      { path: 'descubre', loadComponent: () => import('./pages/discover/discover').then((m) => m.Discover) },
      { path: 'conexiones', loadComponent: () => import('./pages/connections/connections').then((m) => m.Connections) },
      { path: 'chat/:id', loadComponent: () => import('./pages/chat/chat').then((m) => m.Chat) },
      { path: 'persona/:id', loadComponent: () => import('./pages/person/person').then((m) => m.Person) },
      { path: 'planes', loadComponent: () => import('./pages/plans/plans').then((m) => m.Plans) },
      { path: 'perfil', loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile) },
      { path: 'suscripcion', loadComponent: () => import('./pages/subscription/subscription').then((m) => m.Subscription) },
      { path: 'ajustes', loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings) },
    ],
  },
  { path: '**', redirectTo: '' },
]
