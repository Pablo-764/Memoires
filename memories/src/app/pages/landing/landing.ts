import { Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, effect, inject, signal, viewChild } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { PEOPLE } from '../../datos/mock'
import { INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import type { Tier } from '../../modelos/plans'
import { Avatar } from '../../componentes/avatar/avatar'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { Logo } from '../../componentes/logo/logo'
import { Footer } from '../../componentes/footer/footer'
import { Reveal } from '../../directivas/reveal'
import { Pressure } from '../../directivas/pressure'
import { StickerTrail } from '../../directivas/sticker-trail'
import { PolaroidBoard } from '../../componentes/polaroid-board/polaroid-board'
import { ThemeIconButton } from '../../componentes/theme-icon-button/theme-icon-button'
import { TierCards } from '../../componentes/tier-cards/tier-cards'

const HERO_PHOTOS: Record<Intent, { src: string; alt: string; credit: string; position: string }> = {
  friend: { src: 'fotos/cafe.webp', alt: 'Dos personas conversan en una mesa de un café iluminado por lámparas de papel', credit: 'tommao wang', position: '50% 70%' },
  plan: { src: 'fotos/correr.webp', alt: 'Tres personas corren por una banqueta soleada', credit: 'Nathan Nuyda', position: '50% 50%' },
  hobby: { src: 'fotos/juegos.webp', alt: 'Dos personas juegan un juego de mesa', credit: '2H Media', position: '50% 50%' },
  romance: { src: 'fotos/concierto.webp', alt: 'Público frente a un escenario iluminado', credit: 'Yvette de Wit', position: '50% 50%' },
}

const COLOR_KEY: Record<Intent, string> = { friend: 'friend', plan: 'plan', hobby: 'hobby', romance: 'romance' }

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Avatar, Footer, IntentBadge, Logo, PolaroidBoard, Pressure, Reveal, StickerTrail, ThemeIconButton, TierCards],
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly router = inject(Router)
  protected readonly store = inject(AppStore)
  protected readonly intents = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly photos = HERO_PHOTOS
  protected readonly intent = signal<Intent>('friend')
  protected readonly previous = signal<Intent | null>(null)
  protected readonly sample = computed(() => PEOPLE.filter((p) => p.intents.includes(this.intent()) && p.city === 'Guadalajara'))
  protected readonly featured = computed(() => this.sample().slice(0, 1))
  protected readonly accent = computed(() => `var(--color-${COLOR_KEY[this.intent()]})`)
  protected readonly wash = computed(() => `color-mix(in oklab, var(--color-${COLOR_KEY[this.intent()]}-soft) 58%, transparent)`)
  protected readonly pillColor = computed(() => `var(--color-${COLOR_KEY[this.intent()]})`)

  protected readonly plainWords = ['Di', 'qué', 'buscas.', 'Conoce', 'a', 'quien', 'busca']
  protected readonly accentWords = ['lo', 'mismo.']

  private readonly group = viewChild.required<ElementRef<HTMLElement>>('group')
  private readonly pill = viewChild.required<ElementRef<HTMLElement>>('pill')

  protected readonly diego = PEOPLE.find((p) => p.id === 'p2')!
  protected readonly mariana = PEOPLE.find((p) => p.id === 'p1')!

  protected readonly steps = [
    ['Dices qué buscas.', 'Eliges una o varias intenciones y los intereses que te definen. Puedes cambiarlas cuando quieras.'],
    ['Ves a gente afín, y por qué.', 'Te mostramos personas de tu ciudad con tu misma intención y te decimos qué tienen en común.'],
    ['Hablan si los dos quieren.', 'El chat solo se abre cuando a ambos les interesa conocerse.'],
  ]

  protected readonly safety = [
    ['El chat se abre solo si el interés es mutuo.', 'Nadie puede escribirte si tú no mostraste interés primero.'],
    ['Mostramos tu ciudad, nunca tu ubicación.', 'No guardamos coordenadas ni la dirección desde donde te conectas.'],
    ['Bloquear y reportar está a un toque.', 'La persona bloqueada deja de verte. Un equipo revisa cada reporte y puede suspender cuentas.'],
    ['Tus datos sensibles necesitan tu permiso.', 'La intención romántica solo se usa si das tu consentimiento expreso.'],
    ['Te avisamos cuando llevas mucho tiempo.', 'Si pasas demasiado rato en la app, te sugerimos tomar un descanso.'],
  ]

  protected readonly cta = (t: Tier) => (t === 'free' ? 'Crear cuenta' : 'Empezar')

  constructor() {
    // El halo del fondo toma la tinta de la intención elegida
    effect(() => this.store.backdropTone.set(this.intent()))
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))

    afterRenderEffect(() => {
      this.intent()
      this.placePill()
    })

    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.placePill())
      observer.observe(this.group().nativeElement)
      requestAnimationFrame(() => this.pill().nativeElement.classList.add('is-ready'))
      this.destroyRef.onDestroy(() => observer.disconnect())
    })
  }

  private readonly destroyRef = inject(DestroyRef)

  private placePill() {
    const active = this.group().nativeElement.querySelector<HTMLElement>('[aria-checked="true"]')
    if (!active) return
    const pill = this.pill().nativeElement
    pill.style.width = `${active.offsetWidth}px`
    pill.style.height = `${active.offsetHeight}px`
    pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`
  }

  protected choose(next: Intent) {
    if (next === this.intent()) return
    this.previous.set(this.intent())
    this.intent.set(next)
  }

  protected photoState(i: Intent) {
    if (i === this.intent()) return 'hero-photo is-active'
    return i === this.previous() ? 'hero-photo is-previous' : 'hero-photo'
  }

  protected scrollToSteps(e: Event) {
    e.preventDefault()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }
}
