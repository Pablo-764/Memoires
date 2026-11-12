import { LABELS, PHRASES, SHAPE_BY_INTENT, phrasesFor } from './inflados'

describe('inflados', () => {
  it('cada intención tiene su forma', () => {
    expect(SHAPE_BY_INTENT).toEqual({ romance: 'heart', friend: 'cup', plan: 'ticket', hobby: 'star' })
  })

  it('las frases son bonitas, incluyen a Arleth y pasatiempo usa los intereses', () => {
    for (const list of Object.values(PHRASES)) expect(list.some((x) => x.includes('Arleth'))).toBe(true)
    expect(phrasesFor('hobby', ['Ajedrez', 'Cine'])).toEqual(['Ajedrez', 'Arleth', 'Cine'])
    expect(LABELS.romance(0)).toContain('Arleth')
  })
})
