// Zona y colonia de cada lugar de la demostración, para los filtros encadenados de Planes
// (primero la zona y luego la colonia de esa zona). Solo se muestra la ciudad y el lugar
// público del plan; nunca la ubicación de una persona.
export interface Zona {
  zona: string
  colonia: string
}

const LUGARES: { match: string; zona: string; colonia: string }[] = [
  { match: 'Biblioteca Iberoamericana', zona: 'Centro', colonia: 'Centro Histórico' },
  { match: 'Teatro Diana', zona: 'Centro', colonia: 'Centro Histórico' },
  { match: 'Los Colomos', zona: 'Poniente', colonia: 'Providencia' },
  { match: 'Chapultepec', zona: 'Poniente', colonia: 'Americana' },
  { match: 'Lafayette', zona: 'Poniente', colonia: 'Lafayette' },
  { match: 'Tlaquepaque', zona: 'Sur', colonia: 'Tlaquepaque Centro' },
  { match: 'Zapopan', zona: 'Norte', colonia: 'Zapopan Centro' },
]

export const OTRA = 'Otras zonas'

export function zonaDe(lugar: string): Zona {
  const hit = LUGARES.find((l) => lugar.toLowerCase().includes(l.match.toLowerCase()))
  return hit ? { zona: hit.zona, colonia: hit.colonia } : { zona: OTRA, colonia: '' }
}
