import { OTRA, zonaDe } from './zonas'

describe('zonaDe', () => {
  it('ubica los lugares conocidos en su zona y colonia', () => {
    expect(zonaDe('Café Palreal, Lafayette')).toEqual({ zona: 'Poniente', colonia: 'Lafayette' })
    expect(zonaDe('Teatro Diana')).toEqual({ zona: 'Centro', colonia: 'Centro Histórico' })
  })

  it('manda lo desconocido a otras zonas sin inventar colonia', () => {
    expect(zonaDe('Boliche Plaza del Sol')).toEqual({ zona: OTRA, colonia: '' })
  })
})
