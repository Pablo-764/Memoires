import { ApplicationRef, Component, computed, inject, signal, viewChild, ElementRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore, type Profile as ProfileData } from '../../servicios/app-store'
import { Celebrate } from '../../servicios/celebrate'
import { BANNERS, EFFECTS, FRAMES, NAME_STYLES, THEMES, bannerOf, canUse, effectOf, frameOf, groupsOf, nameStyleOf, type DecorTier, type Rarity, type Theme } from '../../modelos/decor'
import { fitImage } from '../../utilidades/image'
import { CITIES, INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import { Avatar } from '../../componentes/avatar/avatar'
import { Banner } from '../../componentes/banner/banner'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { Effect } from '../../componentes/effect/effect'
import { Icon } from '../../componentes/icon/icon'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { PillGroup } from '../../directivas/pill-group'
import { IntentPrefsEditor } from '../../componentes/intent-prefs/intent-prefs'
import { InterestPicker } from '../../componentes/interest-picker/interest-picker'
import { ProfileQr } from '../../componentes/profile-qr/profile-qr'
import { EMPTY_PREFS, GENDERS, GENDER_ORDER, usesGender, usesGroups, type IntentPrefs } from '../../modelos/plan-formats'

type Tab = 'about' | 'themes' | 'banners' | 'frames' | 'effects' | 'names'

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink, Avatar, Banner, ChoiceChip, Effect, Icon, IntentBadge, IntentPrefsEditor, InterestPicker, PillGroup, ProfileQr],
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  protected readonly store = inject(AppStore)
  private readonly celebrate = inject(Celebrate)
  protected readonly router = inject(Router)

  protected readonly intents = INTENTS
  protected readonly intentOrder = INTENT_ORDER
  protected readonly cities = CITIES
  protected readonly frames = FRAMES
  protected readonly effects = EFFECTS
  protected readonly nameStyles = NAME_STYLES
  protected readonly bannerGroups = groupsOf(BANNERS)
  protected readonly frameGroups = groupsOf(FRAMES)
  protected readonly effectGroups = groupsOf(EFFECTS)
  protected readonly themeGroups = groupsOf(THEMES)
  protected readonly nameOf = nameStyleOf
  protected readonly rarityLabel: Record<Rarity, string> = { rara: 'Rara', epica: 'Épica', legendaria: 'Legendaria', mitica: 'Mítica' }

  protected readonly tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'about', label: 'Sobre ti' },
    { key: 'themes', label: 'Temas', count: THEMES.length },
    { key: 'banners', label: 'Fondos', count: BANNERS.length - 1 },
    { key: 'frames', label: 'Marcos', count: FRAMES.length - 1 },
    { key: 'effects', label: 'Efectos', count: EFFECTS.length - 1 },
    { key: 'names', label: 'Nombre', count: NAME_STYLES.length - 1 },
  ]
  protected readonly tab = signal<Tab>('about')
  protected readonly tabLook = [
    { shape: 'arch', tone: 'accent' },
    { shape: 'leaf', tone: 'accent' },
    { shape: 'pill', tone: 'accent' },
    { shape: 'drop', tone: 'accent' },
    { shape: 'ticket', tone: 'accent' },
    { shape: 'square', tone: 'accent' },
  ]
  // Vista ampliada: la tarjeta crece con una View Transition (dis-034)
  private readonly appRef = inject(ApplicationRef)
  protected readonly expanded = signal(false)
  protected readonly answered = computed(() => this.draft().prompts.filter((p) => p.a.trim()))
  protected readonly shareUrl = computed(() => location.origin + '/app/persona/me')

  protected toggleExpanded(open: boolean) {
    const run = () => this.expanded.set(open)
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return run()
    document.startViewTransition(() => {
      run()
      this.appRef.tick()
    })
  }

  protected copyLink() {
    navigator.clipboard?.writeText(this.shareUrl()).then(
      () => this.store.toast('Enlace copiado', 'ok'),
      () => this.store.toast('No se pudo copiar el enlace', 'danger'),
    )
  }

  protected readonly genderOrder = GENDER_ORDER
  protected readonly genderInfo = GENDERS
  // Solo las intenciones elegidas que tienen algo que ajustar
  protected readonly prefIntents = computed(() => this.draft().intents.filter((i) => usesGroups(i) || usesGender(i)))
  protected readonly languageOptions = ['Español', 'Inglés', 'Francés', 'Japonés', 'Portugués', 'Alemán']
  protected readonly availabilityOptions = ['Entre semana', 'Fines de semana', 'Cualquier día']
  protected readonly promptOptions = [
    'Mi domingo perfecto',
    'Busco a alguien que',
    'No puedo dejar de hablar de',
    'Mi plan ideal un viernes',
    'Te caeré bien si',
    'Mi talento inútil',
    'Lo último que me hizo reír',
    'El lugar al que siempre vuelvo',
  ]

  protected readonly draft = signal<ProfileData>(this.store.me())
  protected readonly dirty = computed(() => JSON.stringify(this.draft()) !== JSON.stringify(this.store.me()))
  protected readonly name = computed(() => nameStyleOf(this.draft().nameStyle))
  protected readonly uploadError = signal('')

  // Se puede probar cualquier estilo; solo se guarda lo que el plan incluye
  protected readonly lockedTier = computed<DecorTier | null>(() => {
    const d = this.draft()
    const picks = [bannerOf(d.decoration), frameOf(d.frame), effectOf(d.effect), nameStyleOf(d.nameStyle)]
    const blocked = picks.filter((p) => !canUse(this.store.tier(), p))
    if (!blocked.length) return null
    return blocked.some((p) => p.tier === 'lucidite') ? 'lucidite' : 'grand'
  })

  private readonly saveBtn = viewChild<ElementRef<HTMLElement>>('saveBtn')

  // Un tema se puede guardar si el plan incluye sus cuatro piezas
  protected themeUsable(t: Theme) {
    return [bannerOf(t.banner), frameOf(t.frame), effectOf(t.effect), nameStyleOf(t.name)].every((x) => this.usable(x))
  }

  protected themeActive(t: Theme) {
    const d = this.draft()
    return !d.customBanner && d.decoration === t.banner && d.frame === t.frame && d.effect === t.effect && d.nameStyle === t.name
  }

  protected applyTheme(t: Theme) {
    this.patch({ decoration: t.banner, frame: t.frame, effect: t.effect, nameStyle: t.name, customBanner: undefined })
  }

  protected usable(item: { tier: DecorTier }) {
    return canUse(this.store.tier(), item)
  }

  protected patch(p: Partial<ProfileData>) {
    this.draft.update((d) => ({ ...d, ...p }))
  }

  protected toggleIntent(v: Intent) {
    const l = this.draft().intents
    this.patch({ intents: l.includes(v) ? l.filter((x) => x !== v) : [...l, v] })
  }

  protected toggleInterest(v: string) {
    const l = this.draft().interests
    this.patch({ interests: l.includes(v) ? l.filter((x) => x !== v) : [...l, v] })
  }

  protected prefsOf(i: Intent) {
    return this.draft().intentPrefs[i] ?? EMPTY_PREFS
  }

  protected setPrefs(i: Intent, value: IntentPrefs) {
    this.patch({ intentPrefs: { ...this.draft().intentPrefs, [i]: value } })
  }

  protected toggleLanguage(v: string) {
    const l = this.draft().languages
    this.patch({ languages: l.includes(v) ? l.filter((x) => x !== v) : [...l, v] })
  }

  protected setPrompt(index: number, change: Partial<{ q: string; a: string }>) {
    this.patch({ prompts: this.draft().prompts.map((p, i) => (i === index ? { ...p, ...change } : p)) })
  }

  protected setFavorite(key: 'music' | 'movie' | 'food', value: string) {
    this.patch({ favorites: { ...this.draft().favorites, [key]: value } })
  }

  protected removeMoment(index: number) {
    this.patch({ gallery: this.draft().gallery.filter((_, i) => i !== index) })
  }

  protected async addMoment(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    this.uploadError.set('')
    try {
      const url = await fitImage(file, 640, 640)
      this.patch({ gallery: [...this.draft().gallery, url].slice(0, 6) })
    } catch (error) {
      this.uploadError.set(error instanceof Error ? error.message : 'No se pudo leer la imagen.')
    }
  }

  protected async upload(event: Event, kind: 'photo' | 'customBanner') {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    this.uploadError.set('')
    try {
      const url = kind === 'photo' ? await fitImage(file, 320, 320) : await fitImage(file, 960, 420)
      this.patch({ [kind]: url })
    } catch (error) {
      this.uploadError.set(error instanceof Error ? error.message : 'No se pudo leer la imagen.')
    }
  }

  protected discard() {
    this.draft.set(this.store.me())
  }

  protected save() {
    this.store.updateProfile(this.draft())
    this.store.toast('Perfil guardado', 'ok')
    this.celebrate.play('save', { at: this.saveBtn()?.nativeElement })
  }
}
