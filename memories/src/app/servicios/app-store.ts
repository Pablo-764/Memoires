import { Injectable, computed, effect, signal } from '@angular/core'
import { BOT_CONNECTIONS } from '../datos/bots'
import { AUTO_REPLIES, PEOPLE, PLANS, SEED_MESSAGES, SEED_REPORTS, type Message, type Plan, type Report } from '../datos/mock'
import type { Intent } from '../modelos/intents'
import { DEFAULT_FILTERS, type Filters } from '../utilidades/matching'
import type { Gender, IntentPrefs } from '../modelos/plan-formats'
import { TIERS, type DecorationKey, type Tier } from '../modelos/plans'
import type { Etapa, PlanPropuesto } from '../utilidades/etapas'

export interface Profile {
  name: string
  email: string
  age: number
  city: string
  bio: string
  intents: Intent[]
  interests: string[]
  decoration: DecorationKey
  frame: string
  effect: string
  nameStyle: string
  photo?: string
  customBanner?: string
  occupation: string
  education: string
  languages: string[]
  availability: string
  prompts: { q: string; a: string }[]
  favorites: { music: string; movie: string; food: string }
  gallery: string[]
  gender: Gender | 'unsaid'
  intentPrefs: Partial<Record<Intent, IntentPrefs>>
  // Registro de 13 pasos
  pronouns?: string
  zone?: string
  verified?: boolean // selfie con pose aleatoria (sello azul); obligatoria para conectar
  personality?: [number, number, number, number] // 4 ejes de -1 a 1 (test opcional)
  openers?: string[] // "Primeros pasos": 3 preguntas de apertura
  rulesAccepted?: boolean
}

export interface Toast {
  id: number
  text: string
  tone?: 'ok' | 'info' | 'danger'
}

/** Privacidad y avisos: cada interruptor explica su efecto en Ajustes. */
export interface Ajustes {
  quienVe: 'todos' | 'intereses' | 'nadie' // nadie = perfil en pausa
  mostrarEdad: boolean
  mostrarZona: boolean
  leido: boolean // avisos de leído en el chat
  avisosConexion: boolean
  avisosPlanes: boolean
  resumenSemanal: boolean
}

export const AJUSTES_BASE: Ajustes = {
  quienVe: 'todos',
  mostrarEdad: true,
  mostrarZona: true,
  leido: true,
  avisosConexion: true,
  avisosPlanes: true,
  resumenSemanal: false,
}

interface State {
  loggedIn: boolean
  onboarded: boolean
  me: Profile
  tier: Tier
  // "Me interesa" usados hoy (se reinicia cada día) e hilos dorados de la semana
  likesToday: number
  likesDay: string
  goldenUsed: number
  goldenWeek: string
  // Hilos dorados enviados (aparecen primero en la bandeja de la otra persona)
  golden?: string[]
  decisions: Record<string, 'like' | 'pass'>
  connections: string[]
  messages: Record<string, Message[]>
  joinedPlans: string[]
  plans: Plan[]
  blocked: string[]
  reports: Report[]
  suspended: string[]
  filters: Filters
  minutesToday: number
  limitMinutes: number
  ajustes?: Ajustes
  snoozedUntilMinute: number
  // Ya se agregó a Arleth como conexión en esta sesión guardada
  arleth?: boolean
  // Etapa elegida a mano en el tablero de Conexiones
  stages?: Record<string, Etapa>
}

const KEY = 'afin-demo-v1'

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10)
function weekKey(d = new Date()) {
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return dayKey(monday)
}

export const EMPTY_ME: Profile = {
  name: '',
  email: '',
  age: 18,
  city: 'Guadalajara',
  bio: '',
  intents: [],
  interests: [],
  decoration: 'none',
  frame: 'none',
  effect: 'none',
  nameStyle: 'none',
  occupation: '',
  education: '',
  languages: ['Español'],
  availability: 'Cualquier día',
  prompts: [
    { q: 'Mi domingo perfecto', a: '' },
    { q: 'Busco a alguien que', a: '' },
    { q: 'No puedo dejar de hablar de', a: '' },
  ],
  favorites: { music: '', movie: '', food: '' },
  gallery: [],
  gender: 'unsaid',
  intentPrefs: {},
}

export const DEMO_ME: Profile = {
  verified: true,
  name: 'Ana',
  email: 'ana@correo.mx',
  age: 24,
  city: 'Guadalajara',
  bio: 'Recién llegada a Guadalajara. Me gusta correr temprano y los juegos de mesa.',
  intents: ['friend', 'plan', 'hobby'],
  interests: ['Correr', 'Café', 'Juegos de mesa', 'Lectura', 'Conciertos'],
  decoration: 'none',
  frame: 'none',
  effect: 'none',
  nameStyle: 'none',
  occupation: '',
  education: '',
  languages: ['Español'],
  availability: 'Cualquier día',
  prompts: [
    { q: 'Mi domingo perfecto', a: '' },
    { q: 'Busco a alguien que', a: '' },
    { q: 'No puedo dejar de hablar de', a: '' },
  ],
  favorites: { music: '', movie: '', food: '' },
  gallery: [],
  gender: 'unsaid',
  intentPrefs: {},
}

const INITIAL: State = {
  loggedIn: false,
  onboarded: false,
  me: EMPTY_ME,
  tier: 'free',
  likesToday: 0,
  likesDay: '',
  goldenUsed: 0,
  goldenWeek: '',
  decisions: { p3: 'like' },
  connections: ['p3', 'p2', ...BOT_CONNECTIONS],
  messages: SEED_MESSAGES,
  joinedPlans: [],
  plans: PLANS,
  blocked: [],
  reports: SEED_REPORTS,
  suspended: [],
  filters: DEFAULT_FILTERS,
  minutesToday: 0,
  limitMinutes: 60,
  snoozedUntilMinute: 0,
  arleth: true,
}

// Las cuentas anteriores guardaban estas preferencias solo para planes
function migrate(me: Profile & { planSizes?: IntentPrefs['sizes']; planPeople?: IntentPrefs['people'] }): Profile {
  const { planSizes, planPeople, ...rest } = me
  // La cuenta de demostración ya estaba verificada antes de que verificar fuera obligatorio
  const merged = { ...EMPTY_ME, ...rest, verified: rest.verified ?? rest.email === DEMO_ME.email }
  if (planSizes?.length || (planPeople && planPeople !== 'any')) {
    merged.intentPrefs = { ...merged.intentPrefs, plan: { sizes: planSizes ?? [], people: planPeople ?? 'any', genders: [] } }
  }
  return merged
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return INITIAL
    const saved = JSON.parse(raw) as State
    const plans = [
      ...(saved.plans ?? []).filter((p) => !PLANS.some((seed) => seed.id === p.id)),
      ...PLANS.map((seed) => ({ ...seed, ...saved.plans?.find((p) => p.id === seed.id) })),
    ]
    // Arleth ya es una conexión también en las sesiones guardadas (una sola vez)
    const withArleth = saved.arleth
      ? {}
      : {
          arleth: true,
          connections: (saved.blocked ?? []).includes('p3') ? saved.connections : ['p3', ...(saved.connections ?? []).filter((c) => c !== 'p3')],
          decisions: { ...saved.decisions, p3: 'like' as const },
          messages: { ...SEED_MESSAGES, ...saved.messages, p3: saved.messages?.['p3']?.length ? saved.messages['p3'] : SEED_MESSAGES['p3'] },
        }
    return { ...INITIAL, ...saved, ...withArleth, plans, me: migrate(saved.me) }
  } catch {
    return INITIAL
  }
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly state = signal<State>(load())
  private toastId = 0

  readonly loggedIn = computed(() => this.state().loggedIn)
  readonly onboarded = computed(() => this.state().onboarded)
  readonly me = computed(() => this.state().me)
  readonly verified = computed(() => !!this.state().me.verified)
  readonly tier = computed(() => this.state().tier)
  // Los contadores solo valen para el día (o la semana) en que se guardaron
  readonly likesToday = computed(() => (this.state().likesDay === dayKey() ? this.state().likesToday : 0))
  readonly goldenUsed = computed(() => (this.state().goldenWeek === weekKey() ? this.state().goldenUsed : 0))
  readonly likesLeft = computed(() => Math.max(0, TIERS[this.state().tier].likesPerDay - this.likesToday()))
  readonly goldenLeft = computed(() => Math.max(0, TIERS[this.state().tier].goldenPerWeek - this.goldenUsed()))
  readonly golden = computed(() => this.state().golden ?? [])
  readonly decisions = computed(() => this.state().decisions)
  readonly connections = computed(() => this.state().connections)
  readonly messages = computed(() => this.state().messages)
  readonly joinedPlans = computed(() => this.state().joinedPlans)
  readonly plans = computed(() => this.state().plans)
  readonly blocked = computed(() => this.state().blocked)
  readonly reports = computed(() => this.state().reports)
  readonly suspended = computed(() => this.state().suspended)
  readonly filters = computed(() => this.state().filters)
  readonly minutesToday = computed(() => this.state().minutesToday)
  readonly limitMinutes = computed(() => this.state().limitMinutes)
  readonly snoozedUntilMinute = computed(() => this.state().snoozedUntilMinute)
  readonly stages = computed(() => this.state().stages ?? {})

  // Los avisos y el último match no se guardan
  readonly toasts = signal<Toast[]>([])
  readonly lastMatch = signal<string | null>(null)
  readonly typing = signal<string | null>(null)
  readonly ambient = signal<string | null>(null)
  // Tinta del halo del fondo; si es null se usa la intención preferida
  readonly backdropTone = signal<Intent | null>(null)

  readonly homeUrl = computed(() => (this.state().loggedIn && this.state().onboarded ? '/app/descubre' : '/'))

  // La intención hacia la que más se inclina: la que más "me interesa" ha recibido
  readonly preferredIntent = computed<Intent>(() => {
    const { me, decisions } = this.state()
    const counts = new Map<Intent, number>()
    for (const [id, d] of Object.entries(decisions)) {
      if (d !== 'like') continue
      for (const i of PEOPLE.find((p) => p.id === id)?.intents ?? []) {
        if (me.intents.includes(i)) counts.set(i, (counts.get(i) ?? 0) + 1)
      }
    }
    let best: Intent = me.intents[0] ?? 'friend'
    let max = 0
    for (const i of me.intents) {
      const c = counts.get(i) ?? 0
      if (c > max) {
        max = c
        best = i
      }
    }
    return best
  })

  constructor() {
    effect(() => {
      const snapshot = JSON.stringify(this.state())
      try {
        localStorage.setItem(KEY, snapshot)
      } catch {
        /* almacenamiento no disponible: los datos duran solo esta visita */
      }
    })
  }

  private patch(p: Partial<State> | ((s: State) => Partial<State>)) {
    this.state.update((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }))
  }

  login(email: string) {
    this.patch((s) => ({
      loggedIn: true,
      onboarded: s.me.email === email ? s.onboarded : true,
      me: s.me.email === email ? s.me : { ...DEMO_ME, email },
    }))
  }

  logout() {
    this.patch({ loggedIn: false })
  }

  updateProfile(p: Partial<Profile>) {
    this.patch((s) => ({ me: { ...s.me, ...p } }))
  }

  decide(id: string, d: 'like' | 'pass'): 'match' | 'liked' | 'passed' | 'limit' | 'unverified' {
    const s = this.state()
    if (d === 'like' && !s.me.verified) return 'unverified'
    if (d === 'pass') {
      this.patch({ decisions: { ...s.decisions, [id]: 'pass' } })
      return 'passed'
    }
    if (this.likesLeft() <= 0) return 'limit'
    const mutual = !!PEOPLE.find((p) => p.id === id)?.likesYou
    this.patch({
      decisions: { ...s.decisions, [id]: 'like' },
      likesToday: this.likesToday() + 1,
      likesDay: dayKey(),
      connections: mutual && !s.connections.includes(id) ? [id, ...s.connections] : s.connections,
    })
    return mutual ? 'match' : 'liked'
  }

  /**
   * "Me interesa" a algo concreto (una foto o una pregunta) con comentario opcional,
   * como en Hinge: si el interés es mutuo, el comentario llega como primer mensaje.
   * Con golden, es un hilo dorado: comentario obligatorio y aparece primero (no obliga a responder).
   */
  likeWith(id: string, about: string, comment: string, golden = false): 'match' | 'liked' | 'passed' | 'limit' | 'no-golden' | 'unverified' {
    if (golden && this.goldenLeft() <= 0) return 'no-golden'
    const r = this.decide(id, 'like')
    if (r === 'limit' || r === 'unverified') return r
    const text = comment.trim() ? `Sobre ${about}: ${comment.trim()}` : ''
    this.patch((s) => ({
      ...(golden ? { goldenUsed: this.goldenUsed() + 1, goldenWeek: weekKey(), golden: [...new Set([...(s.golden ?? []), id])] } : {}),
      ...(r === 'match' && text ? { messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), { id: crypto.randomUUID(), from: 'me', text, at: Date.now() }] } } : {}),
    }))
    return r
  }

  announceMatch(id: string) {
    this.lastMatch.set(id)
  }

  clearMatch() {
    this.lastMatch.set(null)
  }

  // Hablar con tus conexiones no tiene límite: no se cobra por conversar
  sendMessage(id: string, text: string): 'sent' | 'unverified' {
    const s = this.state()
    if (!s.me.verified) return 'unverified'
    const msg: Message = { id: crypto.randomUUID(), from: 'me', text, at: Date.now() }
    this.patch({ messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), msg] } })
    // Respuesta simulada para la demostración
    this.typing.set(id)
    window.setTimeout(() => {
      this.typing.set(null)
      const reply: Message = {
        id: crypto.randomUUID(),
        from: id,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        at: Date.now(),
      }
      this.patch((st) => ({ messages: { ...st.messages, [id]: [...(st.messages[id] ?? []), reply] } }))
    }, 1400)
    return 'sent'
  }

  /** Propone un plan en el chat; en la demostración, la otra persona lo acepta al momento. */
  proposePlan(id: string, plan: Omit<PlanPropuesto, 'status'>) {
    const msg: Message = { id: crypto.randomUUID(), from: 'me', text: `Te propongo: ${plan.title}`, at: Date.now(), plan: { ...plan, status: 'propuesto' } }
    this.patch((s) => ({ messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), msg] } }))
    this.typing.set(id)
    window.setTimeout(() => {
      this.typing.set(null)
      const reply: Message = { id: crypto.randomUUID(), from: id, text: '¡Va! Ahí nos vemos.', at: Date.now() }
      this.patch((st) => ({
        messages: {
          ...st.messages,
          [id]: [...(st.messages[id] ?? []).map((m) => (m.id === msg.id && m.plan ? { ...m, plan: { ...m.plan, status: 'aceptado' as const } } : m)), reply],
        },
      }))
    }, 1400)
  }

  /** Mueve un plan propuesto: queda pendiente de que la otra persona acepte la nueva fecha. */
  movePlan(id: string, messageId: string, when: string) {
    this.patch((s) => ({
      messages: { ...s.messages, [id]: (s.messages[id] ?? []).map((m) => (m.id === messageId && m.plan ? { ...m, plan: { ...m.plan, when, status: 'movido' as const } } : m)) },
    }))
  }

  setStage(id: string, stage: Etapa | null) {
    this.patch((s) => {
      const stages = { ...(s.stages ?? {}) }
      if (stage) stages[id] = stage
      else delete stages[id]
      return { stages }
    })
  }

  /** Verificación con selfie de pose aleatoria (simulada en la demo): gratis siempre. */
  verify() {
    this.patch((s) => ({ me: { ...s.me, verified: true } }))
  }

  /** Registro de 13 pasos terminado: cuenta creada y perfil listo. */
  completeSignup(me: Profile) {
    this.patch({ loggedIn: true, onboarded: true, me })
  }

  toggleJoin(planId: string): 'ok' | 'unverified' {
    const st = this.state()
    if (!st.joinedPlans.includes(planId) && !st.me.verified) return 'unverified'
    this.patch((s) => {
      const joined = s.joinedPlans.includes(planId)
      return {
        joinedPlans: joined ? s.joinedPlans.filter((p) => p !== planId) : [...s.joinedPlans, planId],
        plans: s.plans.map((p) =>
          p.id === planId ? { ...p, attendees: joined ? p.attendees.filter((a) => a !== 'me') : [...p.attendees, 'me'] } : p,
        ),
      }
    })
    return 'ok'
  }

  createPlan(p: Omit<Plan, 'id' | 'hostId' | 'attendees'>) {
    this.patch((s) => {
      const id = `pl${Date.now()}`
      return {
        plans: [{ ...p, id, hostId: 'me', attendees: ['me'] }, ...s.plans],
        joinedPlans: [...s.joinedPlans, id],
      }
    })
  }

  // Quita la conexión y su conversación; la persona no vuelve a Descubre porque ya hubo decisión
  removeConnection(id: string) {
    this.patch((s) => {
      const messages = { ...s.messages }
      delete messages[id]
      return { connections: s.connections.filter((c) => c !== id), messages }
    })
  }

  // Borra los mensajes de una conversación; la conexión sigue
  clearChat(id: string) {
    this.patch((s) => ({ messages: { ...s.messages, [id]: [] } }))
  }

  // Quita de una vez las conexiones en las que nadie ha escrito; devuelve cuántas fueron
  removeSilentConnections() {
    const s = this.state()
    const silent = s.connections.filter((c) => !s.messages[c]?.length)
    if (silent.length) this.patch({ connections: s.connections.filter((c) => !silent.includes(c)) })
    return silent.length
  }

  // Nuevo orden de las conexiones (solo acepta las mismas personas)
  setConnectionOrder(ids: string[]) {
    this.patch((s) => {
      const known = ids.filter((id) => s.connections.includes(id))
      const rest = s.connections.filter((id) => !known.includes(id))
      return { connections: [...known, ...rest] }
    })
  }

  block(id: string) {
    this.patch((s) => ({
      blocked: [...new Set([...s.blocked, id])],
      connections: s.connections.filter((c) => c !== id),
    }))
  }

  report(id: string, reason: string, detail: string) {
    this.patch((s) => ({
      reports: [{ id: `r${Date.now()}`, reportedId: id, reporter: 'Tú', reason, detail, at: Date.now(), status: 'pendiente' }, ...s.reports],
    }))
  }

  moderate(reportId: string, status: Report['status']) {
    this.patch((s) => {
      const r = s.reports.find((x) => x.id === reportId)
      return {
        reports: s.reports.map((x) => (x.id === reportId ? { ...x, status } : x)),
        suspended: status === 'suspendido' && r ? [...new Set([...s.suspended, r.reportedId])] : s.suspended,
      }
    })
  }

  setTier(tier: Tier) {
    this.patch({ tier })
  }

  setFilters(f: Partial<Filters>) {
    this.patch((s) => ({ filters: { ...s.filters, ...f } }))
  }

  tickMinute() {
    this.patch((s) => ({ minutesToday: s.minutesToday + 1 }))
  }

  snooze(minutes: number) {
    this.patch((s) => ({ snoozedUntilMinute: s.minutesToday + minutes }))
  }

  readonly ajustes = computed(() => ({ ...AJUSTES_BASE, ...this.state().ajustes }))

  setAjustes(a: Partial<Ajustes>) {
    this.patch((s) => ({ ajustes: { ...AJUSTES_BASE, ...s.ajustes, ...a } }))
  }

  setLimitMinutes(limitMinutes: number) {
    this.patch({ limitMinutes })
  }

  triggerNudgeNow() {
    this.patch((s) => ({ minutesToday: Math.max(s.minutesToday, s.limitMinutes), snoozedUntilMinute: 0 }))
  }

  toast(text: string, tone: Toast['tone'] = 'info') {
    const id = ++this.toastId
    this.toasts.update((t) => [...t, { id, text, tone }])
    window.setTimeout(() => this.dismissToast(id), 3200)
  }

  dismissToast(id: number) {
    this.toasts.update((t) => t.filter((x) => x.id !== id))
  }

  deleteAccount() {
    this.state.set(INITIAL)
  }
}
