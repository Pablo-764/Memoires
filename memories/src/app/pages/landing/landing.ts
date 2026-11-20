import { Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { PEOPLE } from '../../datos/mock'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import type { Tier } from '../../modelos/plans'
import { Logo } from '../../componentes/logo/logo'
import { Footer } from '../../componentes/footer/footer'
import { Reveal } from '../../directivas/reveal'
import { ThemeIconButton } from '../../componentes/theme-icon-button/theme-icon-button'
import { TierCards } from '../../componentes/tier-cards/tier-cards'
import { IntentConstellation } from '../../componentes/intent-constellation/intent-constellation'
import { Seal, type SealKind } from '../../componentes/seal/seal'
import { PillGroup } from '../../directivas/pill-group'
import { startLandingMotion } from '../../utilidades/landing-motion'

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Footer, Logo, Reveal, ThemeIconButton, TierCards, IntentConstellation, Seal, PillGroup],
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly router = inject(Router)
  protected readonly store = inject(AppStore)
  protected readonly intents = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly intent = signal<Intent>('friend')
  protected readonly count = (i: Intent) => PEOPLE.filter((p) => p.intents.includes(i) && p.city === 'Guadalajara').length
  protected readonly sample = computed(() => this.count(this.intent()))

  protected readonly steps = [
    ['Dices qué buscas', 'Eliges una o varias intenciones y los intereses que te definen. Las cambias cuando quieras.'],
    ['Ves a gente afín, y por qué', 'Te mostramos personas de tu ciudad con tu misma intención y lo que tienen en común contigo.'],
    ['Hablan si los dos quieren', 'El chat solo se abre cuando a ambos les interesa conocerse. Nadie te escribe sin tu sí.'],
  ]

  protected readonly safety: { kind: SealKind; title: string; text: string }[] = [
    { kind: 'safe', title: 'El chat se abre solo si el interés es mutuo', text: 'Nadie puede escribirte si tú no mostraste interés primero.' },
    { kind: 'private', title: 'Mostramos tu ciudad, nunca tu ubicación', text: 'No guardamos coordenadas ni la dirección desde donde te conectas.' },
    { kind: 'report', title: 'Reportar y bloquear, a un toque', text: 'La persona bloqueada deja de verte. Un equipo revisa cada reporte y puede suspender cuentas.' },
    { kind: 'verified', title: 'Perfiles verificados a la vista', text: 'El sello de verificado aparece en la tarjeta de cada persona antes de que decidas.' },
    { kind: 'private', title: 'Tus datos sensibles necesitan tu permiso', text: 'La intención romántica solo se usa si das tu consentimiento expreso.' },
    { kind: 'safe', title: 'Te avisamos cuando llevas mucho tiempo', text: 'Si pasas demasiado rato en la app, te sugerimos tomar un descanso.' },
  ]

  protected readonly cta = (t: Tier) => (t === 'free' ? 'Crear cuenta' : 'Empezar')

  constructor() {
    // Toda la portada se tiñe con la intención elegida (como el reino en LinNeo)
    effect(() => this.store.backdropTone.set(this.intent()))
    const destroyRef = inject(DestroyRef)
    destroyRef.onDestroy(() => this.store.backdropTone.set(null))

    // Momento firma con GSAP y Lenis (solo en el navegador y sin movimiento reducido)
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    // El héroe espera oculto desde el primer pintado para que no aparezca y luego florezca
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) host.classList.add('hero-pending')
    let stop: (() => void) | null = null
    let gone = false
    afterNextRender(() => {
      startLandingMotion(host).then((fn) => (gone ? fn() : (stop = fn)), () => host.classList.remove('hero-pending'))
    })
    destroyRef.onDestroy(() => {
      gone = true
      stop?.()
    })
  }

  // El logo de la portada lleva al inicio de la misma portada, nunca a la app
  protected toTop() {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  protected scrollToSteps(e: Event) {
    e.preventDefault()
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }
}
