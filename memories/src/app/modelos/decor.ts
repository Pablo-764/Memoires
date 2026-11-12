import type { IconName } from '../componentes/icon/icons'
import type { Tier } from './plans'

export type DecorTier = 'free' | 'grand' | 'lucidite'

// Escena animada que se dibuja encima del color base de cada fondo
export type BannerScene =
  | 'static' | 'mesh' | 'aurora' | 'stars' | 'galaxy' | 'sun' | 'flow' | 'waves' | 'rain' | 'rings' | 'pattern'
  // Escenas temáticas (solo la idea visual de cada género, sin obras concretas)
  | 'city' | 'hyper' | 'code' | 'planet' | 'portal' | 'synth' | 'crt' | 'spotlight' | 'noir' | 'film' | 'comic' | 'fog' | 'castle' | 'anime'

export interface Banner {
  key: string
  label: string
  group: string
  // Color base; también sirve de miniatura estática
  css: string
  scene: BannerScene
  // Tintas de la escena (manchas, cintas, olas o anillos)
  colors: string[]
  tier: DecorTier
}

// Capa animada extra del marco
export type FrameFx = 'none' | 'glow' | 'orbit' | 'atom' | 'sparkle' | 'ripple' | 'shimmer' | 'dash' | 'double'

export interface Frame {
  key: string
  label: string
  group: string
  bg: string
  width: number
  anim?: string
  fx: FrameFx
  // Color de lunas, destellos, ondas o del segundo aro
  accent?: string
  tier: DecorTier
}

export type EffectDir = 'up' | 'down' | 'twinkle' | 'drift' | 'orbit' | 'burst' | 'float' | 'rain' | 'bubble' | 'flip'
// Figura de la partícula cuando no lleva icono
export type EffectShape = 'dot' | 'ring' | 'star' | 'petal' | 'confetti' | 'streamer' | 'streak' | 'glow' | 'balloon' | 'glyph'

export interface Effect {
  key: string
  label: string
  group: string
  icon: IconName | null
  dir: EffectDir
  colors: string[]
  shape: EffectShape
  tier: DecorTier
}

// Efecto animado del nombre (neón, holograma, terminal…)
export type NameFx = 'neon' | 'hologram' | 'terminal' | 'chrome' | 'glitch' | 'marquee' | 'noir' | 'film' | 'comic' | 'spooky' | 'rune' | 'drama'

export interface NameStyle {
  key: string
  label: string
  color: string | null
  italic?: boolean
  fx?: NameFx
  tier: DecorTier
}

const RANK: Record<DecorTier, number> = { free: 0, grand: 1, lucidite: 2 }

export function canUse(tier: Tier, item: { tier: DecorTier }) {
  return RANK[tier] >= RANK[item.tier]
}

const b = (key: string, label: string, group: string, scene: BannerScene, css: string, colors: string[] = [], tier: DecorTier = 'lucidite'): Banner => ({
  key,
  label,
  group,
  css,
  scene,
  colors,
  tier,
})

export const BANNERS: Banner[] = [
  { key: 'none', label: 'Sin fondo', group: 'Cielos', css: 'var(--color-raised)', scene: 'static', colors: [], tier: 'free' },
  b('halo', 'Halo', 'Cielos', 'mesh', 'linear-gradient(160deg, #dfe3ff, #aab2f4)', ['#8f9bff', '#f1d6ff', '#c8f0ff'], 'grand'),
  b('dusk', 'Atardecer', 'Cielos', 'mesh', 'linear-gradient(170deg, #fde3c4, #f6b8a8 60%, #d98aa6)', ['#ff9e7a', '#ffd59a', '#d77ba8'], 'grand'),
  b('alba', 'Alba', 'Cielos', 'mesh', 'linear-gradient(180deg, #ffd9c0, #ffeedd 55%, #cfe3ff)', ['#ffc29e', '#b8d6ff', '#fff1c9'], 'grand'),
  b('aurora', 'Aurora', 'Cielos', 'aurora', 'linear-gradient(180deg, #0d2a3a, #1b4b5c)', ['#5ff2c4', '#9f8bff', '#ff9ccd']),
  b('marea', 'Marea', 'Cielos', 'waves', 'linear-gradient(180deg, #cfe6ff, #8fb9f6)', ['#ffffff99', '#6c9eea', '#3f6fc6'], 'grand'),
  b('durazno', 'Durazno', 'Cielos', 'mesh', 'linear-gradient(135deg, #ffecd2, #fcb69f)', ['#ff9f80', '#ffe0a8', '#ffc4c4'], 'grand'),
  b('lavanda', 'Lavanda', 'Cielos', 'mesh', 'linear-gradient(160deg, #e9d8fd, #b9a6fb)', ['#a78bfa', '#f3c6ff', '#c9d8ff']),
  b('crepusculo', 'Crepúsculo', 'Cielos', 'sun', 'linear-gradient(180deg, #2b1b4d, #7b3f98 58%, #f08a5d)', ['#ffd08a', '#ff8a5c']),
  b('tormenta', 'Tormenta', 'Cielos', 'rain', 'linear-gradient(170deg, #55647f, #232a3f)', ['#ffffff']),
  b('rosa-polar', 'Rosa polar', 'Cielos', 'mesh', 'linear-gradient(150deg, #fbc2eb, #a6c1ee)', ['#ff9ad8', '#8fb4ff', '#ffe0f4']),
  b('cereza', 'Cereza', 'Cielos', 'mesh', 'linear-gradient(140deg, #ffdde1, #ee9ca7)', ['#ff7b93', '#ffd0d8', '#e06d8f']),
  b('ink', 'Tinta', 'Noche', 'stars', 'radial-gradient(120% 90% at 20% 0%, #3a3e70, #15172e)', ['#9aa3ff']),
  b('nebulosa', 'Nebulosa', 'Noche', 'aurora', 'radial-gradient(120% 120% at 50% 0%, #1d1650, #0b0c24)', ['#b14aed', '#2dd4bf', '#ff6fb5']),
  b('estrellas', 'Cielo estrellado', 'Noche', 'stars', 'linear-gradient(180deg, #0b1030, #27305f)', ['#cfd6ff']),
  b('galaxia', 'Galaxia', 'Noche', 'galaxy', 'conic-gradient(from 210deg at 60% 40%, #17123c, #4b1d78, #1b3a7a, #0b6a7c, #17123c)', ['#ffffff']),
  b('eclipse', 'Eclipse', 'Noche', 'sun', 'radial-gradient(circle at 50% 120%, #3a1b52 30%, #0d0b22 80%)', ['#ffb36b', '#ff6f61']),
  b('neon-noche', 'Neón', 'Noche', 'flow', 'linear-gradient(115deg, #ff2e93, #7a2cff, #00d4ff, #7a2cff, #ff2e93)'),
  b('prisma', 'Prisma', 'Vivos', 'flow', 'linear-gradient(115deg, #ff9a9e, #fad0c4, #a18cd1, #84fab0, #a18cd1, #ff9a9e)'),
  b('fuego', 'Fuego', 'Vivos', 'flow', 'linear-gradient(115deg, #f83600, #fe8c00, #f9d423, #fe8c00, #f83600)'),
  b('sirena', 'Sirena', 'Vivos', 'flow', 'linear-gradient(115deg, #00c9a7, #00b4db, #845ec2, #00b4db, #00c9a7)'),
  b('caramelo', 'Caramelo', 'Vivos', 'flow', 'linear-gradient(115deg, #ffc3a0, #ffafbd, #c9a7eb, #ffafbd, #ffc3a0)'),
  b('lima', 'Lima', 'Vivos', 'mesh', 'linear-gradient(120deg, #d4fc79, #96e6a1)', ['#f5ff8a', '#4fd18b', '#c4ffd9']),
  b('mandarina', 'Mandarina', 'Vivos', 'mesh', 'linear-gradient(135deg, #ff9966, #ff5e62)', ['#ffc15e', '#ff3d6e', '#ff8a4c']),
  b('uva', 'Uva', 'Vivos', 'mesh', 'linear-gradient(135deg, #8e2de2, #4a00e0)', ['#d26bff', '#3d1bd6', '#ff6bd6']),
  b('oceano', 'Océano', 'Vivos', 'waves', 'linear-gradient(180deg, #6dd5ed, #2193b0)', ['#ffffffaa', '#1a8fb0', '#0d5f86']),
  b('bosque', 'Bosque', 'Vivos', 'waves', 'linear-gradient(180deg, #a6d8a8, #134e5e)', ['#71b280aa', '#2c7a5f', '#0f3b46']),
  b('sandia', 'Sandía', 'Vivos', 'mesh', 'linear-gradient(135deg, #f43b47, #453a94)', ['#ff6b81', '#7b5cff', '#ff2e4d']),
  b('confetti', 'Confeti', 'Texturas', 'pattern', 'radial-gradient(circle, #ff8fb4 2.5px, transparent 3px) 0 0 / 38px 38px, radial-gradient(circle, #f3c560 2.5px, transparent 3px) 18px 22px / 52px 52px, radial-gradient(circle, #a6adff 2.5px, transparent 3px) 30px 8px / 44px 44px, #2b1f3f', [], 'grand'),
  b('puntos', 'Puntos', 'Texturas', 'pattern', 'radial-gradient(circle, #ffffff66 2px, transparent 2.5px) 0 0 / 20px 20px, #4552c9', [], 'grand'),
  b('rayas', 'Rayas', 'Texturas', 'pattern', 'repeating-linear-gradient(45deg, #f6b8a8 0 14px, #fde3c4 14px 28px)', [], 'grand'),
  b('cuadros', 'Cuadros', 'Texturas', 'pattern', 'repeating-conic-gradient(#262a5c 0 25%, #34397a 0 50%) 0 0 / 44px 44px'),
  b('tartan', 'Tartán', 'Texturas', 'pattern', 'repeating-linear-gradient(0deg, #b2335f55 0 14px, transparent 14px 42px), repeating-linear-gradient(90deg, #1f746455 0 14px, transparent 14px 42px), #f3e9d2'),
  b('escamas', 'Escamas', 'Texturas', 'pattern', 'radial-gradient(circle at 50% 0, transparent 17px, #6fd5bd 18px, #1f7464 24px, transparent 25px) 0 0 / 40px 24px, #123f3a'),
  b('ondas', 'Ondas', 'Texturas', 'rings', 'radial-gradient(circle at 50% 120%, #34397a, #1b1e45 70%)', ['#a6adff', '#ff8fb4', '#6fd5bd']),
  b('zigzag', 'Zigzag', 'Texturas', 'pattern', 'linear-gradient(135deg, #f3c560 25%, transparent 25%) -18px 0 / 36px 36px, linear-gradient(225deg, #f3c560 25%, transparent 25%) -18px 0 / 36px 36px, linear-gradient(315deg, #f3c560 25%, transparent 25%) 0 0 / 36px 36px, linear-gradient(45deg, #f3c560 25%, #b2335f 25%) 0 0 / 36px 36px'),
  b('diamantes', 'Diamantes', 'Texturas', 'pattern', 'repeating-linear-gradient(45deg, #ffffff22 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, #ffffff22 0 2px, transparent 2px 22px), #7b3f98'),
  b('cuaderno', 'Cuaderno', 'Texturas', 'pattern', 'repeating-linear-gradient(0deg, #4552c933 0 1px, transparent 1px 22px), #fbf7ec'),
  b('plano', 'Plano', 'Texturas', 'pattern', 'linear-gradient(#ffffff26 1px, transparent 1px) 0 0 / 26px 26px, linear-gradient(90deg, #ffffff26 1px, transparent 1px) 0 0 / 26px 26px, #1b3a7a'),
  b('terrazo', 'Terrazo', 'Texturas', 'pattern', 'radial-gradient(5px 3px at 20% 30%, #b2335f, transparent) 0 0 / 120px 90px, radial-gradient(4px 6px at 70% 20%, #1f7464, transparent) 0 0 / 120px 90px, radial-gradient(6px 4px at 40% 75%, #8f5d00, transparent) 0 0 / 120px 90px, radial-gradient(3px 5px at 85% 70%, #4552c9, transparent) 0 0 / 120px 90px, radial-gradient(4px 3px at 10% 80%, #464866, transparent) 0 0 / 120px 90px, #efe9df'),
  b('sol', 'Sol', 'Texturas', 'sun', 'linear-gradient(180deg, #ff9a5e, #ff7e5f)', ['#fff3a8', '#f9d423']),
  b('arcoiris', 'Arcoíris', 'Texturas', 'rings', 'linear-gradient(180deg, #cfe3ff, #fdf2ff)', ['#ff8fb4', '#f3c560', '#6fd5bd', '#a6adff']),

  // Más cielos y noches
  b('niebla', 'Niebla', 'Cielos', 'mesh', 'linear-gradient(180deg, #e6ebf2, #c9d3e0)', ['#ffffff', '#b8c6da', '#e9e2f5'], 'grand'),
  b('mediodia', 'Mediodía', 'Cielos', 'sun', 'linear-gradient(180deg, #7cc4ff, #cfeaff)', ['#fffbe0', '#ffd66b'], 'grand'),
  b('borealis', 'Boreal', 'Noche', 'aurora', 'linear-gradient(180deg, #06142b, #0e2d3f)', ['#3dffb0', '#3dc8ff', '#b26bff']),
  b('luna-llena', 'Luna llena', 'Noche', 'sun', 'linear-gradient(180deg, #0b1030, #1d2558)', ['#f4f1ff', '#c9cff5']),
  b('lluvia-neon', 'Lluvia neón', 'Noche', 'rain', 'linear-gradient(170deg, #2a0f4d, #0b0c24)', ['#ff2e93']),
  b('constelacion', 'Constelación', 'Noche', 'stars', 'radial-gradient(120% 90% at 80% 0%, #2c1f5c, #0b0c24)', ['#ff9fb6']),
  b('abismo', 'Abismo', 'Noche', 'waves', 'linear-gradient(180deg, #0b2a4a, #030c18)', ['#3dc8ff55', '#1b5296', '#0e2743']),

  // Más vivos
  b('tropical', 'Tropical', 'Vivos', 'flow', 'linear-gradient(115deg, #00d4a4, #c8f03a, #ffb03a, #ff4d7a, #ffb03a, #00d4a4)'),
  b('chicle', 'Chicle', 'Vivos', 'mesh', 'linear-gradient(135deg, #ffc6e6, #c6dcff)', ['#ff7fcf', '#7fb4ff', '#ffe36b']),
  b('volcan', 'Volcán', 'Vivos', 'sun', 'linear-gradient(180deg, #2a0a0a, #8a1c0f 60%, #ff5a1f)', ['#ffd36b', '#ff5a1f']),
  b('laguna', 'Laguna', 'Vivos', 'waves', 'linear-gradient(180deg, #b8fff0, #2fc3b1)', ['#ffffffaa', '#14a39a', '#0b6f73']),
  b('cosmos', 'Cosmos', 'Vivos', 'galaxy', 'conic-gradient(from 90deg at 40% 60%, #ff2e93, #7a2cff, #00d4ff, #00e08a, #ff2e93)', ['#ffffff']),

  // Más texturas
  b('ajedrez', 'Ajedrez', 'Texturas', 'pattern', 'repeating-conic-gradient(#13202f 0 25%, #f7f3ea 0 50%) 0 0 / 36px 36px'),
  b('lunares', 'Lunares', 'Texturas', 'pattern', 'radial-gradient(circle, #ffba67 6px, transparent 6.5px) 0 0 / 34px 34px, radial-gradient(circle, #ffba67 6px, transparent 6.5px) 17px 17px / 34px 34px, #9f3b59', [], 'grand'),
  b('panal', 'Panal', 'Texturas', 'pattern', 'radial-gradient(circle at 50% 50%, transparent 9px, #ffba67 10px, #ffba67 12px, transparent 13px) 0 0 / 28px 24px, radial-gradient(circle at 50% 50%, transparent 9px, #ffba67 10px, #ffba67 12px, transparent 13px) 14px 12px / 28px 24px, #3a2400'),
  b('radar', 'Radar', 'Texturas', 'rings', 'radial-gradient(circle at 50% 120%, #003b33, #001a17 70%)', ['#59dac1', '#3dffb0', '#bae1fb']),

  // Armonías: cada fondo aplica una regla del círculo cromático
  b('complementario', 'Complementario', 'Armonías', 'mesh', 'linear-gradient(135deg, #1b5296, #0e2743)', ['#ff8a3d', '#3b7ddb', '#ffb36b']),
  b('triada', 'Tríada', 'Armonías', 'mesh', 'linear-gradient(135deg, #ffe0ea, #e0f0ff)', ['#e8457a', '#ffba3a', '#3a8fe8']),
  b('tetrada', 'Tétrada', 'Armonías', 'mesh', 'linear-gradient(135deg, #fff4ea, #f1eaff)', ['#ff9fb6', '#ffba67', '#59dac1']),
  b('analogo-mar', 'Análogo mar', 'Armonías', 'flow', 'linear-gradient(115deg, #00a6a6, #2a7de1, #5a5ff0, #2a7de1, #00a6a6)'),
  b('analogo-fuego', 'Análogo fuego', 'Armonías', 'flow', 'linear-gradient(115deg, #ff4d4d, #ff8a3d, #ffc23d, #ff8a3d, #ff4d4d)'),
  b('dividido', 'Complementario dividido', 'Armonías', 'mesh', 'linear-gradient(135deg, #2b1a5c, #4a2f9a)', ['#c8e83a', '#ffb03a', '#7a4ff0']),
  b('monocromo', 'Monocromo', 'Armonías', 'waves', 'linear-gradient(180deg, #bae1fb, #6ea8ec)', ['#ffffff88', '#1b5296', '#0e2743']),

  // Cine, series y ciencia ficción: solo la idea de cada estética
  b('ciudad-neon', 'Ciudad neón', 'Ciencia ficción', 'city', 'linear-gradient(180deg, #12002b, #2a0a4a 55%, #ff2e93)', ['#00e5ff', '#ff2e93', '#7a2cff']),
  b('hiperespacio', 'Hiperespacio', 'Ciencia ficción', 'hyper', 'radial-gradient(circle at 50% 50%, #1b2a6b, #05061a 70%)', ['#bae1fb', '#ffffff']),
  b('terminal', 'Terminal', 'Ciencia ficción', 'code', 'linear-gradient(180deg, #010d06, #02200f)', ['#3dff8a', '#b8ffd2']),
  b('planeta', 'Planeta lejano', 'Ciencia ficción', 'planet', 'radial-gradient(120% 120% at 20% 0%, #1e1450, #05061a)', ['#ff9a5e', '#7a2cff', '#ffd9a8']),
  b('portal', 'Portal', 'Ciencia ficción', 'portal', 'radial-gradient(circle, #0a2a1a, #02060f 75%)', ['#3dffb0', '#7a2cff', '#bafff0']),
  b('ochentero', 'Ochentero', 'Series y programas', 'synth', 'linear-gradient(180deg, #120533, #4a0e5c 55%, #ff5fa2)', ['#ffd36b', '#ff2e93', '#00e5ff']),
  b('tele-antigua', 'Tele de antes', 'Series y programas', 'crt', 'linear-gradient(180deg, #2a2a2a, #111)', ['#ffffff']),
  b('en-vivo', 'En vivo', 'Series y programas', 'spotlight', 'radial-gradient(120% 90% at 50% 100%, #3a0f5c, #0b0420 70%)', ['#ffd36b', '#ff6fb5', '#6ee7ff']),
  b('telenovela', 'Telenovela', 'Series y programas', 'mesh', 'linear-gradient(160deg, #3a0010, #8a0f2e)', ['#ff3d6e', '#ffb3c6', '#5a0018']),
  b('cine-negro', 'Cine negro', 'Cine', 'noir', 'linear-gradient(160deg, #3a3a3a, #0c0c0c)', ['#ffffff']),
  b('funcion', 'Función de medianoche', 'Cine', 'film', 'radial-gradient(120% 100% at 50% 40%, #c9a06a, #5a3a1a 80%)', ['#2a1a0a']),
  b('vineta', 'Viñeta', 'Cine', 'comic', 'linear-gradient(135deg, #ffd23d, #ff7a3d)', ['#13202f', '#ff2e4d', '#ffffff']),
  b('embrujada', 'Noche embrujada', 'Fantasía y terror', 'fog', 'linear-gradient(180deg, #1a0b2e, #3a1c4a 60%, #0b0614)', ['#d8ffe8', '#ffb347']),
  b('reino', 'Reino encantado', 'Fantasía y terror', 'castle', 'linear-gradient(180deg, #2b1b4d, #a24b6a 60%, #ffb36b)', ['#ffd36b', '#1a0f2e']),
  b('cielo-anime', 'Cielo de anime', 'Anime y caricatura', 'anime', 'linear-gradient(180deg, #2f8cff, #8ccfff 60%, #e6f6ff)', ['#ffffff', '#fff6c9']),
  b('sabado', 'Sábado de caricaturas', 'Anime y caricatura', 'comic', 'linear-gradient(135deg, #6ee7ff, #b26bff)', ['#13202f', '#ffd23d', '#ffffff']),
]

// Colores con versión para tema claro y nocturno: siempre se distinguen sobre la superficie
const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`

interface FrameOpts {
  tier?: DecorTier
  width?: number
  anim?: string
  fx?: FrameFx
  accent?: string
}

const f = (key: string, label: string, group: string, bg: string, o: FrameOpts = {}): Frame => ({
  key,
  label,
  group,
  bg,
  tier: o.tier ?? 'lucidite',
  width: o.width ?? 0.07,
  anim: o.anim,
  fx: o.fx ?? 'none',
  accent: o.accent,
})

// Armonías: cada marco de este grupo aplica una regla de la teoría del color
export const FRAMES: Frame[] = [
  { key: 'none', label: 'Sin marco', group: 'Clásicos', bg: 'transparent', width: 0, tier: 'free', fx: 'none' },
  f('halo', 'Halo', 'Clásicos', ld('#5f6be0', '#9aa3f5'), { tier: 'grand', fx: 'glow' }),
  f('dusk', 'Atardecer', 'Clásicos', 'linear-gradient(160deg, #fde3c4, #f6b8a8, #d98aa6)', { tier: 'grand' }),
  f('rosa', 'Rosa', 'Clásicos', ld('#e0457f', '#ff9fb6'), { tier: 'grand' }),
  f('oro', 'Oro', 'Metales', 'linear-gradient(135deg, #fff1b8, #f0b94a, #a8741a, #f0b94a)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),
  f('plata', 'Plata', 'Metales', 'linear-gradient(135deg, #e8ebf2, #9aa2b6, #5b6277, #c3c9d6)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),
  f('menta', 'Menta', 'Clásicos', ld('#1f9c80', '#59dac1'), { tier: 'grand' }),
  f('confeti', 'Confeti', 'Vivos', 'conic-gradient(#ff9fb6 0 25%, #ffba67 0 50%, #59dac1 0 75%, #cab0ff 0)', { fx: 'dash', anim: 'frame-spin-slow' }),
  f('arcoiris', 'Arcoíris', 'Vivos', 'conic-gradient(#ff9fb6, #ffba67, #59dac1, #9fb4ff, #ff9fb6)', { width: 0.09, anim: 'frame-spin', fx: 'glow' }),
  f('aurora', 'Aurora', 'Vivos', 'conic-gradient(#59dac1, #cdd4fb, #f4cfe0, #59dac1)', { width: 0.08, anim: 'frame-spin', fx: 'glow' }),
  f('neon', 'Neón', 'Vivos', 'conic-gradient(#ff2e93, #7a2cff, #00d4ff, #ff2e93)', { width: 0.08, anim: 'frame-spin', fx: 'glow' }),
  f('fuego', 'Fuego', 'Vivos', 'conic-gradient(#f83600, #fe8c00, #f9d423, #fe8c00, #f83600)', { width: 0.1, anim: 'frame-spin', fx: 'glow' }),
  f('oceano', 'Océano', 'Vivos', 'conic-gradient(#00c9a7, #00b4db, #2193b0, #00c9a7)', { width: 0.09, anim: 'frame-spin' }),
  f('cometa', 'Cometa', 'Órbitas', 'conic-gradient(transparent 0 62%, #fff 100%)', { width: 0.08, anim: 'frame-spin', fx: 'orbit', accent: '#ffffff' }),
  f('orbita', 'Órbita', 'Órbitas', ld('#c9cdf5', '#3a4470'), { width: 0.04, fx: 'orbit', accent: '#ffba67' }),
  f('puntos', 'Puntos', 'Punteados', ld('#c9930f', '#ffba67'), { fx: 'dash', anim: 'frame-spin-slow' }),
  f('rayitas', 'Rayitas', 'Punteados', 'repeating-conic-gradient(#9fb4ff 0 4deg, transparent 4deg 12deg)', { width: 0.1, anim: 'frame-spin-slow' }),
  f('corona', 'Corona', 'Metales', 'repeating-conic-gradient(#ffba67 0 18deg, #a8741a 18deg 36deg)', { width: 0.12, fx: 'sparkle', accent: '#fff1b8' }),
  f('petalos', 'Pétalos', 'Clásicos', 'repeating-conic-gradient(#ff9fb6 0 20deg, #ffd1e0 20deg 40deg)', { width: 0.12, anim: 'frame-spin-slow' }),
  f('caramelo', 'Caramelo', 'Clásicos', 'repeating-conic-gradient(#ff5e62 0 15deg, #fff 15deg 30deg)', { width: 0.1, anim: 'frame-spin-slow' }),
  f('hielo', 'Hielo', 'Brillos', 'repeating-conic-gradient(#cfe3ff 0 15deg, #6dd5ed 15deg 30deg)', { width: 0.1, anim: 'frame-spin-slow', fx: 'sparkle', accent: '#ffffff' }),
  f('selva', 'Selva', 'Clásicos', 'repeating-conic-gradient(#71b280 0 22deg, #134e5e 22deg 44deg)', { width: 0.1 }),
  f('latido', 'Latido', 'Ondas', ld('#e8457a', '#ff7fa4'), { width: 0.08, anim: 'frame-pulse', fx: 'ripple' }),
  f('radar', 'Radar', 'Ondas', ld('#1f9c80', '#59dac1'), { width: 0.06, fx: 'ripple' }),
  f('lucero', 'Lucero', 'Brillos', ld('#c9930f', '#ffba67'), { width: 0.06, anim: 'frame-pulse', fx: 'sparkle' }),
  f('uva', 'Uva', 'Clásicos', 'linear-gradient(135deg, #8e2de2, #4a00e0)', { width: 0.09 }),
  f('sandia', 'Sandía', 'Clásicos', 'linear-gradient(135deg, #f43b47, #453a94)', { width: 0.09 }),
  f('noche', 'Noche', 'Clásicos', 'linear-gradient(135deg, #3a3e70, #15172e)', { width: 0.11 }),
  f('tinta', 'Tinta', 'Clásicos', ld('#191a33', '#c9d0f5'), { width: 0.05 }),
  f('hilo', 'Hilo', 'Clásicos', ld('#13202f', '#ffffff'), { width: 0.025 }),

  // Brillos: un resplandor que respira detrás del aro
  f('brasa', 'Brasa', 'Brillos', 'conic-gradient(#ff4d2e, #ffb347, #ff4d2e)', { anim: 'frame-spin', fx: 'glow', width: 0.08 }),
  f('lumen', 'Lumen', 'Brillos', ld('#0098c7', '#4cdbe3'), { fx: 'glow' }),
  f('rubi', 'Rubí', 'Brillos', ld('#c4123f', '#ff7f9a'), { fx: 'glow' }),
  f('jade', 'Jade', 'Brillos', ld('#008a5c', '#65ddbb'), { fx: 'glow' }),
  f('ambar', 'Ámbar', 'Brillos', ld('#b56a00', '#ffc061'), { fx: 'glow' }),
  f('amatista', 'Amatista', 'Brillos', ld('#7a3fd1', '#c3b7ff'), { fx: 'glow' }),
  f('chispas', 'Chispas', 'Brillos', 'linear-gradient(135deg, #fff1b8, #f0b94a)', { fx: 'sparkle', accent: '#ffba67' }),
  f('hada', 'Hada', 'Brillos', 'conic-gradient(#ffc6e6, #d9c6ff, #c6f0ff, #ffc6e6)', { anim: 'frame-spin-slow', fx: 'sparkle', accent: '#ffffff', width: 0.08 }),
  f('estelar', 'Estelar', 'Brillos', 'linear-gradient(135deg, #2b2f6b, #0d0f2b)', { fx: 'sparkle', accent: '#fff1b8', width: 0.09 }),

  // Órbitas: lunas y satélites que giran sobre el aro
  f('satelite', 'Satélite', 'Órbitas', ld('#9aa2b6', '#cfd6ff'), { width: 0.035, fx: 'orbit', accent: ld('#1b5296', '#ffffff') }),
  f('luna', 'Luna', 'Órbitas', 'linear-gradient(135deg, #3a3e70, #15172e)', { width: 0.06, fx: 'orbit', accent: '#fff1b8' }),
  f('atomo', 'Átomo', 'Órbitas', ld('#007b63', '#59dac1'), { width: 0.04, fx: 'atom', accent: ld('#e0457f', '#ff9fb6') }),
  f('planeta', 'Planeta', 'Órbitas', 'linear-gradient(135deg, #ffba67, #e8457a)', { width: 0.06, fx: 'double', accent: '#cab0ff' }),
  f('cometas', 'Cometas', 'Órbitas', 'linear-gradient(135deg, #1d3753, #0e2743)', { width: 0.07, fx: 'atom', accent: '#ffba67' }),

  // Ondas: el aro late hacia afuera
  f('sonar', 'Sonar', 'Ondas', ld('#007982', '#4cdbe3'), { width: 0.05, fx: 'ripple' }),
  f('gota', 'Gota', 'Ondas', ld('#2a61b1', '#93c6ff'), { width: 0.05, fx: 'ripple' }),
  f('eco-rosa', 'Eco rosa', 'Ondas', 'conic-gradient(#ff9fb6, #e8457a, #ff9fb6)', { width: 0.07, anim: 'frame-spin', fx: 'ripple', accent: '#ff9fb6' }),

  // Metales: un reflejo recorre el aro
  f('perla', 'Perla', 'Metales', 'conic-gradient(#ffffff, #f3e6ff, #e2f3ff, #fff3e6, #ffffff)', { width: 0.09, fx: 'shimmer' }),
  f('cromo', 'Cromo', 'Metales', 'linear-gradient(135deg, #f5f7fa, #8a93a6, #f5f7fa, #4b5263)', { width: 0.09, fx: 'shimmer' }),
  f('opalo', 'Ópalo', 'Metales', 'conic-gradient(#b8f2e6, #f9c6ff, #ffe7b3, #b3d4ff, #b8f2e6)', { width: 0.09, anim: 'frame-spin-slow', fx: 'shimmer' }),
  f('oro-rosa', 'Oro rosa', 'Metales', 'linear-gradient(135deg, #ffe0d6, #e8a598, #b9706a, #f3c4b8)', { width: 0.09, fx: 'shimmer' }),
  f('bronce', 'Bronce', 'Metales', 'linear-gradient(135deg, #f0c9a0, #b07434, #6e4120, #d9a46b)', { width: 0.09, fx: 'shimmer' }),

  // Punteados: el aro se corta en segmentos que giran
  f('costura', 'Costura', 'Punteados', ld('#938b7d', '#bec8d4'), { width: 0.05, fx: 'dash', anim: 'frame-spin-slow' }),
  f('reloj', 'Reloj', 'Punteados', 'linear-gradient(135deg, #fff1b8, #c9930f)', { width: 0.1, fx: 'dash' }),
  f('pixel', 'Píxel', 'Punteados', 'conic-gradient(#ff2e93, #ffba67, #59dac1, #7a2cff, #ff2e93)', { width: 0.09, fx: 'dash', anim: 'frame-spin' }),
  f('cinta', 'Cinta', 'Punteados', ld('#1b5296', '#bae1fb'), { width: 0.06, fx: 'dash', anim: 'frame-spin' }),

  // Dobles: un segundo aro gira en sentido contrario
  f('eco', 'Eco', 'Dobles', ld('#1b5296', '#93c6ff'), { width: 0.05, fx: 'double' }),
  f('saturno', 'Saturno', 'Dobles', 'linear-gradient(135deg, #ffe7a8, #c9930f)', { width: 0.06, fx: 'double', accent: '#ffe7a8' }),
  f('gemelos', 'Gemelos', 'Dobles', ld('#e0457f', '#ff9fb6'), { width: 0.05, fx: 'double', accent: ld('#2a61b1', '#93c6ff') }),
  f('nebula', 'Nébula', 'Dobles', 'conic-gradient(#7a2cff, #00d4ff, #7a2cff)', { width: 0.06, anim: 'frame-spin', fx: 'double', accent: '#ff9fb6' }),

  f('complementario', 'Complementario', 'Armonías', 'conic-gradient(#1b5296, #3b7ddb, #ff8a3d, #ffb36b, #1b5296)', { width: 0.09, anim: 'frame-spin-slow' }),
  f('triada', 'Tríada', 'Armonías', 'conic-gradient(#e8457a, #ffba3a, #3a8fe8, #e8457a)', { width: 0.09, anim: 'frame-spin-slow' }),
  f('tetrada', 'Tétrada', 'Armonías', 'conic-gradient(#ff9fb6, #ffba67, #59dac1, #cab0ff, #ff9fb6)', { width: 0.09, anim: 'frame-spin-slow', fx: 'glow' }),
  f('analogo-mar', 'Análogo mar', 'Armonías', 'conic-gradient(#00a6a6, #2a7de1, #5a5ff0, #2a7de1, #00a6a6)', { width: 0.09, anim: 'frame-spin' }),
  f('analogo-fuego', 'Análogo fuego', 'Armonías', 'conic-gradient(#ff4d4d, #ff8a3d, #ffc23d, #ff8a3d, #ff4d4d)', { width: 0.09, anim: 'frame-spin' }),
  f('dividido', 'Complementario dividido', 'Armonías', 'conic-gradient(#7a4ff0, #c8e83a, #ffb03a, #7a4ff0)', { width: 0.09, anim: 'frame-spin-slow' }),
  f('monocromo', 'Monocromo', 'Armonías', 'conic-gradient(#0e2743, #1b5296, #6ea8ec, #bae1fb, #0e2743)', { width: 0.09, anim: 'frame-spin' }),

  // Temáticos
  f('neon-tubo', 'Tubo de neón', 'Temáticos', '#ff2e93', { width: 0.05, fx: 'glow' }),
  f('hud', 'Visor', 'Temáticos', '#00e5ff', { width: 0.035, fx: 'double', accent: '#00e5ff' }),
  f('fosforo', 'Fósforo', 'Temáticos', '#3dff8a', { width: 0.04, fx: 'ripple' }),
  f('portal', 'Portal', 'Temáticos', 'conic-gradient(#3dffb0, #7a2cff, #3dffb0)', { width: 0.09, anim: 'frame-spin', fx: 'glow' }),
  f('pelicula', 'Rollo de película', 'Temáticos', ld('#13202f', '#e6ecf3'), { width: 0.12, fx: 'dash', anim: 'frame-spin-slow' }),
  f('vineta', 'Viñeta', 'Temáticos', '#13202f', { width: 0.09, fx: 'double', accent: '#ffd23d' }),
  f('calabaza', 'Calabaza', 'Temáticos', '#ff8a1f', { width: 0.07, fx: 'glow' }),
  f('runa', 'Runa', 'Temáticos', 'linear-gradient(135deg, #ffe7a8, #c9930f)', { width: 0.07, fx: 'sparkle', accent: '#ffd36b' }),
  f('foco', 'Reflector', 'Temáticos', 'linear-gradient(135deg, #fff6c9, #ffd36b)', { width: 0.07, fx: 'shimmer' }),
  f('ochentero', 'Ochentero', 'Temáticos', 'linear-gradient(135deg, #00e5ff, #ff2e93)', { width: 0.07, fx: 'glow', anim: 'frame-spin' }),
]

const PASTEL = ['#ff9fb6', '#ffba67', '#59dac1', '#cab0ff']
const e = (key: string, label: string, group: string, icon: IconName | null, dir: EffectDir, colors: string[], o: { tier?: DecorTier; shape?: EffectShape } = {}): Effect => ({
  key,
  label,
  group,
  icon,
  dir,
  colors,
  shape: o.shape ?? 'dot',
  tier: o.tier ?? 'lucidite',
})

export const EFFECTS: Effect[] = [
  { key: 'none', label: 'Sin efecto', group: 'Clásicos', icon: null, dir: 'up', colors: [], shape: 'dot', tier: 'free' },
  e('corazones', 'Corazones', 'Clásicos', 'heart', 'up', ['#ff5c8a', '#ff9fb6', '#ffd1e0'], { tier: 'grand' }),
  e('destellos', 'Destellos', 'Brillos', 'sparkles', 'twinkle', ['#ffffff', '#ffba67'], { tier: 'grand' }),
  e('estrellas', 'Estrellas', 'Brillos', 'star', 'twinkle', ['#ffba67', '#fff1b8'], { tier: 'grand' }),
  e('nieve', 'Nieve', 'Naturaleza', 'snowflake', 'down', ['#ffffff', '#cfe3ff']),
  e('hojas', 'Hojas', 'Naturaleza', 'leaf', 'down', ['#71b280', '#ffba67', '#d98a4a']),
  e('flores', 'Flores', 'Naturaleza', 'flower-2', 'drift', ['#ff9fb6', '#ffffff', '#ffba67']),
  e('notas', 'Música', 'Pasatiempos', 'music', 'up', ['#cab0ff', '#ffffff']),
  e('lunas', 'Lunas', 'Brillos', 'moon-star', 'twinkle', ['#fff1b8', '#cdd4fb']),
  e('rayos', 'Rayos', 'Brillos', 'zap', 'twinkle', ['#f9d423', '#fe8c00']),
  e('plumas', 'Plumas', 'Naturaleza', 'feather', 'down', ['#ffffff', '#cdd4fb']),
  e('nubes', 'Nubes', 'Naturaleza', 'cloud', 'drift', ['#ffffffcc', '#cfe3ffcc']),
  e('gemas', 'Gemas', 'Brillos', 'gem', 'twinkle', ['#59dac1', '#cab0ff', '#ff9fb6']),
  e('coronas', 'Coronas', 'Clásicos', 'crown', 'up', ['#ffba67', '#fff1b8']),
  e('cafes', 'Cafés', 'Pasatiempos', 'coffee', 'up', ['#d9b38c', '#fff1e0']),
  e('burbujas', 'Burbujas', 'Formas', null, 'bubble', ['#ffffffaa', '#cfe3ffaa'], { shape: 'ring' }),
  e('luciernagas', 'Luciérnagas', 'Naturaleza', null, 'drift', ['#f9d423', '#d4fc79'], { shape: 'glow' }),
  e('confeti', 'Confeti', 'Fiesta', null, 'flip', PASTEL, { shape: 'confetti' }),

  // Nuevos movimientos: órbitas, estallidos, flotación, lluvia y giros en 3D
  e('galaxia', 'Galaxia', 'Brillos', null, 'orbit', ['#ffffff', '#cab0ff', '#93c6ff'], { shape: 'star' }),
  e('polvo-estelar', 'Polvo estelar', 'Brillos', null, 'twinkle', ['#ffffff', '#fff1b8', '#bae1fb'], { shape: 'star' }),
  e('fuegos', 'Fuegos artificiales', 'Fiesta', null, 'burst', ['#ff9fb6', '#ffba67', '#59dac1', '#cab0ff'], { shape: 'star' }),
  e('latidos', 'Latidos', 'Clásicos', 'heart', 'burst', ['#ff5c8a', '#ff9fb6']),
  e('serpentinas', 'Serpentinas', 'Fiesta', null, 'flip', ['#ff2e93', '#7a2cff', '#00d4ff', '#f9d423'], { shape: 'streamer' }),
  e('lluvia-oro', 'Lluvia de oro', 'Fiesta', null, 'flip', ['#fff1b8', '#ffba67', '#c9930f'], { shape: 'confetti' }),
  e('globos', 'Globos', 'Fiesta', null, 'bubble', ['#ff9fb6', '#93c6ff', '#ffba67', '#59dac1'], { shape: 'balloon' }),
  e('petalos', 'Pétalos', 'Naturaleza', null, 'down', ['#ffc6d9', '#ff9fb6', '#ffffff'], { shape: 'petal' }),
  e('sakura', 'Sakura', 'Naturaleza', 'flower-2', 'down', ['#ffd1e0', '#ffa3c1']),
  e('lluvia', 'Lluvia', 'Naturaleza', null, 'rain', ['#ffffffaa', '#bae1fbaa'], { shape: 'streak' }),
  e('pompas', 'Pompas', 'Formas', null, 'bubble', ['#cab0ff99', '#59dac199', '#ff9fb699'], { shape: 'ring' }),
  e('auroras', 'Polvo de aurora', 'Formas', null, 'float', ['#59dac1', '#cab0ff', '#ff9fb6'], { shape: 'glow' }),
  e('atomos', 'Átomos', 'Formas', null, 'orbit', ['#59dac1', '#ff9fb6'], { shape: 'dot' }),
  e('anillos', 'Anillos', 'Formas', null, 'burst', ['#ffffff', '#bae1fb'], { shape: 'ring' }),
  e('soles', 'Soles', 'Naturaleza', 'sun', 'float', ['#ffba67', '#fff1b8']),
  e('cine', 'Cine', 'Pasatiempos', 'clapperboard', 'up', ['#ffffff', '#ffba67']),
  e('gamer', 'Gamer', 'Pasatiempos', 'gamepad-2', 'float', ['#cab0ff', '#59dac1', '#ff9fb6']),
  e('dados', 'Dados', 'Pasatiempos', 'dices', 'flip', ['#ffffff', '#ff9fb6']),
  e('arte', 'Arte', 'Pasatiempos', 'palette', 'drift', ['#ffba67', '#ff9fb6', '#59dac1']),
  e('fotos', 'Fotos', 'Pasatiempos', 'camera', 'twinkle', ['#ffffff', '#bae1fb']),
  e('viajes', 'Viajes', 'Pasatiempos', 'send', 'drift', ['#ffffff', '#93c6ff']),
  e('pasos', 'Pasos', 'Pasatiempos', 'footprints', 'up', ['#ffffff', '#ffba67']),
  e('boletos', 'Boletos', 'Pasatiempos', 'ticket', 'flip', ['#ffba67', '#ff9fb6']),
  e('risas', 'Risas', 'Clásicos', 'smile', 'float', ['#ffba67', '#fff1b8']),
  e('brujulas', 'Brújulas', 'Pasatiempos', 'compass', 'orbit', ['#ffffff', '#59dac1']),
  e('cocina', 'Cocina', 'Pasatiempos', 'utensils', 'up', ['#ffffff', '#ffba67']),
  e('idiomas', 'Idiomas', 'Pasatiempos', 'languages', 'drift', ['#ffffff', '#cab0ff']),
  e('estudio', 'Estudio', 'Pasatiempos', 'graduation-cap', 'up', ['#ffffff', '#93c6ff']),
  e('amistad', 'Amistad', 'Clásicos', 'handshake', 'float', ['#ffba67', '#ffffff']),

  // Temáticos
  e('codigo', 'Código', 'Temáticos', null, 'rain', ['#3dff8a', '#b8ffd2'], { shape: 'glyph' }),
  e('fugaces', 'Estrellas fugaces', 'Temáticos', null, 'rain', ['#ffffff', '#bae1fb'], { shape: 'streak' }),
  e('cohetes', 'Cohetes', 'Temáticos', 'rocket', 'up', ['#ffffff', '#ff9a5e']),
  e('ovnis', 'Ovnis', 'Temáticos', 'ufo', 'drift', ['#3dffb0', '#bae1fb']),
  e('fantasmas', 'Fantasmas', 'Temáticos', 'ghost', 'drift', ['#ffffffdd', '#d8ffe8dd']),
  e('murcielagos', 'Murciélagos', 'Temáticos', 'bat', 'drift', ['#1a0b2e', '#3a1c4a']),
  e('brasas', 'Brasas', 'Temáticos', null, 'up', ['#ffb347', '#ff6a1f', '#ffd36b'], { shape: 'glow' }),
  e('palomitas', 'Palomitas', 'Temáticos', 'popcorn', 'flip', ['#fff6c9', '#ffffff']),
  e('teles', 'Teles', 'Temáticos', 'tv', 'float', ['#ffffff', '#ffd36b']),
  e('teatro', 'Teatro', 'Temáticos', 'masks', 'float', ['#ffd36b', '#ffffff']),
]

const n = (key: string, label: string, color: string | null, tier: DecorTier = 'lucidite', italic = false): NameStyle => ({ key, label, color, tier, italic })
const fx = (key: string, label: string, color: string, effect: NameFx, italic = false): NameStyle => ({ key, label, color, tier: 'lucidite', italic, fx: effect })

// Colores de nombre en OKLCH: misma luminosidad en todos los tonos, uno por cada 25-30 grados del círculo
export const NAME_STYLES: NameStyle[] = [
  { key: 'none', label: 'Normal', color: null, tier: 'free' },
  n('cursiva', 'Cursiva', null, 'grand', true),
  n('rosa', 'Rosa', ld('#9f3960', '#ffa3c1'), 'grand'),
  n('oro', 'Oro', ld('#995700', '#f4b768'), 'grand'),
  n('menta', 'Menta', ld('#007b5a', '#65ddbb')),
  n('cielo', 'Cielo', ld('#006da6', '#6ed0ff')),
  n('lavanda', 'Lavanda', ld('#6451ac', '#c3b7ff')),
  n('coral', 'Coral', ld('#a43c2f', '#ffa696')),
  n('uva', 'Uva', ld('#7b489e', '#dcaefe')),
  n('esmeralda', 'Esmeralda', ld('#007834', '#89da9b')),
  n('lima', 'Lima', ld('#577600', '#b2d279')),
  n('turquesa', 'Turquesa', ld('#007982', '#4cdbe3')),
  n('cobalto', 'Cobalto', ld('#2a61b1', '#93c6ff')),
  n('orquidea', 'Orquídea', ld('#913f82', '#f4a6e3')),
  n('ciruela', 'Ciruela', ld('#9b3b6e', '#ffa3cf')),
  n('rosa-cursiva', 'Rosa cursiva', ld('#9f3960', '#ffa3c1'), 'lucidite', true),
  n('oro-cursiva', 'Oro cursiva', ld('#995700', '#f4b768'), 'lucidite', true),
  n('lavanda-cursiva', 'Lavanda cursiva', ld('#6451ac', '#c3b7ff'), 'lucidite', true),
  n('menta-cursiva', 'Menta cursiva', ld('#007b5a', '#65ddbb'), 'lucidite', true),
  n('cielo-cursiva', 'Cielo cursiva', ld('#006da6', '#6ed0ff'), 'lucidite', true),
  n('coral-cursiva', 'Coral cursiva', ld('#a43c2f', '#ffa696'), 'lucidite', true),
  n('orquidea-cursiva', 'Orquídea cursiva', ld('#913f82', '#f4a6e3'), 'lucidite', true),

  // Con efecto animado
  fx('neon', 'Neón', ld('#d1006b', '#ff6fb5'), 'neon'),
  fx('holograma', 'Holograma', ld('#0b7fa3', '#6ee7ff'), 'hologram'),
  fx('terminal', 'Terminal', ld('#0a7a3a', '#3dff8a'), 'terminal'),
  fx('cromo', 'Cromo', ld('#2a61b1', '#bae1fb'), 'chrome'),
  fx('falla', 'Falla', ld('#13202f', '#e6ecf3'), 'glitch'),
  fx('marquesina', 'Marquesina', ld('#995700', '#ffd36b'), 'marquee'),
  fx('cine-negro', 'Cine negro', ld('#13202f', '#e6ecf3'), 'noir', true),
  fx('sepia', 'Sepia', ld('#6e4a1f', '#e6c9a0'), 'film', true),
  fx('vineta', 'Viñeta', '#ffd23d', 'comic'),
  fx('embrujado', 'Embrujado', ld('#3f7a52', '#b8ffd2'), 'spooky'),
  fx('runa', 'Runa', ld('#8a5a00', '#ffd36b'), 'rune', true),
  fx('drama', 'Drama', ld('#9f1239', '#ff8fa8'), 'drama', true),
]

// Temas: combinan fondo, marco, efecto y nombre de una sola vez.
// Están inspirados en géneros y estéticas, nunca en obras, personajes ni marcas concretas.
export interface Theme {
  key: string
  label: string
  group: string
  idea: string
  banner: string
  frame: string
  effect: string
  name: string
}

const t = (key: string, label: string, group: string, idea: string, banner: string, frame: string, effect: string, name: string): Theme => ({
  key,
  label,
  group,
  idea,
  banner,
  frame,
  effect,
  name,
})

export const THEMES: Theme[] = [
  t('neon-nocturno', 'Neón nocturno', 'Ciencia ficción', 'Ciudades lluviosas con letreros de neón', 'ciudad-neon', 'neon-tubo', 'lluvia', 'neon'),
  t('hiperespacio', 'Hiperespacio', 'Ciencia ficción', 'Naves que saltan entre estrellas', 'hiperespacio', 'hud', 'fugaces', 'holograma'),
  t('terminal', 'Terminal', 'Ciencia ficción', 'Pantallas verdes y código que cae', 'terminal', 'fosforo', 'codigo', 'terminal'),
  t('planeta', 'Planeta lejano', 'Ciencia ficción', 'Exploración de mundos con anillos', 'planeta', 'saturno', 'cohetes', 'cromo'),
  t('portal', 'Portal', 'Ciencia ficción', 'Viajes en el tiempo y otras dimensiones', 'portal', 'portal', 'ovnis', 'falla'),
  t('ochentero', 'Ochentero', 'Series y programas', 'Atardeceres de neón y cuadrícula infinita', 'ochentero', 'ochentero', 'destellos', 'cromo'),
  t('tele-antigua', 'Tele de antes', 'Series y programas', 'Comedias de foro con risas grabadas', 'tele-antigua', 'tinta', 'teles', 'falla'),
  t('en-vivo', 'En vivo', 'Series y programas', 'Concursos, reflectores y confeti', 'en-vivo', 'foco', 'confeti', 'marquesina'),
  t('telenovela', 'Telenovela', 'Series y programas', 'Romances intensos y miradas dramáticas', 'telenovela', 'rubi', 'petalos', 'drama'),
  t('cine-negro', 'Cine negro', 'Cine', 'Detectives, persianas y lluvia en blanco y negro', 'cine-negro', 'tinta', 'lluvia', 'cine-negro'),
  t('funcion', 'Función de medianoche', 'Cine', 'Película vieja con grano y palomitas', 'funcion', 'pelicula', 'palomitas', 'sepia'),
  t('vineta', 'Viñeta', 'Cine', 'Historietas de héroes con onomatopeyas', 'vineta', 'vineta', 'fuegos', 'vineta'),
  t('embrujada', 'Noche embrujada', 'Fantasía y terror', 'Neblina, luna llena y algo que se mueve', 'embrujada', 'calabaza', 'fantasmas', 'embrujado'),
  t('murcielagos', 'Medianoche gótica', 'Fantasía y terror', 'Castillos oscuros y alas en la noche', 'embrujada', 'noche', 'murcielagos', 'drama'),
  t('reino', 'Reino encantado', 'Fantasía y terror', 'Castillos, magia y brasas al atardecer', 'reino', 'runa', 'brasas', 'runa'),
  t('cielo-anime', 'Cielo de anime', 'Anime y caricatura', 'Nubes enormes y pétalos al viento', 'cielo-anime', 'hada', 'sakura', 'rosa-cursiva'),
  t('sabado', 'Sábado de caricaturas', 'Anime y caricatura', 'Colores planos, risas y golpes de onomatopeya', 'sabado', 'vineta', 'risas', 'vineta'),
  t('teatro', 'Gran estreno', 'Cine', 'Alfombra, reflectores y telón', 'en-vivo', 'oro', 'teatro', 'marquesina'),
]

export const themeOf = (key?: string) => THEMES.find((x) => x.key === key)

export const TOTAL_STYLES = BANNERS.length + FRAMES.length + EFFECTS.length + NAME_STYLES.length - 4

const find = <T extends { key: string }>(list: T[], key: string | undefined) => list.find((x) => x.key === key) ?? list[0]
export const bannerOf = (key?: string) => find(BANNERS, key)

// Agrupa un catálogo por su campo group, conservando el orden
export const groupsOf = <T extends { group: string }>(list: T[]) =>
  [...new Set(list.map((x) => x.group))].map((group) => ({ group, items: list.filter((x) => x.group === group) }))
export const frameOf = (key?: string) => find(FRAMES, key)
export const effectOf = (key?: string) => find(EFFECTS, key)
export const nameStyleOf = (key?: string) => find(NAME_STYLES, key)
