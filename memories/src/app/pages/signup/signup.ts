import { Component, DestroyRef, OnInit, computed, effect, inject, input, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AppStore, EMPTY_ME, type Profile } from '../../servicios/app-store'
import { CITIES, INTENTS, INTENT_ORDER, type Intent } from '../../modelos/intents'
import { GENDERS, GENDER_ORDER, EMPTY_PREFS, type Gender } from '../../modelos/plan-formats'
import { fitImage } from '../../utilidades/image'
import { Logo } from '../../componentes/logo/logo'
import { Icon } from '../../componentes/icon/icon'
import { ChoiceChip } from '../../componentes/choice-chip/choice-chip'
import { InterestPicker } from '../../componentes/interest-picker/interest-picker'
import { IntentBadge } from '../../componentes/intent-badge/intent-badge'
import { Seal } from '../../componentes/seal/seal'
import { APERTURAS, PRONOMBRES, PROMPTS_POR_INTENCION, REGLAS, ZONAS } from './signup-data'
import { AFIRMACIONES, EJES, ejesDe } from '../../modelos/personalidad'

const KEY = 'memoires-registro'
export const TOTAL = 13

export interface Borrador {
  paso: number
  contacto: string
  nombre: string
  nacimiento: string
  intenciones: Intent[]
  pronombres: string
  genero: Gender | 'unsaid'
  verA: Partial<Record<Intent, Gender[]>>
  ciudad: string
  zona: string
  intereses: string[]
  prompts: { q: string; a: string }[]
  fotos: string[]
  respuestas: number[]
  hizoTest: boolean
  verificado: boolean
  aperturas: string[]
  reglas: string[]
}

const VACIO: Borrador = {
  paso: 1,
  contacto: '',
  nombre: '',
  nacimiento: '',
  intenciones: [],
  pronombres: '',
  genero: 'unsaid',
  verA: {},
  ciudad: 'Guadalajara',
  zona: '',
  intereses: [],
  prompts: [],
  fotos: [],
  respuestas: Array(12).fill(0),
  hizoTest: false,
  verificado: false,
  aperturas: [],
  reglas: [],
}

export function edadDe(fecha: string, hoy = new Date()) {
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return 0
  let age = hoy.getFullYear() - d.getFullYear()
  if (hoy.getMonth() < d.getMonth() || (hoy.getMonth() === d.getMonth() && hoy.getDate() < d.getDate())) age--
  return age
}

function leer(): Borrador {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...VACIO, ...JSON.parse(raw) } : VACIO
  } catch {
    return VACIO
  }
}

// Ilustración de ejemplo (para la demostración, sin subir archivos)
function ejemplo(letra: string, hue: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='oklch(0.62 0.1 ${hue})'/><circle cx='50' cy='42' r='18' fill='oklch(0.9 0.03 ${hue})'/><rect x='24' y='66' width='52' height='34' rx='17' fill='oklch(0.9 0.03 ${hue})'/><text x='8' y='18' font-size='12' font-family='sans-serif' fill='white'>${letra}</text></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

/**
 * Crear cuenta en 13 pantallas cortas (Hinge y Boo, con lo mejor de las demás): una
 * pregunta por pantalla, barra de progreso hecha de hilo y una constelación que se arma
 * de fondo. El borrador se guarda en el navegador para salir y volver sin perder nada
 * (la contraseña nunca se guarda).
 */
@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, Logo, Icon, ChoiceChip, InterestPicker, IntentBadge, Seal],
  styleUrl: './signup.css',
  templateUrl: './signup.html',
})
export class Signup implements OnInit {
  /** Intención elegida al arrastrar el hilo en la portada (?intencion=friend). */
  readonly intencion = input<string>()

  private readonly store = inject(AppStore)
  private readonly router = inject(Router)

  protected readonly b = signal<Borrador>(leer())
  protected readonly password = signal('')
  protected readonly total = TOTAL
  protected readonly intents = INTENTS
  protected readonly order = INTENT_ORDER
  protected readonly cities = CITIES
  protected readonly genders = GENDERS
  protected readonly genderOrder = GENDER_ORDER
  protected readonly pronombres = PRONOMBRES
  protected readonly zonas = ZONAS
  protected readonly afirmaciones = AFIRMACIONES
  protected readonly ejes = EJES
  protected readonly aperturasOpc = APERTURAS
  protected readonly reglasOpc = REGLAS
  protected readonly anudando = signal(false)
  protected readonly revisando = signal(false)
  protected readonly error = signal('')

  protected readonly paso = computed(() => this.b().paso)
  protected readonly edad = computed(() => edadDe(this.b().nacimiento))
  protected readonly tinta = computed(() => this.b().intenciones[0] ?? null)
  protected readonly ejesTest = computed(() => ejesDe(this.b().respuestas))
  protected readonly catalogo = computed(() => {
    const out = new Set<string>()
    for (const i of this.b().intenciones) PROMPTS_POR_INTENCION[i].forEach((q) => out.add(q))
    PROMPTS_POR_INTENCION.general.forEach((q) => out.add(q))
    return [...out]
  })
  protected readonly pose = 'Levanta el pulgar junto a tu cara'
  protected readonly pregunta = signal(0)
  protected readonly escala = ['Nada', 'Poco', 'Neutral', 'Bastante', 'Mucho']
  protected arrastrando = 0
  // Trece estrellas que se unen conforme avanzas
  protected readonly estrellas = Array.from({ length: TOTAL }, (_, i) => {
    const a = i * 2.4
    const r = 60 + ((i * 53) % 120)
    return { x: Math.round(200 + Math.cos(a) * r), y: Math.round(200 + Math.sin(a) * r * 0.8) }
  })

  // Qué hace válida cada pantalla
  protected readonly valido = computed(() => {
    const b = this.b()
    switch (b.paso) {
      case 1: {
        const correo = /^\S+@\S+\.\S+$/.test(b.contacto)
        const tel = /^\+?\d{10,13}$/.test(b.contacto.replace(/[\s-]/g, ''))
        return (correo || tel) && this.password().length >= 8
      }
      case 2:
        return b.nombre.trim().length >= 2 && this.edad() >= 18
      case 3:
        return b.intenciones.length > 0
      case 5:
        return !!b.zona
      case 6:
        return b.intereses.length >= 5
      case 7:
        return b.prompts.length === 3 && b.prompts.every((p) => p.a.trim().length >= 2)
      case 8:
        return b.fotos.length >= 2
      case 11:
        return b.aperturas.length === 3
      case 12:
        return b.reglas.length === REGLAS.length
      default:
        return true
    }
  })

  protected readonly mensajePaso = computed(() => {
    const b = this.b()
    if (b.paso === 1 && b.contacto && !/^\S+@\S+\.\S+$/.test(b.contacto) && !/^\+?\d{10,13}$/.test(b.contacto.replace(/[\s-]/g, ''))) return 'Escribe un correo válido o un teléfono de 10 dígitos.'
    if (b.paso === 1 && this.password() && this.password().length < 8) return 'La contraseña necesita al menos 8 caracteres.'
    if (b.paso === 2 && b.nacimiento && this.edad() < 18) return 'mémoires es solo para mayores de 18 años.'
    return ''
  })

  constructor() {
    // Guardar el borrador en cada cambio (sin la contraseña)
    effect(() => {
      const b = this.b()
      try {
        localStorage.setItem(KEY, JSON.stringify(b))
      } catch {
        /* sin almacenamiento: el borrador dura esta visita */
      }
    })
    // La primera intención elegida tiñe todo el flujo
    effect(() => this.store.backdropTone.set(this.tinta()))
    inject(DestroyRef).onDestroy(() => this.store.backdropTone.set(null))
  }

  ngOnInit() {
    const i = this.intencion() as Intent | undefined
    if (i && i in INTENTS && !this.b().intenciones.length) this.set({ intenciones: [i] })
  }

  protected set(cambio: Partial<Borrador>) {
    this.b.update((b) => ({ ...b, ...cambio }))
  }

  protected toggle<K extends 'intenciones' | 'intereses' | 'aperturas' | 'reglas'>(k: K, v: Borrador[K][number], max = Infinity) {
    const l = this.b()[k] as unknown[]
    const next = l.includes(v) ? l.filter((x) => x !== v) : l.length < max ? [...l, v] : l
    this.set({ [k]: next } as Partial<Borrador>)
  }

  protected toggleVerA(i: Intent, g: Gender) {
    const cur = this.b().verA[i] ?? []
    this.set({ verA: { ...this.b().verA, [i]: cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g] } })
  }

  protected togglePrompt(q: string) {
    const p = this.b().prompts
    if (p.some((x) => x.q === q)) this.set({ prompts: p.filter((x) => x.q !== q) })
    else if (p.length < 3) this.set({ prompts: [...p, { q, a: '' }] })
  }

  protected elegida(q: string) {
    return this.b().prompts.some((p) => p.q === q)
  }

  protected quitarFoto(i: number) {
    this.set({ fotos: this.b().fotos.filter((_, k) => k !== i) })
  }

  protected answer(q: string, a: string) {
    this.set({ prompts: this.b().prompts.map((p) => (p.q === q ? { ...p, a } : p)) })
  }

  protected setRespuesta(i: number, v: number) {
    const r = [...this.b().respuestas]
    r[i] = v
    this.set({ respuestas: r, hizoTest: true })
  }

  protected async addFoto(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    try {
      // Recorte guiado: cuadrado y centrado
      const url = await fitImage(file, 640, 640)
      this.set({ fotos: [...this.b().fotos, url].slice(0, 6) })
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo leer la imagen.')
    }
  }

  protected fotosEjemplo() {
    this.set({ fotos: [ejemplo('1', 30), ejemplo('2', 200)] })
  }

  protected moverFoto(from: number, to: number) {
    const f = [...this.b().fotos]
    if (to < 0 || to >= f.length) return
    const [x] = f.splice(from, 1)
    f.splice(to, 0, x)
    this.set({ fotos: f })
  }

  protected verificar() {
    this.revisando.set(true)
    setTimeout(() => {
      this.revisando.set(false)
      this.set({ verificado: true })
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900)
  }

  protected atras() {
    if (this.paso() === 9 && this.pregunta() > 0) this.pregunta.update((n) => n - 1)
    else if (this.paso() > 1) this.set({ paso: this.paso() - 1 })
  }

  /** Avanza; el test (9) y la verificación (10) se pueden saltar. */
  protected siguiente(saltar = false) {
    if (!saltar && !this.valido()) return
    // El test va de una afirmación a la vez dentro de la misma pantalla
    if (!saltar && this.paso() === 9 && this.pregunta() < AFIRMACIONES.length - 1) {
      if (!this.b().hizoTest) this.set({ hizoTest: true })
      this.pregunta.update((n) => n + 1)
      return
    }
    if (saltar && this.paso() === 9) this.set({ hizoTest: false })
    if (this.paso() < TOTAL) {
      this.set({ paso: this.paso() + 1 })
      scrollTo({ top: 0 })
    } else this.terminar()
  }

  /** Paso 13: el hilo de la barra se anuda (momento firma) y se crea la cuenta. */
  protected terminar() {
    const b = this.b()
    const perfil: Profile = {
      ...EMPTY_ME,
      name: b.nombre.trim(),
      email: b.contacto,
      age: this.edad(),
      city: b.ciudad,
      zone: b.zona,
      intents: b.intenciones,
      interests: b.intereses,
      prompts: b.prompts,
      photo: b.fotos[0],
      gallery: b.fotos.slice(1),
      gender: b.genero,
      pronouns: b.pronombres || undefined,
      intentPrefs: Object.fromEntries(b.intenciones.map((i) => [i, { ...EMPTY_PREFS, genders: b.verA[i] ?? [] }])),
      personality: b.hizoTest ? this.ejesTest() : undefined,
      verified: b.verificado,
      openers: b.aperturas,
      rulesAccepted: true,
    }
    this.anudando.set(true)
    const listo = () => {
      this.store.completeSignup(perfil)
      try {
        localStorage.removeItem(KEY)
      } catch {
        /* nada que limpiar */
      }
      this.router.navigateByUrl('/app/descubre')
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) listo()
    else setTimeout(listo, 1100)
  }

  protected salir() {
    this.router.navigateByUrl('/')
  }
}
