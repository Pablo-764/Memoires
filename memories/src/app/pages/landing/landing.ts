import { Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, viewChildren } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { PEOPLE } from '../../datos/mock'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import type { Tier } from '../../modelos/plans'
import { Footer } from '../../componentes/footer/footer'
import { ThemeIconButton } from '../../componentes/theme-icon-button/theme-icon-button'
import { TierCards } from '../../componentes/tier-cards/tier-cards'
import { HeroConstellation } from '../../componentes/hero-constellation/hero-constellation'
import { Seal } from '../../componentes/seal/seal'
import { Icon } from '../../componentes/icon/icon'
import { Logo } from '../../componentes/logo/logo'

type Chapter = 0 | 1 | 2

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Footer, ThemeIconButton, TierCards, HeroConstellation, Seal, Icon, Logo],
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly router = inject(Router)
  protected readonly store = inject(AppStore)
  protected readonly intents = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly hovered = signal<Intent | null>(null)
  protected readonly Math = Math

  // Cuántas personas buscan cada intención en Guadalajara: el tamaño de cada nebulosa
  protected readonly counts = computed(
    () => Object.fromEntries(INTENT_ORDER.map((i) => [i, PEOPLE.filter((p) => p.intents.includes(i) && p.city === 'Guadalajara').length])) as Record<Intent, number>,
  )

  protected readonly chapters = [
    { title: 'Dices qué buscas', text: 'Pareja, amistad, un plan o un pasatiempo. Una o varias, y las cambias cuando quieras.' },
    { title: 'Ves quién coincide, y por qué', text: 'Las personas de tu ciudad con tu misma intención se acercan según lo que comparten contigo.' },
    { title: 'Hablan si los dos quieren', text: 'El hilo solo se anuda cuando a ambos les interesa. Nadie puede escribirte sin tu sí.' },
  ]
  protected readonly chapter = signal<Chapter>(0)
  private readonly chapterEls = viewChildren<ElementRef<HTMLElement>>('chapterEl')

  protected readonly cta = (t: Tier) => (t === 'free' ? 'Crear cuenta' : 'Empezar')
  protected readonly qrUrl = typeof location !== 'undefined' ? location.origin : 'https://memoires.app'

  constructor() {
    effect(() => this.store.backdropTone.set(this.hovered()))
    const destroyRef = inject(DestroyRef)
    destroyRef.onDestroy(() => this.store.backdropTone.set(null))

    // La escena fija cambia según el capítulo que está a la vista
    afterNextRender(() => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) this.chapter.set(Number((e.target as HTMLElement).dataset['ch']) as Chapter)
        },
        { rootMargin: '-45% 0px -45% 0px' },
      )
      this.chapterEls().forEach((el) => io.observe(el.nativeElement))
      destroyRef.onDestroy(() => io.disconnect())
    })
  }

  /** El hilo llegó a una intención: el registro empieza con ella elegida. */
  protected start(i: Intent) {
    this.router.navigate(['/registro'], { queryParams: { intencion: i } })
  }

  protected toTop() {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
}
