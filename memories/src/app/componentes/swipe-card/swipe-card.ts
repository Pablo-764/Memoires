import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { INTENTS, INTENT_ICON, type Intent } from '../../modelos/intents'
import { nameStyleOf } from '../../modelos/decor'
import { PLAN_SIZES, usesGroups } from '../../modelos/plan-formats'
import type { Suggestion } from '../../utilidades/matching'
import { Avatar } from '../avatar/avatar'
import { Banner } from '../banner/banner'
import { Effect } from '../effect/effect'
import { Icon } from '../icon/icon'
import { IntentBadge } from '../intent-badge/intent-badge'
import { BlockDialog } from '../block-dialog/block-dialog'
import { ReportDialog } from '../report-dialog/report-dialog'

const easeBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)

@Component({
  selector: 'app-swipe-card',
  imports: [RouterLink, Avatar, Banner, Effect, Icon, IntentBadge, BlockDialog, ReportDialog],
  styleUrl: './swipe-card.css',
  templateUrl: './swipe-card.html',
  host: { class: 'block size-full' },
})
export class SwipeCard {
  readonly s = input.required<Suggestion>()
  readonly active = input(false)
  readonly intent = input.required<Intent>()
  readonly canLike = input.required<() => boolean>()
  readonly decide = input.required<(id: string, d: 'like' | 'pass') => boolean>()
  readonly pull = output<number>()
  readonly launch = output<'like' | 'pass'>()

  protected readonly person = computed(() => this.s().person)
  protected readonly name = computed(() => nameStyleOf(this.person().nameStyle))
  protected readonly sharedIntentsText = computed(() => this.s().sharedIntents.map((i) => INTENTS[i].label.toLowerCase()).join(' y '))
  protected readonly planText = computed(() => (usesGroups(this.intent()) ? (this.person().groupSizes ?? []) : []).map((s) => PLAN_SIZES[s].label).join(', '))
  protected readonly reportOpen = signal(false)
  protected readonly blockOpen = signal(false)
  protected readonly stampIcon = signal<'like' | 'pass' | null>(null)
  protected readonly likeIcon = computed(() => INTENT_ICON[this.intent()])

  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card')
  private readonly likeLabel = viewChild.required<ElementRef<HTMLElement>>('like')
  private readonly passLabel = viewChild.required<ElementRef<HTMLElement>>('pass')

  private readonly reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  private x = 0
  private startX = 0
  private dragging = false
  private busy = false
  private frame = 0
  private samples: { x: number; t: number }[] = []

  private transformFor(x: number) {
    const rotate = Math.max(-11, Math.min(11, (x / 240) * 11))
    return `translateX(${x}px) rotate(${rotate}deg)`
  }

  private render(x: number) {
    this.x = x
    this.card().nativeElement.style.transform = this.transformFor(x)
    this.likeLabel().nativeElement.style.opacity = String(Math.max(0, Math.min(1, (x - 30) / 90)))
    this.passLabel().nativeElement.style.opacity = String(Math.max(0, Math.min(1, (-x - 30) / 90)))
    this.pull.emit(x)
  }

  private settle() {
    cancelAnimationFrame(this.frame)
    const from = this.x
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 420)
      this.render(from * (1 - easeBack(t)))
      if (t < 1) this.frame = requestAnimationFrame(step)
    }
    this.frame = requestAnimationFrame(step)
  }

  protected onPointerDown(e: PointerEvent) {
    if (!this.active() || this.reduce || this.busy || e.button !== 0 || (e.target as Element).closest('button, a')) return
    cancelAnimationFrame(this.frame)
    this.dragging = true
    this.startX = e.clientX - this.x / 0.9
    this.samples = [{ x: e.clientX, t: e.timeStamp }]
    this.card().nativeElement.setPointerCapture(e.pointerId)
  }

  protected onPointerMove(e: PointerEvent) {
    if (!this.dragging) return
    this.render((e.clientX - this.startX) * 0.9)
    this.samples.push({ x: e.clientX, t: e.timeStamp })
    this.samples = this.samples.filter((p) => e.timeStamp - p.t <= 100)
  }

  protected onPointerUp(e: PointerEvent) {
    if (!this.dragging) return
    this.dragging = false
    const offset = e.clientX - this.startX
    const first = this.samples[0]
    const elapsed = e.timeStamp - first.t
    const velocity = elapsed > 0 ? ((e.clientX - first.x) / elapsed) * 1000 : 0
    // Un gesto rápido basta, aunque no recorra mucha distancia
    const fast = Math.abs(velocity) > 500
    if (offset > 110 || (fast && velocity > 0)) this.fling('like')
    else if (offset < -110 || (fast && velocity < 0)) this.fling('pass')
    else this.settle()
  }

  protected onPointerCancel() {
    if (!this.dragging) return
    this.dragging = false
    this.settle()
  }

  async fling(d: 'like' | 'pass') {
    if (this.busy || !this.active()) return
    const id = this.person().id

    if (d === 'like' && !this.canLike()) {
      this.decide()(id, d)
      this.settle()
      this.card().nativeElement.animate(
        [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '10px 0' }, { translate: '-6px 0' }, { translate: '0 0' }],
        { duration: 340, easing: 'ease-out' },
      )
      return
    }

    if (this.reduce) {
      this.launch.emit(d)
      this.decide()(id, d)
      return
    }

    this.busy = true
    cancelAnimationFrame(this.frame)
    this.launch.emit(d)
    this.stampIcon.set(d)
    this.pull.emit(0)

    const el = this.card().nativeElement
    const start = this.transformFor(this.x)
    const frames: Keyframe[] =
      d === 'like'
        ? [
            { transform: start, opacity: 1, offset: 0 },
            { transform: `translate(${this.x * 0.3}px, -18px) rotate(-2deg) scale(1.05)`, opacity: 1, offset: 0.42, easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)' },
            { transform: 'translate(120vw, -26vh) rotate(26deg) scale(0.88)', opacity: 0.2, offset: 1 },
          ]
        : [
            { transform: start, opacity: 1, offset: 0 },
            { transform: `translate(${this.x * 0.3 + 26}px, -6px) rotate(3deg) scale(0.98)`, opacity: 1, offset: 0.3, easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)' },
            { transform: 'translate(-120vw, -12vh) rotate(-22deg) scale(0.9)', opacity: 0.1, offset: 1 },
          ]

    const animation = el.animate(frames, { duration: d === 'like' ? 1050 : 820, fill: 'forwards' })
    await animation.finished
    this.decide()(id, d)
  }
}
