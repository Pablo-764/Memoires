import type { PlanPropuesto } from '../utilidades/etapas'
import type { Intent } from '../modelos/intents'
import type { Gender, PlanAudience, PlanSize } from '../modelos/plan-formats'
import type { DecorationKey } from '../modelos/plans'
import { BOTS, BOT_DETAILS, BOT_MESSAGES, BOT_PLANS, BOT_REPORTS } from './bots'

export interface Person {
  id: string
  name: string
  age: number
  city: string
  bio: string
  intents: Intent[]
  interests: string[]
  hue: number // color del avatar ilustrado
  likesYou: boolean // simula el interés recíproco
  verified: boolean
  languages: string[]
  availability: 'Entre semana' | 'Fines de semana' | 'Cualquier día'
  decoration: DecorationKey
  frame?: string
  effect?: string
  nameStyle?: string
  groupSizes?: PlanSize[]
  gender?: Gender
}

const BASE_PEOPLE: Person[] = [
  { id: 'p1', name: 'Mariana', age: 24, city: 'Guadalajara', bio: 'Llegué hace dos meses por la maestría. Busco con quién correr los domingos en Los Colomos.', intents: ['friend', 'plan'], interests: ['Correr', 'Café', 'Lectura', 'Senderismo'], hue: 18, likesYou: true, verified: true, languages: ['Español', 'Inglés'], availability: 'Fines de semana', decoration: 'dusk', frame: 'oro', effect: 'flores', nameStyle: 'coral', groupSizes: ['small', 'large'], gender: 'woman' },
  { id: 'p2', name: 'Diego', age: 27, city: 'Guadalajara', bio: 'Desarrollador, fan de los juegos de mesa. Organizo una noche de Catan cada quince días.', intents: ['hobby', 'friend'], interests: ['Juegos de mesa', 'Programación', 'Videojuegos', 'Café'], hue: 220, likesYou: true, verified: true, languages: ['Español'], availability: 'Entre semana', decoration: 'plano', frame: 'neon', effect: 'destellos', nameStyle: 'cielo', groupSizes: ['small'], gender: 'man' },
  { id: 'p3', name: 'Arleth', age: 19, city: 'Guadalajara', bio: 'Fotografío atardeceres y flores silvestres. Me encantaría encontrar a alguien para ver estrellas en Tapalpa.', intents: ['romance', 'plan'], interests: ['Fotografía', 'Flores', 'Atardeceres', 'Música en vivo'], hue: 330, likesYou: true, verified: true, languages: ['Español', 'Francés'], availability: 'Fines de semana', decoration: 'aurora', frame: 'aurora', effect: 'estrellas', nameStyle: 'lavanda-cursiva', groupSizes: ['duo'], gender: 'woman' },
  { id: 'p4', name: 'Andrés', age: 22, city: 'Guadalajara', bio: 'Estudiante de diseño. Dibujo en cafés y siempre ando buscando exposiciones nuevas.', intents: ['hobby', 'friend', 'romance'], interests: ['Dibujo', 'Café', 'Teatro', 'Cine'], hue: 150, likesYou: false, verified: false, languages: ['Español'], availability: 'Cualquier día', decoration: 'cuaderno', frame: 'halo', effect: 'hojas', nameStyle: 'none', groupSizes: ['duo', 'small'], gender: 'nonbinary' },
  { id: 'p5', name: 'Sofía', age: 29, city: 'Guadalajara', bio: 'Me cambié de Monterrey por trabajo. Quiero gente para ir a conciertos y probar restaurantes.', intents: ['friend', 'plan', 'romance'], interests: ['Conciertos', 'Cocina', 'Música en vivo', 'Viajes'], hue: 40, likesYou: true, verified: true, languages: ['Español', 'Inglés'], availability: 'Fines de semana', decoration: 'confetti', frame: 'arcoiris', effect: 'corazones', nameStyle: 'rosa', groupSizes: ['duo', 'small'], gender: 'woman' },
  { id: 'p6', name: 'Emiliano', age: 26, city: 'Guadalajara', bio: 'Practico japonés y veo demasiado anime. Busco compañeros de intercambio de idiomas.', intents: ['hobby'], interests: ['Anime', 'Idiomas', 'Videojuegos', 'Lectura'], hue: 265, likesYou: false, verified: true, languages: ['Español', 'Japonés'], availability: 'Entre semana', decoration: 'galaxia', frame: 'orbita', effect: 'lunas', nameStyle: 'uva', groupSizes: ['small'], gender: 'man' },
  { id: 'p7', name: 'Renata', age: 23, city: 'Guadalajara', bio: 'Yoga por la mañana, cine de autor por la noche. Recién llegada de Puebla.', intents: ['friend', 'romance'], interests: ['Yoga', 'Cine', 'Lectura', 'Café'], hue: 300, likesYou: true, verified: false, languages: ['Español'], availability: 'Cualquier día', decoration: 'ink', frame: 'latido', effect: 'luciernagas', nameStyle: 'oro-cursiva', groupSizes: ['duo'], gender: 'woman' },
  { id: 'p8', name: 'Tomás', age: 28, city: 'Guadalajara', bio: 'Juego futbol los martes y me falta gente para el equipo. También cocino bastante bien.', intents: ['plan', 'hobby', 'romance'], interests: ['Futbol', 'Gimnasio', 'Cocina', 'Correr'], hue: 95, likesYou: false, verified: true, languages: ['Español'], availability: 'Entre semana', decoration: 'bosque', frame: 'selva', effect: 'burbujas', nameStyle: 'esmeralda', groupSizes: ['small', 'large'], gender: 'man' },
  { id: 'p9', name: 'Camila', age: 31, city: 'Ciudad de México', bio: 'Teatro, idiomas y largas caminatas por Coyoacán.', intents: ['friend'], interests: ['Teatro', 'Idiomas', 'Café'], hue: 10, likesYou: true, verified: true, languages: ['Español', 'Inglés'], availability: 'Fines de semana', decoration: 'rosa-polar', frame: 'plata', effect: 'plumas', nameStyle: 'none', groupSizes: ['small'], gender: 'woman' },
]

export const PEOPLE: Person[] = [...BASE_PEOPLE, ...BOTS]

export interface Plan {
  id: string
  title: string
  description: string
  place: string
  when: string
  hostId: string
  intent: Intent
  capacity: number
  attendees: string[]
  audience?: PlanAudience
  photo?: { src: string; alt: string; credit: string }
}

const BASE_PLANS: Plan[] = [
  { id: 'pl1', title: 'Correr 5 km en Los Colomos', description: 'Ritmo tranquilo, sin dejar a nadie atrás. Después vamos por café.', place: 'Bosque Los Colomos, entrada Chapultepec', when: 'Domingo 8:00', hostId: 'p1', intent: 'plan', capacity: 8, attendees: ['p1', 'p8', 'p5'], photo: { src: '/fotos/correr.webp', alt: 'Tres personas corren por una banqueta soleada', credit: 'Nathan Nuyda' } },
  { id: 'pl2', title: 'Noche de juegos de mesa', description: 'Catan, Codenames y lo que traigan. Principiantes bienvenidos.', place: 'Café La Mesa, Chapultepec', when: 'Viernes 19:30', hostId: 'p2', intent: 'hobby', capacity: 6, attendees: ['p2', 'p4'], audience: 'interests', photo: { src: '/fotos/juegos.webp', alt: 'Dos personas juegan un juego de mesa', credit: '2H Media' } },
  { id: 'pl3', title: 'Concierto en el Teatro Diana', description: 'Tengo dos boletos extra para el sábado. Nos vemos antes para cenar.', place: 'Teatro Diana', when: 'Sábado 20:00', hostId: 'p5', intent: 'plan', capacity: 3, attendees: ['p5'], audience: 'intent', photo: { src: '/fotos/concierto.webp', alt: 'Público frente a un escenario iluminado', credit: 'Yvette de Wit' } },
  { id: 'pl4', title: 'Intercambio de idiomas', description: 'Una hora de japonés, una de inglés y una de español. Trae ganas de platicar.', place: 'Biblioteca Iberoamericana', when: 'Miércoles 18:00', hostId: 'p6', intent: 'hobby', capacity: 10, attendees: ['p6', 'p7', 'p2', 'p4'], audience: 'interests', photo: { src: '/fotos/biblioteca.webp', alt: 'Sala de lectura con libreros y mesas', credit: 'Jim Petkiewicz' } },
  { id: 'pl5', title: 'Café para platicar', description: 'Acabo de llegar a la ciudad. Una hora de plática tranquila, sin compromiso.', place: 'Café Palreal, Lafayette', when: 'Jueves 17:30', hostId: 'p7', intent: 'friend', capacity: 2, attendees: ['p7'], audience: 'any', photo: { src: '/fotos/cafe.webp', alt: 'Dos personas conversan en una mesa de un café', credit: 'tommao wang' } },
]

export const PLANS: Plan[] = [...BASE_PLANS, ...BOT_PLANS]

// Planes a los que ya fuiste (datos de prueba mientras no hay backend)
export interface PastPlan {
  id: string
  title: string
  intent: Intent
  // Fecha y hora en que se cumplió
  date: string
  time: string
  // Quiénes fueron (ids de personas; 'me' eres tú)
  people: string[]
  photo?: string
}

export const PAST_PLANS: PastPlan[] = [
  { id: 'pp1', title: 'café con Mariana', intent: 'friend', date: '2026-10-18', time: '10:30', people: ['me', 'p1'], photo: 'fotos/cafe.webp' },
  { id: 'pp2', title: 'corrimos 5 km', intent: 'plan', date: '2026-10-26', time: '08:00', people: ['me', 'p1', 'p8', 'p5'], photo: 'fotos/correr.webp' },
  { id: 'pp3', title: 'noche de juegos: gané', intent: 'hobby', date: '2026-11-01', time: '19:30', people: ['me', 'p2', 'p4'], photo: 'fotos/juegos.webp' },
  { id: 'pp4', title: 'tacos después del cine', intent: 'plan', date: '2026-11-06', time: '21:00', people: ['me', 'p4'] },
  { id: 'pp6', title: 'flores para Arleth', intent: 'romance', date: '2026-11-11', time: '18:00', people: ['me', 'p3'] },
  { id: 'pp5', title: 'club de lectura, cap. 3', intent: 'hobby', date: '2026-11-09', time: '17:00', people: ['me', 'p3', 'p2'], photo: 'fotos/biblioteca.webp' },
]

export interface Message {
  id: string
  from: 'me' | string
  text: string
  at: number
  // Mensaje estructurado "Proponer plan" (fecha, lugar y tipo)
  plan?: PlanPropuesto
}

const BASE_MESSAGES: Record<string, Message[]> = {
  p3: [
    { id: 'a1', from: 'p3', text: '¡Hola! Me encantaron tus fotos. ¿Vamos a ver el atardecer el sábado?', at: Date.now() - 1000 * 60 * 30 },
    { id: 'a2', from: 'me', text: 'Me encantaría, Arleth. Llevo flores.', at: Date.now() - 1000 * 60 * 25 },
    { id: 'a3', from: 'p3', text: 'Trato hecho: yo llevo el café y tú las flores.', at: Date.now() - 1000 * 60 * 20 },
  ],
  p2: [
    { id: 'm1', from: 'p2', text: '¡Hola! Vi que también te gustan los juegos de mesa. ¿Has jugado Catan?', at: Date.now() - 1000 * 60 * 60 * 5 },
    { id: 'm2', from: 'me', text: 'Sí, aunque siempre pierdo por no cambiar ovejas, jaja.', at: Date.now() - 1000 * 60 * 60 * 4.8 },
    { id: 'm3', from: 'p2', text: 'Jaja, eso tiene arreglo. Este viernes hay noche de juegos, por si te animas.', at: Date.now() - 1000 * 60 * 60 * 4.7 },
  ],
}

export const SEED_MESSAGES: Record<string, Message[]> = { ...BASE_MESSAGES, ...BOT_MESSAGES }

export const AUTO_REPLIES = [
  'Me parece muy buena idea, ¿qué día te queda mejor?',
  '¡Claro! Yo también acabo de llegar a la ciudad.',
  'Jaja, me pasa igual. ¿Vamos por un café y lo platicamos?',
  'Suena bien. ¿Te late el fin de semana?',
]

export interface Report {
  id: string
  reportedId: string
  reporter: string
  reason: string
  detail: string
  at: number
  status: 'pendiente' | 'descartado' | 'advertido' | 'suspendido'
}

const BASE_REPORTS: Report[] = [
  { id: 'r1', reportedId: 'p4', reporter: 'Usuario 1042', reason: 'Perfil falso', detail: 'Las fotos parecen de otra persona.', at: Date.now() - 1000 * 60 * 90, status: 'pendiente' },
  { id: 'r2', reportedId: 'p8', reporter: 'Usuario 877', reason: 'Mensajes ofensivos', detail: 'Insultó después de que rechacé el plan.', at: Date.now() - 1000 * 60 * 60 * 7, status: 'pendiente' },
  { id: 'r3', reportedId: 'p6', reporter: 'Usuario 2210', reason: 'Spam', detail: 'Envía el mismo enlace a todos.', at: Date.now() - 1000 * 60 * 60 * 26, status: 'advertido' },
]

export const SEED_REPORTS: Report[] = [...BASE_REPORTS, ...BOT_REPORTS]

export function personById(id: string) {
  return PEOPLE.find((p) => p.id === id)
}

export interface PersonDetails {
  occupation: string
  education: string
  memberSince: string
  prompts: { q: string; a: string }[]
  favorites: { music: string; movie: string; food: string }
}

const BASE_DETAILS: Record<string, PersonDetails> = {
  p1: { occupation: 'Maestría en urbanismo', education: 'Universidad de Guadalajara', memberSince: 'Desde agosto de 2026', prompts: [{ q: 'Mi domingo perfecto', a: 'Correr temprano, café largo y cero pendientes.' }, { q: 'Busco a alguien que', a: 'No se rinda en el kilómetro tres.' }, { q: 'Lo último que leí', a: 'Una novela sobre ciudades que no existen.' }], favorites: { music: 'Natalia Lafourcade', movie: 'Roma', food: 'Chilaquiles verdes' } },
  p2: { occupation: 'Desarrollador de software', education: 'Ingeniería en computación', memberSince: 'Desde mayo de 2026', prompts: [{ q: 'No puedo dejar de hablar de', a: 'Por qué las ovejas son lo mejor de Catan.' }, { q: 'Mi plan ideal un viernes', a: 'Mesa grande, juegos nuevos y pizza.' }, { q: 'Te caeré bien si', a: 'Lees las reglas antes de empezar.' }], favorites: { music: 'Daft Punk', movie: 'Interestelar', food: 'Pizza de pepperoni' } },
  p3: { occupation: 'Fotógrafa de paisajes', education: 'Artes visuales', memberSince: 'Desde junio de 2026', prompts: [{ q: 'El lugar al que siempre vuelvo', a: 'Tapalpa, justo cuando baja la neblina.' }, { q: 'Busco a alguien que', a: 'Se levante antes del amanecer sin quejarse.' }, { q: 'Mi talento inútil', a: 'Adivinar la hora por la luz.' }], favorites: { music: 'Bon Iver', movie: 'Amélie', food: 'Tacos de birria' } },
  p4: { occupation: 'Estudiante de diseño', education: 'Diseño gráfico', memberSince: 'Desde septiembre de 2026', prompts: [{ q: 'Siempre traigo conmigo', a: 'Una libreta medio llena de caras.' }, { q: 'Mi café ideal', a: 'Una mesa junto a la ventana y buena luz.' }, { q: 'Te recomiendo', a: 'Ir a una exposición sin leer nada antes.' }], favorites: { music: 'Mac DeMarco', movie: 'El viaje de Chihiro', food: 'Pan dulce' } },
  p5: { occupation: 'Gerente de proyectos', education: 'Administración', memberSince: 'Desde julio de 2026', prompts: [{ q: 'Lo mejor de mudarme', a: 'Tener una lista infinita de restaurantes.' }, { q: 'Mi plan ideal un sábado', a: 'Concierto, cena tarde y plática hasta cerrar.' }, { q: 'No me pierdo', a: 'Ninguna banda nueva en el Teatro Diana.' }], favorites: { music: 'Zoé', movie: 'La La Land', food: 'Ramen picante' } },
  p6: { occupation: 'Traductor independiente', education: 'Lenguas modernas', memberSince: 'Desde abril de 2026', prompts: [{ q: 'Estoy aprendiendo', a: 'A pedir ramen sin señalar el menú.' }, { q: 'Mi serie para recomendar', a: 'Cualquiera con más de cien capítulos.' }, { q: 'Busco a alguien que', a: 'Me corrija el japonés sin piedad.' }], favorites: { music: 'Joe Hisaishi', movie: 'Your Name', food: 'Onigiri' } },
  p7: { occupation: 'Instructora de yoga', education: 'Psicología', memberSince: 'Desde octubre de 2026', prompts: [{ q: 'Mi rutina no negociable', a: 'Yoga al amanecer y cine de autor de noche.' }, { q: 'Busco a alguien que', a: 'Se quede a platicar la película después.' }, { q: 'Lo que extraño de Puebla', a: 'Las cemitas de mi calle.' }], favorites: { music: 'Rosalía', movie: 'Y tu mamá también', food: 'Cemitas poblanas' } },
  p8: { occupation: 'Entrenador deportivo', education: 'Ciencias del deporte', memberSince: 'Desde marzo de 2026', prompts: [{ q: 'Me falta gente para', a: 'Completar el equipo de los martes.' }, { q: 'Cocino muy bien', a: 'Mole, pero solo si me ayudas a lavar.' }, { q: 'Mi plan ideal', a: 'Partido, carne asada y buena sobremesa.' }], favorites: { music: 'Caifanes', movie: 'Rocky', food: 'Carne asada' } },
  p9: { occupation: 'Actriz de teatro', education: 'Artes escénicas', memberSince: 'Desde febrero de 2026', prompts: [{ q: 'Mi lugar favorito', a: 'Las banquetas de Coyoacán un domingo.' }, { q: 'Busco a alguien que', a: 'Aguante una caminata larga y una obra larga.' }, { q: 'Hablo', a: 'Español, inglés y mucho con las manos.' }], favorites: { music: 'Julieta Venegas', movie: 'Frida', food: 'Churros' } },
}

export const PERSON_DETAILS: Record<string, PersonDetails> = { ...BASE_DETAILS, ...BOT_DETAILS }
