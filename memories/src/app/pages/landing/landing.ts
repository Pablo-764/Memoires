import { Component, DestroyRef, ElementRef, afterNextRender, afterRenderEffect, computed, effect, inject, signal, viewChild } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
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
import { Inflado } from '../../componentes/inflado/inflado'
import { ThemeIconButton } from '../../componentes/theme-icon-button/theme-icon-button'
import { TierCards } from '../../componentes/tier-cards/tier-cards'
import { Thread } from '../../componentes/thread/thread'

const COLOR_KEY: Record<Intent, string> = { friend: 'friend', plan: 'plan', hobby: 'hobby', romance: 'romance' }

@Component({
  selector: 'app-landing',
  imports: [RouterLink, NgTemplateOutlet, Avatar, Footer, IntentBadge, Logo, Inflado, Reveal, ThemeIconButton, Thread, TierCards],
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly router = inject(Router)
  protected readonly store = inject(AppStore)
  protected readonly intents = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly intent = signal<Intent>('friend')
  protected readonly sample = computed(() => PEOPLE.filter((p) => p.intents.includes(this.intent()) && p.city === 'Guadalajara'))
  protected readonly featured = computed(() => this.sample().slice(0, 1))
  // Para la estrella de pasatiempo: los intereses de la persona de ejemplo
  protected readonly featuredInterests = computed(() => this.featured()[0]?.interests ?? [])
  protected readonly pillColor = computed(() => `var(--color-${COLOR_KEY[this.intent()]})`)

  protected readonly plainWords = ['Di', 'qué', 'buscas.', 'Conoce', 'a', 'quien', 'busca']
  protected readonly accentWords = ['lo', 'mismo.']

  private readonly group = viewChild.required<ElementRef<HTMLElement>>('group')
  private readonly pill = viewChild.required<ElementRef<HTMLElement>>('pill')
  private readonly albumEl = viewChild.required<ElementRef<HTMLElement>>('album')
  private readonly trackEl = viewChild.required<ElementRef<HTMLElement>>('track')
  private readonly pagesEl = viewChild.required<ElementRef<HTMLElement>>('pages')
  // Avance del álbum de 0 a 1 y página que se ve
  protected readonly albumP = signal(0)
  protected readonly albumStep = computed(() => Math.min(this.steps.length - 1, Math.round(this.albumP() * (this.steps.length - 1))))
  private albumWide: MediaQueryList | null = null

  protected readonly diego = PEOPLE.find((p) => p.id === 'p2')!
  protected readonly mariana = PEOPLE.find((p) => p.id === 'p1')!

  protected readonly steps = [
    ['Dices qué buscas.', 'Eliges una o varias intenciones y los intereses que te definen. Puedes cambiarlas cuando quieras.', 'sin presión, lo cambias cuando sea'],
    ['Ves a gente afín, y por qué.', 'Te mostramos personas de tu ciudad con tu misma intención y te decimos qué tienen en común.', 'nada de adivinar: te decimos qué comparten'],
    ['Hablan si los dos quieren.', 'El chat solo se abre cuando a ambos les interesa conocerse.', 'y el hilo por fin se une, como las flores de Arleth'],
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

      this.setupAlbum()
    })
  }

  private readonly destroyRef = inject(DestroyRef)

  /**
   * Álbum horizontal. En escritorio la sección mide 300vh y su contenido queda fijo; el scroll
   * vertical mueve las hojas de lado (con animation-timeline si existe; si no, desde aquí).
   * En móvil es un carrusel nativo con scroll-snap. Con movimiento reducido, las hojas se apilan.
   */
  private setupAlbum() {
    const section = this.albumEl().nativeElement
    const track = this.trackEl().nativeElement
    const pages = this.pagesEl().nativeElement
    const cssTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
    const wide = matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    this.albumWide = wide
    let shift = 0
    let frame = 0

    const update = () => {
      frame = 0
      if (wide.matches) {
        const r = section.getBoundingClientRect()
        const total = r.height - innerHeight
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
        this.albumP.set(p)
        if (!cssTimeline) track.style.transform = `translateX(${(-p * shift).toFixed(1)}px)`
      } else {
        const max = pages.scrollWidth - pages.clientWidth
        this.albumP.set(max > 0 ? pages.scrollLeft / max : 0)
        track.style.transform = ''
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const measure = () => {
      shift = wide.matches ? Math.max(0, track.scrollWidth - section.clientWidth) : 0
      track.style.setProperty('--shift', `${shift}px`)
      update()
    }

    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(section)
    addEventListener('scroll', schedule, { passive: true })
    pages.addEventListener('scroll', schedule, { passive: true })
    wide.addEventListener('change', measure)
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      removeEventListener('scroll', schedule)
      wide.removeEventListener('change', measure)
    })
  }

  // Con teclado, enfocar una hoja la trae a la vista
  protected focusSheet(i: number) {
    if (!this.albumWide?.matches) return
    const section = this.albumEl().nativeElement
    const total = section.offsetHeight - innerHeight
    const top = section.getBoundingClientRect().top + scrollY + (total * i) / (this.steps.length - 1)
    scrollTo({ top, behavior: 'auto' })
  }

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
    this.intent.set(next)
  }

  // El logo de la portada lleva al inicio de la misma portada, nunca a la app
  protected toTop() {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  protected scrollToSteps(e: Event) {
    e.preventDefault()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }
}
