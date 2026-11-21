import { Location } from '@angular/common'
import { VerifySheet } from '../../componentes/verify-sheet/verify-sheet'
import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AppStore } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { PERSON_DETAILS, personById } from '../../datos/mock'
import { nameStyleOf } from '../../modelos/decor'
import { INTENTS, type Intent } from '../../modelos/intents'
import { GENDERS, PLAN_SIZES, type Gender } from '../../modelos/plan-formats'
import { TIERS } from '../../modelos/plans'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { Effect } from '../../componentes/effect/effect'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { BlockDialog } from '../../componentes/block-dialog/block-dialog'
import { ReportDialog } from '../../componentes/report-dialog/report-dialog'
import { Seal } from '../../componentes/seal/seal'

@Component({
  selector: 'app-person',
  imports: [RouterLink, Avatar, Banner, Effect, Icon, IntentBadge, BlockDialog, ReportDialog, Seal, VerifySheet],
  styleUrl: './person.css',
  templateUrl: './person.html',
})
export class Person {
  readonly id = input('')

  protected readonly store = inject(AppStore)
  protected readonly verifyOpen = signal(false)
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly celebrate = inject(Celebrate)

  protected readonly reportOpen = signal(false)
  protected readonly blockOpen = signal(false)
  protected readonly isMe = computed(() => this.id() === 'me')

  constructor() {
    // La página toma la tinta de la intención que comparten
    effect(() => {
      const v = this.view()
      this.store.backdropTone.set(v ? (v.intents.find((i: Intent) => this.store.me().intents.includes(i)) ?? v.intents[0] ?? null) : null)
    })
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))
  }

  protected readonly view = computed(() => {
    if (this.isMe()) {
      const me = this.store.me()
      return {
        id: 'me', name: me.name || 'Tú', age: me.age, city: me.city, bio: me.bio, hue: 260, verified: false,
        intents: me.intents, interests: me.interests, languages: me.languages, availability: me.availability,
        decoration: me.decoration, frame: me.frame, effect: me.effect, nameStyle: me.nameStyle,
        photo: me.photo, customBanner: me.customBanner, occupation: me.occupation, education: me.education,
        memberSince: 'Tu cuenta', prompts: me.prompts.filter((p) => p.a.trim()), favorites: me.favorites,
        gallery: me.gallery, groupSizes: [...new Set(Object.values(me.intentPrefs).flatMap((p) => p?.sizes ?? []))], gender: me.gender as Gender | 'unsaid' | undefined,
      }
    }
    const p = personById(this.id())
    if (!p || this.store.blocked().includes(p.id) || this.store.suspended().includes(p.id)) return null
    const d = PERSON_DETAILS[p.id]
    return {
      id: p.id, name: p.name, age: p.age, city: p.city, bio: p.bio, hue: p.hue, verified: p.verified,
      intents: p.intents as Intent[], interests: p.interests, languages: p.languages, availability: p.availability as string,
      decoration: p.decoration, frame: p.frame, effect: p.effect, nameStyle: p.nameStyle,
      photo: undefined, customBanner: undefined, occupation: d.occupation, education: d.education,
      memberSince: d.memberSince, prompts: d.prompts, favorites: d.favorites,
      gallery: [] as string[], groupSizes: p.groupSizes ?? [], gender: p.gender as Gender | 'unsaid' | undefined,
    }
  })

  protected readonly name = computed(() => nameStyleOf(this.view()?.nameStyle))
  protected readonly connected = computed(() => this.store.connections().includes(this.id()))
  protected readonly liked = computed(() => this.store.decisions()[this.id()] === 'like')
  protected readonly common = computed(() => new Set(this.store.me().interests))
  protected readonly commonCount = computed(() => (this.view()?.interests ?? []).filter((i) => this.common().has(i)).length)
  protected readonly lookingFor = computed(() => (this.view()?.intents ?? []).map((i) => INTENTS[i].label).join(', '))
  protected readonly planText = computed(() => (this.view()?.groupSizes ?? []).map((s) => PLAN_SIZES[s].label).join(', '))
  protected readonly facts = computed(() => {
    const v = this.view()
    if (!v) return []
    const gender = v.gender && v.gender !== 'unsaid' ? GENDERS[v.gender].label : ''
    const rows: { icon: 'user' | 'briefcase' | 'graduation-cap' | 'languages' | 'clock' | 'map-pin' | 'calendar-days'; label: string; value: string }[] = [
      { icon: 'user', label: 'Género', value: gender },
      { icon: 'briefcase', label: 'Trabajo', value: v.occupation },
      { icon: 'graduation-cap', label: 'Estudios', value: v.education },
      { icon: 'languages', label: 'Idiomas', value: v.languages.join(', ') },
      { icon: 'clock', label: 'Disponibilidad', value: v.availability },
      { icon: 'map-pin', label: 'Ciudad', value: v.city },
      { icon: 'calendar-days', label: 'En mémoires', value: v.memberSince },
    ]
    return rows.filter((r) => r.value)
  })
  protected readonly favorites = computed(() => {
    const f = this.view()?.favorites
    if (!f) return []
    const rows: { icon: 'music' | 'clapperboard' | 'utensils'; label: string; value: string }[] = [
      { icon: 'music', label: 'Música', value: f.music },
      { icon: 'clapperboard', label: 'Película', value: f.movie },
      { icon: 'utensils', label: 'Comida', value: f.food },
    ]
    return rows.filter((r) => r.value)
  })
  protected readonly plans = computed(() => {
    const id = this.id()
    return this.store.plans().filter((p) => p.hostId === id || p.attendees.includes(id))
  })

  protected back() {
    if (this.router.lastSuccessfulNavigation()?.previousNavigation) this.location.back()
    else this.router.navigateByUrl('/app/descubre')
  }

  protected like(event: Event) {
    const person = personById(this.id())
    if (!person) return
    const target = event.currentTarget as Element
    const intent = person.intents.find((i) => this.store.me().intents.includes(i)) ?? person.intents[0]
    const result = this.store.decide(person.id, 'like')
    if (result === 'unverified') return void this.verifyOpen.set(true)
    if (result === 'limit') {
      this.store.toast(`Usaste tus ${TIERS[this.store.tier()].likesPerDay} “me interesa” de hoy`, 'danger')
      return
    }
    if (result === 'match') {
      this.celebrate.play(intent, { giant: true }).then(() => this.store.announceMatch(person.id))
      return
    }
    this.celebrate.play(intent, { at: target })
    this.store.toast('Le avisaremos si también le interesa conocerte')
  }

  protected leave() {
    this.router.navigateByUrl('/app/descubre')
  }
}
