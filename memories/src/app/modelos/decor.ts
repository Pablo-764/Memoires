import type { IconName } from '../componentes/icon/icons'
import type { Tier } from './plans'

export type DecorTier = 'free' | 'grand' | 'lucidite'

export interface Banner {
  key: string
  label: string
  group: string
  css: string
  anim?: string
  tier: DecorTier
}

export interface Frame {
  key: string
  label: string
  bg: string
  width: number
  anim?: string
  tier: DecorTier
}

export interface Effect {
  key: string
  label: string
  icon: IconName | null
  dir: 'up' | 'down' | 'twinkle' | 'drift'
  colors: string[]
  tier: DecorTier
}

export interface NameStyle {
  key: string
  label: string
  color: string | null
  italic?: boolean
  tier: DecorTier
}

const RANK: Record<DecorTier, number> = { free: 0, grand: 1, lucidite: 2 }

export function canUse(tier: Tier, item: { tier: DecorTier }) {
  return RANK[tier] >= RANK[item.tier]
}

const b = (key: string, label: string, group: string, css: string, tier: DecorTier = 'lucidite', anim?: string): Banner => ({ key, label, group, css, tier, anim })

export const BANNERS: Banner[] = [
  { key: 'none', label: 'Sin fondo', group: 'Cielos', css: 'var(--color-raised)', tier: 'free' },
  b('halo', 'Halo', 'Cielos', 'radial-gradient(circle at 50% 60%, #e3e6fc, #9aa3ee 70%)', 'grand'),
  b('dusk', 'Atardecer', 'Cielos', 'linear-gradient(170deg, #fde3c4, #f6b8a8 60%, #d98aa6)', 'grand'),
  b('alba', 'Alba', 'Cielos', 'linear-gradient(180deg, #ffd9c0, #ffeedd 55%, #cfe3ff)', 'grand'),
  b('aurora', 'Aurora', 'Cielos', 'linear-gradient(120deg, #bfeee3, #cdd4fb 50%, #f4cfe0)'),
  b('marea', 'Marea', 'Cielos', 'linear-gradient(200deg, #a1c4fd, #c2e9fb)', 'grand'),
  b('durazno', 'Durazno', 'Cielos', 'linear-gradient(135deg, #ffecd2, #fcb69f)', 'grand'),
  b('lavanda', 'Lavanda', 'Cielos', 'linear-gradient(160deg, #e9d8fd, #c4b5fd 60%, #a78bfa)'),
  b('crepusculo', 'Crepúsculo', 'Cielos', 'linear-gradient(170deg, #2b1b4d, #7b3f98 60%, #f08a5d)'),
  b('tormenta', 'Tormenta', 'Cielos', 'linear-gradient(170deg, #4b5a78, #232a3f)'),
  b('rosa-polar', 'Rosa polar', 'Cielos', 'linear-gradient(150deg, #fbc2eb, #a6c1ee)'),
  b('cereza', 'Cereza', 'Cielos', 'linear-gradient(140deg, #ffdde1, #ee9ca7)'),
  b('ink', 'Tinta', 'Noche', 'radial-gradient(120% 90% at 20% 0%, #3a3e70, #15172e)'),
  b('nebulosa', 'Nebulosa', 'Noche', 'radial-gradient(60% 70% at 30% 30%, #b14aed99, transparent), radial-gradient(60% 70% at 72% 70%, #2dd4bf88, transparent), #0f1130', 'lucidite', 'bg-breathe'),
  b('estrellas', 'Cielo estrellado', 'Noche', 'radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 80% 60%, #fff, transparent), radial-gradient(1px 1px at 35% 75%, #fff, transparent), radial-gradient(1px 1px at 90% 85%, #fff, transparent), linear-gradient(180deg, #0b1030, #27305f)'),
  b('galaxia', 'Galaxia', 'Noche', 'conic-gradient(from 210deg at 60% 40%, #17123c, #4b1d78, #1b3a7a, #0b6a7c, #17123c)'),
  b('eclipse', 'Eclipse', 'Noche', 'radial-gradient(circle at 50% 110%, #ffb36b 0 18%, #ff6f61 28%, #3a1b52 55%, #0d0b22 80%)'),
  b('neon-noche', 'Neón', 'Noche', 'linear-gradient(115deg, #ff2e93, #7a2cff, #00d4ff, #ff2e93)', 'lucidite', 'bg-flow'),
  b('prisma', 'Prisma', 'Vivos', 'linear-gradient(115deg, #ff9a9e, #fad0c4, #a18cd1, #84fab0, #ff9a9e)', 'lucidite', 'bg-flow'),
  b('fuego', 'Fuego', 'Vivos', 'linear-gradient(115deg, #f83600, #fe8c00, #f9d423, #f83600)', 'lucidite', 'bg-flow'),
  b('sirena', 'Sirena', 'Vivos', 'linear-gradient(115deg, #00c9a7, #00b4db, #845ec2, #00c9a7)', 'lucidite', 'bg-flow'),
  b('caramelo', 'Caramelo', 'Vivos', 'linear-gradient(115deg, #ffc3a0, #ffafbd, #c9a7eb, #ffc3a0)', 'lucidite', 'bg-flow'),
  b('lima', 'Lima', 'Vivos', 'linear-gradient(120deg, #d4fc79, #96e6a1)'),
  b('mandarina', 'Mandarina', 'Vivos', 'linear-gradient(135deg, #ff9966, #ff5e62)'),
  b('uva', 'Uva', 'Vivos', 'linear-gradient(135deg, #8e2de2, #4a00e0)'),
  b('oceano', 'Océano', 'Vivos', 'linear-gradient(135deg, #2193b0, #6dd5ed)'),
  b('bosque', 'Bosque', 'Vivos', 'linear-gradient(160deg, #134e5e, #71b280)'),
  b('sandia', 'Sandía', 'Vivos', 'linear-gradient(135deg, #f43b47, #453a94)'),
  b('confetti', 'Confeti', 'Texturas', 'radial-gradient(circle, #ff8fb4 2.5px, transparent 3px) 0 0 / 38px 38px, radial-gradient(circle, #f3c560 2.5px, transparent 3px) 18px 22px / 52px 52px, radial-gradient(circle, #a6adff 2.5px, transparent 3px) 30px 8px / 44px 44px, #2b1f3f', 'grand'),
  b('puntos', 'Puntos', 'Texturas', 'radial-gradient(circle, #ffffff66 2px, transparent 2.5px) 0 0 / 20px 20px, #4552c9', 'grand'),
  b('rayas', 'Rayas', 'Texturas', 'repeating-linear-gradient(45deg, #f6b8a8 0 14px, #fde3c4 14px 28px)', 'grand'),
  b('cuadros', 'Cuadros', 'Texturas', 'repeating-conic-gradient(#262a5c 0 25%, #34397a 0 50%) 0 0 / 44px 44px'),
  b('tartan', 'Tartán', 'Texturas', 'repeating-linear-gradient(0deg, #b2335f55 0 14px, transparent 14px 42px), repeating-linear-gradient(90deg, #1f746455 0 14px, transparent 14px 42px), #f3e9d2'),
  b('escamas', 'Escamas', 'Texturas', 'radial-gradient(circle at 50% 0, transparent 17px, #6fd5bd 18px, #1f7464 24px, transparent 25px) 0 0 / 40px 24px, #123f3a'),
  b('ondas', 'Ondas', 'Texturas', 'repeating-radial-gradient(circle at 50% 120%, #a6adff 0 3px, #262a5c 3px 22px)'),
  b('zigzag', 'Zigzag', 'Texturas', 'linear-gradient(135deg, #f3c560 25%, transparent 25%) -18px 0 / 36px 36px, linear-gradient(225deg, #f3c560 25%, transparent 25%) -18px 0 / 36px 36px, linear-gradient(315deg, #f3c560 25%, transparent 25%) 0 0 / 36px 36px, linear-gradient(45deg, #f3c560 25%, #b2335f 25%) 0 0 / 36px 36px'),
  b('diamantes', 'Diamantes', 'Texturas', 'repeating-linear-gradient(45deg, #ffffff22 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, #ffffff22 0 2px, transparent 2px 22px), #7b3f98'),
  b('cuaderno', 'Cuaderno', 'Texturas', 'repeating-linear-gradient(0deg, #4552c933 0 1px, transparent 1px 22px), #fbf7ec'),
  b('plano', 'Plano', 'Texturas', 'linear-gradient(#ffffff26 1px, transparent 1px) 0 0 / 26px 26px, linear-gradient(90deg, #ffffff26 1px, transparent 1px) 0 0 / 26px 26px, #1b3a7a'),
  b('terrazo', 'Terrazo', 'Texturas', 'radial-gradient(5px 3px at 20% 30%, #b2335f, transparent), radial-gradient(4px 6px at 70% 20%, #1f7464, transparent), radial-gradient(6px 4px at 40% 75%, #8f5d00, transparent), radial-gradient(3px 5px at 85% 70%, #4552c9, transparent), radial-gradient(4px 3px at 10% 80%, #464866, transparent), #efe9df'),
  b('sol', 'Sol', 'Texturas', 'repeating-conic-gradient(from 0deg at 50% 100%, #f9d423 0 10deg, #ff7e5f 10deg 20deg)'),
  b('arcoiris', 'Arcoíris', 'Texturas', 'radial-gradient(circle at 50% 120%, #fff 0 22%, #ff8fb4 22% 30%, #f3c560 30% 38%, #6fd5bd 38% 46%, #a6adff 46% 54%, #cfe3ff 54%)'),
]

const f = (key: string, label: string, bg: string, tier: DecorTier = 'lucidite', width = 0.07, anim?: string): Frame => ({ key, label, bg, tier, width, anim })

export const FRAMES: Frame[] = [
  { key: 'none', label: 'Sin marco', bg: 'transparent', width: 0, tier: 'free' },
  f('halo', 'Halo', '#7f8af0', 'grand'),
  f('dusk', 'Atardecer', 'linear-gradient(160deg, #fde3c4, #f6b8a8, #d98aa6)', 'grand'),
  f('rosa', 'Rosa', '#ff8fb4', 'grand'),
  f('oro', 'Oro', 'linear-gradient(135deg, #fff1b8, #f3c560, #a8741a, #f3c560)', 'grand', 0.09),
  f('plata', 'Plata', 'linear-gradient(135deg, #ffffff, #b9c0d0, #6c7388, #d8dde8)', 'grand', 0.09),
  f('menta', 'Menta', '#6fd5bd', 'grand'),
  f('confeti', 'Confeti', 'conic-gradient(#ff8fb4 0 25%, #f3c560 0 50%, #6fd5bd 0 75%, #a6adff 0)'),
  f('arcoiris', 'Arcoíris', 'conic-gradient(#ff8fb4, #f3c560, #6fd5bd, #a6adff, #ff8fb4)', 'lucidite', 0.09, 'frame-spin'),
  f('aurora', 'Aurora', 'conic-gradient(#6fd5bd, #cdd4fb, #f4cfe0, #6fd5bd)', 'lucidite', 0.08, 'frame-spin'),
  f('neon', 'Neón', 'conic-gradient(#ff2e93, #7a2cff, #00d4ff, #ff2e93)', 'lucidite', 0.08, 'frame-spin'),
  f('fuego', 'Fuego', 'conic-gradient(#f83600, #fe8c00, #f9d423, #fe8c00, #f83600)', 'lucidite', 0.1, 'frame-spin'),
  f('oceano', 'Océano', 'conic-gradient(#00c9a7, #00b4db, #2193b0, #00c9a7)', 'lucidite', 0.09, 'frame-spin'),
  f('cometa', 'Cometa', 'conic-gradient(transparent 0 62%, #fff 100%)', 'lucidite', 0.08, 'frame-spin'),
  f('orbita', 'Órbita', 'conic-gradient(transparent 0 80%, #f3c560 0 86%, transparent 0 96%, #ff8fb4 0)', 'lucidite', 0.08, 'frame-spin'),
  f('puntos', 'Puntos', 'repeating-conic-gradient(#f3c560 0 10deg, transparent 10deg 24deg)'),
  f('rayitas', 'Rayitas', 'repeating-conic-gradient(#a6adff 0 4deg, transparent 4deg 12deg)', 'lucidite', 0.1),
  f('corona', 'Corona', 'repeating-conic-gradient(#f3c560 0 18deg, #a8741a 18deg 36deg)', 'lucidite', 0.12),
  f('petalos', 'Pétalos', 'repeating-conic-gradient(#ff8fb4 0 20deg, #ffd1e0 20deg 40deg)', 'lucidite', 0.12),
  f('caramelo', 'Caramelo', 'repeating-conic-gradient(#ff5e62 0 15deg, #fff 15deg 30deg)', 'lucidite', 0.1, 'frame-spin-slow'),
  f('hielo', 'Hielo', 'repeating-conic-gradient(#cfe3ff 0 15deg, #6dd5ed 15deg 30deg)', 'lucidite', 0.1, 'frame-spin-slow'),
  f('selva', 'Selva', 'repeating-conic-gradient(#71b280 0 22deg, #134e5e 22deg 44deg)', 'lucidite', 0.1),
  f('latido', 'Latido', '#ff5c8a', 'lucidite', 0.08, 'frame-pulse'),
  f('radar', 'Radar', '#6fd5bd', 'lucidite', 0.06, 'frame-pulse'),
  f('lucero', 'Lucero', '#f3c560', 'lucidite', 0.06, 'frame-pulse'),
  f('uva', 'Uva', 'linear-gradient(135deg, #8e2de2, #4a00e0)', 'lucidite', 0.09),
  f('sandia', 'Sandía', 'linear-gradient(135deg, #f43b47, #453a94)', 'lucidite', 0.09),
  f('noche', 'Noche', 'linear-gradient(135deg, #3a3e70, #15172e)', 'lucidite', 0.11),
  f('tinta', 'Tinta', '#191a33', 'lucidite', 0.05),
  f('hilo', 'Hilo', '#ffffff', 'lucidite', 0.025),
]

const PASTEL = ['#ff8fb4', '#f3c560', '#6fd5bd', '#a6adff']
const e = (key: string, label: string, icon: IconName | null, dir: Effect['dir'], colors: string[], tier: DecorTier = 'lucidite'): Effect => ({ key, label, icon, dir, colors, tier })

export const EFFECTS: Effect[] = [
  { key: 'none', label: 'Sin efecto', icon: null, dir: 'up', colors: [], tier: 'free' },
  e('corazones', 'Corazones', 'heart', 'up', ['#ff5c8a', '#ff8fb4', '#ffd1e0'], 'grand'),
  e('destellos', 'Destellos', 'sparkles', 'twinkle', ['#ffffff', '#f3c560'], 'grand'),
  e('estrellas', 'Estrellas', 'star', 'twinkle', ['#f3c560', '#fff1b8'], 'grand'),
  e('nieve', 'Nieve', 'snowflake', 'down', ['#ffffff', '#cfe3ff']),
  e('hojas', 'Hojas', 'leaf', 'down', ['#71b280', '#f3c560', '#d98a4a']),
  e('flores', 'Flores', 'flower-2', 'drift', ['#ff8fb4', '#ffffff', '#f3c560']),
  e('notas', 'Música', 'music', 'up', ['#a6adff', '#ffffff']),
  e('lunas', 'Lunas', 'moon-star', 'twinkle', ['#fff1b8', '#cdd4fb']),
  e('rayos', 'Rayos', 'zap', 'twinkle', ['#f9d423', '#fe8c00']),
  e('plumas', 'Plumas', 'feather', 'down', ['#ffffff', '#cdd4fb']),
  e('nubes', 'Nubes', 'cloud', 'drift', ['#ffffffcc', '#cfe3ffcc']),
  e('gemas', 'Gemas', 'gem', 'twinkle', ['#6fd5bd', '#a6adff', '#ff8fb4']),
  e('coronas', 'Coronas', 'crown', 'up', ['#f3c560', '#fff1b8']),
  e('cafes', 'Cafés', 'coffee', 'up', ['#d9b38c', '#fff1e0']),
  e('burbujas', 'Burbujas', null, 'up', ['#ffffff99', '#cfe3ff99']),
  e('luciernagas', 'Luciérnagas', null, 'drift', ['#f9d423', '#d4fc79']),
  e('confeti', 'Confeti', null, 'down', PASTEL),
]

const n = (key: string, label: string, color: string | null, tier: DecorTier = 'lucidite', italic = false): NameStyle => ({ key, label, color, tier, italic })

export const NAME_STYLES: NameStyle[] = [
  { key: 'none', label: 'Normal', color: null, tier: 'free' },
  n('cursiva', 'Cursiva', null, 'grand', true),
  n('rosa', 'Rosa', '#e0457f', 'grand'),
  n('oro', 'Oro', '#c48a12', 'grand'),
  n('menta', 'Menta', '#23a487'),
  n('cielo', 'Cielo', '#3d8fe0'),
  n('lavanda', 'Lavanda', '#8a6be8'),
  n('coral', 'Coral', '#f0654f'),
  n('uva', 'Uva', '#9b3fd1'),
  n('esmeralda', 'Esmeralda', '#159a5b'),
  n('rosa-cursiva', 'Rosa cursiva', '#e0457f', 'lucidite', true),
  n('oro-cursiva', 'Oro cursiva', '#c48a12', 'lucidite', true),
  n('lavanda-cursiva', 'Lavanda cursiva', '#8a6be8', 'lucidite', true),
]

export const TOTAL_STYLES = BANNERS.length + FRAMES.length + EFFECTS.length + NAME_STYLES.length - 4

const find = <T extends { key: string }>(list: T[], key: string | undefined) => list.find((x) => x.key === key) ?? list[0]
export const bannerOf = (key?: string) => find(BANNERS, key)
export const frameOf = (key?: string) => find(FRAMES, key)
export const effectOf = (key?: string) => find(EFFECTS, key)
export const nameStyleOf = (key?: string) => find(NAME_STYLES, key)
