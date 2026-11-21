import { Component, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Icon } from '../../componentes/icon/icon'
import { Seal } from '../../componentes/seal/seal'
import { Modal } from '../../componentes/modal/modal'
import { ThemeService, type ThemeChoice } from '../../servicios/theme'
import { type Ajustes } from '../../servicios/app-store'
import { TIERS } from '../../modelos/plans'


@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink, ChoiceChip, Icon, Modal, Seal],
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  protected readonly theme = inject(ThemeService)
  protected readonly themes: { value: ThemeChoice; label: string }[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Nocturno' },
    { value: 'system', label: 'Como el dispositivo' },
  ]
  protected readonly store = inject(AppStore)
  private readonly router = inject(Router)
  protected readonly limits = [30, 60, 90, 120]
  protected readonly confirmDelete = signal(false)
  protected readonly typed = signal('')

  protected readonly a = this.store.ajustes
  protected readonly secciones = [
    { id: 'visibilidad', label: 'Quién puede verte' },
    { id: 'perfil', label: 'Qué ven de ti' },
    { id: 'avisos', label: 'Avisos' },
    { id: 'bienestar', label: 'Bienestar' },
    { id: 'apariencia', label: 'Apariencia' },
    { id: 'cuenta', label: 'Cuenta' },
  ]
  protected readonly visibilidades: { value: Ajustes['quienVe']; label: string; hint: string }[] = [
    { value: 'todos', label: 'Todas las personas afines', hint: 'Verificadas, en tu ciudad y con una intención en común.' },
    { value: 'intereses', label: 'Solo con intereses en común', hint: 'Además, que compartan al menos un interés contigo.' },
    { value: 'nadie', label: 'Nadie por ahora (pausa)', hint: 'Desapareces de Descubre. Tus conexiones y chats siguen igual.' },
  ]
  protected readonly efectoVisibilidad = computed(() => {
    const me = this.store.me()
    const intenciones = me.intents.length
    switch (this.a().quienVe) {
      case 'nadie':
        return 'Quién puede verte: nadie nuevo. Tu perfil está en pausa; solo tus conexiones te ven.'
      case 'intereses':
        return `Quién puede verte: personas verificadas en ${me.city} que comparten alguna de tus ${intenciones} intenciones y al menos uno de tus intereses.`
      default:
        return `Quién puede verte: personas verificadas en ${me.city} que buscan lo mismo que tú en alguna de tus ${intenciones} intenciones.`
    }
  })
  protected readonly efectoAvisos = computed(() => {
    const a = this.a()
    const n = [a.avisosConexion, a.avisosPlanes, a.resumenSemanal].filter(Boolean).length
    return n === 0 ? 'No recibirás avisos. Lo nuevo te espera al abrir la app.' : `Recibes ${n} de 3 tipos de aviso. Nunca te avisamos para que vuelvas a deslizar.`
  })
  protected readonly efectoTema = computed(() => {
    const c = this.theme.choice()
    return c === 'system' ? 'Sigue al dispositivo: cambia solo al anochecer si tu teléfono lo hace.' : c === 'dark' ? 'Siempre nocturno.' : 'Siempre claro.'
  })
  protected readonly tierName = computed(() => TIERS[this.store.tier()].name)

  protected ir(e: Event, id: string) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  protected logout() {
    this.store.logout()
    this.router.navigateByUrl('/')
  }

  protected deleteAccount() {
    this.store.deleteAccount()
    this.router.navigateByUrl('/')
  }
}
