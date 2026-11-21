import { GARANTIAS, SIEMPRE_GRATIS, TIERS, TIER_ORDER } from './plans'
import { FILAS } from '../componentes/tier-cards/tier-cards'

describe('planes de pago', () => {
  it('ningún beneficio de pago promete matches', () => {
    const textos = [
      JSON.stringify(TIERS),
      ...GARANTIAS,
      ...SIEMPRE_GRATIS,
      ...FILAS.flatMap((f) => [f.label, ...TIER_ORDER.map((t) => String(f.value(t)))]),
    ]
    for (const t of textos) expect(t).not.toMatch(/match/i)
  })

  it('ya no hay límites de conexiones ni de palabras', () => {
    for (const t of TIER_ORDER) {
      expect(TIERS[t]).not.toHaveProperty('weeklyMatches')
      expect(TIERS[t]).not.toHaveProperty('weeklyWords')
    }
  })

  it('Lucidité tiene tope de “me interesa”: nada es ilimitado en atención', () => {
    expect(Number.isFinite(TIERS.lucidite.likesPerDay)).toBe(true)
    expect(TIERS.free.likesPerDay).toBeLessThan(TIERS.grand.likesPerDay)
    expect(TIERS.grand.likesPerDay).toBeLessThan(TIERS.lucidite.likesPerDay)
  })

  it('los precios se conservan', () => {
    expect(TIERS.grand.priceMxn).toBe(92.5)
    expect(TIERS.lucidite.priceMxn).toBe(185)
  })
})
