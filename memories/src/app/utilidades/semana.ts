import { fold } from './text-search'

const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export interface Dia {
  key: number // día de la semana (0 domingo)
  corto: string
  numero: number
  hoy: boolean
}

/** Los próximos siete días a partir de hoy, para la franja de calendario. */
export function proximosDias(hoy = new Date()): Dia[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    return { key: d.getDay(), corto: CORTOS[d.getDay()], numero: d.getDate(), hoy: i === 0 }
  })
}

/** Día de la semana de un plan ("Sábado 17:00" → 6); null si no se reconoce. */
export function diaDe(when: string): number | null {
  const first = fold(when.trim().split(/\s+/)[0] ?? '')
  const i = DIAS.indexOf(first)
  return i >= 0 ? i : null
}

/** Hora para ordenar la agenda ("Sábado 17:00" → 1020 minutos). */
export function minutosDe(when: string) {
  const m = when.match(/(\d{1,2}):(\d{2})/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : 24 * 60
}
