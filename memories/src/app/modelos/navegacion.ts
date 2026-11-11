import type { IconName } from '../componentes/icon/icons'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  also?: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/app/descubre', label: 'Descubre', icon: 'heart' },
  { to: '/app/conexiones', label: 'Conexiones', icon: 'message-circle', also: '/app/chat' },
  { to: '/app/planes', label: 'Planes', icon: 'calendar-days' },
  { to: '/app/perfil', label: 'Perfil', icon: 'user' },
]
