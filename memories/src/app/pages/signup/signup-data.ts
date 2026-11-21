import type { Intent } from '../../modelos/intents'

// Preguntas de perfil por intención (Hinge): se eligen 3 y se responden en la tarjeta
export const PROMPTS_POR_INTENCION: Record<Intent | 'general', string[]> = {
  romance: ['Mi primera cita ideal', 'Me enamora que alguien', 'Lo que más valoro en una pareja'],
  friend: ['Te caeré bien si', 'Un domingo conmigo es', 'Busco a alguien que'],
  plan: ['Mi plan perfecto de domingo', 'Siempre digo que sí a', 'El lugar al que siempre vuelvo'],
  hobby: ['Un pasatiempo que te enseñaría', 'No puedo dejar de hablar de', 'Mi talento inútil'],
  general: ['Lo último que me hizo reír', 'Mi domingo perfecto'],
}

export const REGLAS = [
  { key: 'respeto', texto: 'Trato a todas las personas con respeto, aunque no me interesen.' },
  { key: 'fotos', texto: 'Mis fotos son recientes y soy yo.' },
  { key: 'publico', texto: 'Los primeros encuentros son en lugares públicos.' },
  { key: 'datos', texto: 'No comparto datos ni fotos de otras personas sin su permiso.' },
]

export const PRONOMBRES = ['ella', 'él', 'elle']

export const ZONAS = [
  { key: 'Centro', x: 200, y: 160 },
  { key: 'Poniente', x: 110, y: 150 },
  { key: 'Norte', x: 190, y: 70 },
  { key: 'Oriente', x: 290, y: 150 },
  { key: 'Sur', x: 200, y: 245 },
]
