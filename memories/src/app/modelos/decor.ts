import type { IconName } from '../componentes/icon/icons'
import type { Tier } from './plans'

export type DecorTier = 'free' | 'grand' | 'lucidite'

// Escena animada que se dibuja encima del color base de cada fondo
export type BannerScene =
  | 'static' | 'mesh' | 'aurora' | 'stars' | 'galaxy' | 'sun' | 'flow' | 'waves' | 'rain' | 'rings' | 'pattern'
  // Escenas temáticas (solo la idea visual de cada género, sin obras concretas)
  | 'city' | 'hyper' | 'code' | 'planet' | 'portal' | 'synth' | 'crt' | 'spotlight' | 'noir' | 'film' | 'comic' | 'fog' | 'castle' | 'anime'
  // Líneas de colección: escenas con más capas, cada una con variantes de color
  | 'lava' | 'glitch' | 'runes' | 'blackhole' | 'sumi' | 'crystal' | 'lightning' | 'caustics' | 'royal' | 'pixel' | 'hexgrid' | 'frost'
  // Jardín de texto: dibujos ASCII hechos a mano; la variante que crece es solo de Lucidité
  | 'garden' | 'garden-grow'

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
export type FrameFx =
  | 'none' | 'glow' | 'orbit' | 'atom' | 'sparkle' | 'ripple' | 'shimmer' | 'dash' | 'double'
  // Ornamentos que salen del aro
  | 'flames' | 'wings' | 'horns' | 'angel' | 'runes' | 'crystals' | 'electric' | 'vines' | 'gems' | 'glitch' | 'ears' | 'void'

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
  // Segundo color de los ornamentos (punta de la llama, borde del ala…)
  accent2?: string
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
export type NameFx = 'neon' | 'hologram' | 'terminal' | 'chrome' | 'glitch' | 'marquee' | 'noir' | 'film' | 'comic' | 'spooky' | 'rune' | 'drama' | 'fire' | 'ice' | 'pixel'

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
  b('aurora', 'Aurora', 'Cielos', 'aurora', 'linear-gradient(180deg, #0d2a3a, #1b4b5c)', ['#5ff2c4', '#9f8bff', '#ff9ccd'], 'grand'),
  b('marea', 'Marea', 'Cielos', 'waves', 'linear-gradient(180deg, #cfe6ff, #8fb9f6)', ['#ffffff99', '#6c9eea', '#3f6fc6'], 'grand'),
  b('crepusculo', 'Crepúsculo', 'Cielos', 'sun', 'linear-gradient(180deg, #2b1b4d, #7b3f98 58%, #f08a5d)', ['#ffd08a', '#ff8a5c'], 'grand'),
  b('tormenta', 'Tormenta', 'Cielos', 'rain', 'linear-gradient(170deg, #55647f, #232a3f)', ['#ffffff'], 'grand'),
  b('ink', 'Tinta', 'Noche', 'stars', 'radial-gradient(120% 90% at 20% 0%, #3a3e70, #15172e)', ['#9aa3ff'], 'grand'),
  b('nebulosa', 'Nebulosa', 'Noche', 'aurora', 'radial-gradient(120% 120% at 50% 0%, #1d1650, #0b0c24)', ['#b14aed', '#2dd4bf', '#ff6fb5']),
  b('estrellas', 'Cielo estrellado', 'Noche', 'stars', 'linear-gradient(180deg, #0b1030, #27305f)', ['#cfd6ff'], 'grand'),
  b('galaxia', 'Galaxia', 'Noche', 'galaxy', 'conic-gradient(from 210deg at 60% 40%, #17123c, #4b1d78, #1b3a7a, #0b6a7c, #17123c)', ['#ffffff']),
  b('eclipse', 'Eclipse', 'Noche', 'sun', 'radial-gradient(circle at 50% 120%, #3a1b52 30%, #0d0b22 80%)', ['#ffb36b', '#ff6f61'], 'grand'),
  b('oceano', 'Océano', 'Vivos', 'waves', 'linear-gradient(180deg, #6dd5ed, #2193b0)', ['#ffffffaa', '#1a8fb0', '#0d5f86'], 'grand'),
  b('bosque', 'Bosque', 'Vivos', 'waves', 'linear-gradient(180deg, #a6d8a8, #134e5e)', ['#71b280aa', '#2c7a5f', '#0f3b46'], 'grand'),
  b('ondas', 'Ondas', 'Texturas', 'rings', 'radial-gradient(circle at 50% 120%, #34397a, #1b1e45 70%)', ['#a6adff', '#ff8fb4', '#6fd5bd'], 'grand'),
  b('sol', 'Sol', 'Texturas', 'sun', 'linear-gradient(180deg, #ff9a5e, #ff7e5f)', ['#fff3a8', '#f9d423'], 'grand'),
  b('arcoiris', 'Arcoíris', 'Texturas', 'rings', 'linear-gradient(180deg, #cfe3ff, #fdf2ff)', ['#ff8fb4', '#f3c560', '#6fd5bd', '#a6adff']),

  // Más cielos y noches
  b('mediodia', 'Mediodía', 'Cielos', 'sun', 'linear-gradient(180deg, #7cc4ff, #cfeaff)', ['#fffbe0', '#ffd66b'], 'grand'),
  b('borealis', 'Boreal', 'Noche', 'aurora', 'linear-gradient(180deg, #06142b, #0e2d3f)', ['#3dffb0', '#3dc8ff', '#b26bff']),
  b('luna-llena', 'Luna llena', 'Noche', 'sun', 'linear-gradient(180deg, #0b1030, #1d2558)', ['#f4f1ff', '#c9cff5']),
  b('lluvia-neon', 'Lluvia neón', 'Noche', 'rain', 'linear-gradient(170deg, #2a0f4d, #0b0c24)', ['#ff2e93']),
  b('constelacion', 'Constelación', 'Noche', 'stars', 'radial-gradient(120% 90% at 80% 0%, #2c1f5c, #0b0c24)', ['#ff9fb6']),
  b('abismo', 'Abismo', 'Noche', 'waves', 'linear-gradient(180deg, #0b2a4a, #030c18)', ['#3dc8ff55', '#1b5296', '#0e2743']),

  b('volcan', 'Volcán', 'Vivos', 'sun', 'linear-gradient(180deg, #2a0a0a, #8a1c0f 60%, #ff5a1f)', ['#ffd36b', '#ff5a1f']),
  b('laguna', 'Laguna', 'Vivos', 'waves', 'linear-gradient(180deg, #b8fff0, #2fc3b1)', ['#ffffffaa', '#14a39a', '#0b6f73']),
  b('cosmos', 'Cosmos', 'Vivos', 'galaxy', 'conic-gradient(from 90deg at 40% 60%, #ff2e93, #7a2cff, #00d4ff, #00e08a, #ff2e93)', ['#ffffff']),

  b('radar', 'Radar', 'Texturas', 'rings', 'radial-gradient(circle at 50% 120%, #003b33, #001a17 70%)', ['#59dac1', '#3dffb0', '#bae1fb']),

  // Cine, series y ciencia ficción: solo la idea de cada estética
  b('ciudad-neon', 'Ciudad neón', 'Ciencia ficción', 'city', 'linear-gradient(180deg, #12002b, #2a0a4a 55%, #ff2e93)', ['#00e5ff', '#ff2e93', '#7a2cff']),
  b('hiperespacio', 'Hiperespacio', 'Ciencia ficción', 'hyper', 'radial-gradient(circle at 50% 50%, #1b2a6b, #05061a 70%)', ['#bae1fb', '#ffffff']),
  b('terminal', 'Terminal', 'Ciencia ficción', 'code', 'linear-gradient(180deg, #010d06, #02200f)', ['#3dff8a', '#b8ffd2']),
  b('planeta', 'Planeta lejano', 'Ciencia ficción', 'planet', 'radial-gradient(120% 120% at 20% 0%, #1e1450, #05061a)', ['#ff9a5e', '#7a2cff', '#ffd9a8']),
  b('portal', 'Portal', 'Ciencia ficción', 'portal', 'radial-gradient(circle, #0a2a1a, #02060f 75%)', ['#3dffb0', '#7a2cff', '#bafff0']),
  b('ochentero', 'Ochentero', 'Series y programas', 'synth', 'linear-gradient(180deg, #120533, #4a0e5c 55%, #ff5fa2)', ['#ffd36b', '#ff2e93', '#00e5ff'], 'grand'),
  b('tele-antigua', 'Tele de antes', 'Series y programas', 'crt', 'linear-gradient(180deg, #2a2a2a, #111)', ['#ffffff'], 'grand'),
  b('en-vivo', 'En vivo', 'Series y programas', 'spotlight', 'radial-gradient(120% 90% at 50% 100%, #3a0f5c, #0b0420 70%)', ['#ffd36b', '#ff6fb5', '#6ee7ff'], 'grand'),
  b('telenovela', 'Telenovela', 'Series y programas', 'mesh', 'linear-gradient(160deg, #3a0010, #8a0f2e)', ['#ff3d6e', '#ffb3c6', '#5a0018']),
  b('cine-negro', 'Cine negro', 'Cine', 'noir', 'linear-gradient(160deg, #3a3a3a, #0c0c0c)', ['#ffffff'], 'grand'),
  b('funcion', 'Función de medianoche', 'Cine', 'film', 'radial-gradient(120% 100% at 50% 40%, #c9a06a, #5a3a1a 80%)', ['#2a1a0a']),
  b('vineta', 'Viñeta', 'Cine', 'comic', 'linear-gradient(135deg, #ffd23d, #ff7a3d)', ['#13202f', '#ff2e4d', '#ffffff']),
  b('embrujada', 'Noche embrujada', 'Fantasía y terror', 'fog', 'linear-gradient(180deg, #1a0b2e, #3a1c4a 60%, #0b0614)', ['#d8ffe8', '#ffb347']),
  b('reino', 'Reino encantado', 'Fantasía y terror', 'castle', 'linear-gradient(180deg, #2b1b4d, #a24b6a 60%, #ffb36b)', ['#ffd36b', '#1a0f2e']),
  b('cielo-anime', 'Cielo de anime', 'Anime y caricatura', 'anime', 'linear-gradient(180deg, #2f8cff, #8ccfff 60%, #e6f6ff)', ['#ffffff', '#fff6c9']),
  b('sabado', 'Sábado de caricaturas', 'Anime y caricatura', 'comic', 'linear-gradient(135deg, #6ee7ff, #b26bff)', ['#13202f', '#ffd23d', '#ffffff'], 'grand'),

  // Colecciones: cada línea tiene variantes de color, como las de los juegos
  b('llama-brasa', 'Brasa', 'Llama ancestral', 'lava', 'radial-gradient(120% 100% at 50% 110%, #4a0d05, #120303 70%)', ['#ff5a1f', '#ffb347', '#ffd36b'], 'grand'),
  b('llama-azul', 'Fuego azul', 'Llama ancestral', 'lava', 'radial-gradient(120% 100% at 50% 110%, #06204a, #020812 70%)', ['#2fa8ff', '#8fe3ff', '#e0f7ff']),
  b('llama-verde', 'Fuego fatuo', 'Llama ancestral', 'lava', 'radial-gradient(120% 100% at 50% 110%, #06301a, #020c06 70%)', ['#4dff6a', '#c8ff7a', '#eaffd0']),
  b('pulso-rosa', 'Rosa eléctrico', 'Pulso digital', 'glitch', 'linear-gradient(135deg, #1a0030, #0a0018)', ['#ff2e93', '#00e5ff', '#ffe600']),
  b('pulso-acido', 'Ácido', 'Pulso digital', 'glitch', 'linear-gradient(135deg, #0d1a00, #050a00)', ['#b6ff00', '#9d4bff', '#00ffd5']),
  b('runa-dorada', 'Oro antiguo', 'Runas', 'runes', 'radial-gradient(circle at 50% 50%, #3a2a08, #0d0a02 70%)', ['#ffd36b', '#fff1b8']),
  b('runa-arcana', 'Arcana', 'Runas', 'runes', 'radial-gradient(circle at 50% 50%, #2a0f4a, #0b0418 70%)', ['#b26bff', '#e3c7ff']),
  b('runa-hielo', 'Glacial', 'Runas', 'runes', 'radial-gradient(circle at 50% 50%, #0b2a4a, #020a18 70%)', ['#7fe7ff', '#e0fbff']),
  b('horizonte', 'Disco de fuego', 'Horizonte de sucesos', 'blackhole', 'radial-gradient(circle at 50% 50%, #120a1a, #020208 70%)', ['#ffb347', '#ff6a1f', '#fff1d0']),
  b('horizonte-violeta', 'Disco violeta', 'Horizonte de sucesos', 'blackhole', 'radial-gradient(circle at 50% 50%, #140a2a, #020208 70%)', ['#c77dff', '#7a2cff', '#f3e3ff']),
  b('cerezo-dia', 'Día', 'Tinta y cerezo', 'sumi', 'linear-gradient(180deg, #f6efe2, #e9dcc4)', ['#d62b3a', '#13202f', '#ffb7c5'], 'grand'),
  b('cerezo-noche', 'Noche', 'Tinta y cerezo', 'sumi', 'linear-gradient(180deg, #1b1f4a, #0b0c24)', ['#f4f1ff', '#05061a', '#ffb7c5']),
  b('cristal-rosa', 'Cuarzo rosa', 'Cristal', 'crystal', 'linear-gradient(160deg, #2a0b2e, #120414)', ['#ff7fcf', '#ffd1f0', '#ffffff']),
  b('cristal-cian', 'Hielo vivo', 'Cristal', 'crystal', 'linear-gradient(160deg, #04252e, #010d12)', ['#3de8ff', '#c8fbff', '#ffffff']),
  b('cristal-amatista', 'Amatista', 'Cristal', 'crystal', 'linear-gradient(160deg, #1c0b3a, #0a0418)', ['#9b5cff', '#e2ccff', '#ffffff']),
  b('rayo-azul', 'Rayo azul', 'Tormenta eléctrica', 'lightning', 'linear-gradient(180deg, #0b1430, #1d2a4f)', ['#9fd8ff', '#ffffff']),
  b('rayo-violeta', 'Rayo violeta', 'Tormenta eléctrica', 'lightning', 'linear-gradient(180deg, #160b30, #2d1d4f)', ['#d6a8ff', '#ffffff']),
  b('arrecife', 'Arrecife', 'Reino sumergido', 'caustics', 'linear-gradient(180deg, #0e6f7a, #06343f)', ['#7ff7e6', '#1fbfa8', '#0b3f46']),
  b('abisal', 'Abisal', 'Reino sumergido', 'caustics', 'linear-gradient(180deg, #08204a, #020818)', ['#4dc9ff', '#7a5cff', '#040c24']),
  b('realeza-oro', 'Azul real', 'Corte real', 'royal', 'linear-gradient(160deg, #0f1a3d, #060b1f)', ['#ffd36b', '#fff1b8']),
  b('realeza-carmesi', 'Carmesí', 'Corte real', 'royal', 'linear-gradient(160deg, #5a0a1c, #24030b)', ['#ffd36b', '#ffe7a8']),
  b('arcade-atardecer', 'Atardecer', 'Arcade', 'pixel', 'linear-gradient(180deg, #2a0f5c 0 22%, #5a1f8a 22% 40%, #c2408f 40% 56%, #ff8a5c 56%)', ['#ffd36b', '#3a1466', '#1a0a33'], 'grand'),
  b('arcade-noche', 'Noche', 'Arcade', 'pixel', 'linear-gradient(180deg, #050a24 0 22%, #0b1440 22% 40%, #16246a 40% 56%, #2a3a8a 56%)', ['#e0f0ff', '#0a1238', '#05081c']),
  b('colmena-ambar', 'Ámbar', 'Colmena', 'hexgrid', 'radial-gradient(circle at 50% 60%, #2a1a00, #0a0600 75%)', ['#ffb000', '#ffe08a']),
  b('colmena-cian', 'Cian', 'Colmena', 'hexgrid', 'radial-gradient(circle at 50% 60%, #002a33, #000a0e 75%)', ['#00e5ff', '#bafcff']),
  b('escarcha', 'Escarcha', 'Escarcha', 'frost', 'linear-gradient(180deg, #bfe3ff, #6fa8dc)', ['#ffffff', '#e6f6ff'], 'grand'),
  b('escarcha-aurora', 'Aurora helada', 'Escarcha', 'frost', 'linear-gradient(180deg, #123a5c, #2f8f9a)', ['#ffffff', '#b8ffe9']),
  // Jardín de texto: el dibujo es el mismo; cada variante cambia el trazo, el acento y el detalle
  b('jardin-papel', 'Papel', 'Jardín de texto', 'garden', 'linear-gradient(180deg, #fbf6ef, #efe6d6)', ['#6e3ead', '#93506c', '#a993d6'], 'grand'),
  b('jardin-noche', 'Noche', 'Jardín de texto', 'garden', 'linear-gradient(180deg, #251c36, #110a1d)', ['#fc984c', '#f2a3c1', '#dac6b8'], 'grand'),
  b('jardin-menta', 'Menta', 'Jardín de texto', 'garden', 'linear-gradient(180deg, #e2f5ef, #c9ebe0)', ['#0d7a66', '#93506c', '#6fae9c']),
  b('jardin-crece', 'Que crece', 'Jardín de texto', 'garden-grow', 'linear-gradient(180deg, #f5f0e0, #e8dcbc)', ['#7a681c', '#93506c', '#b5a46c']),
]

// Colores con versión para tema claro y nocturno: siempre se distinguen sobre la superficie
const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`

interface FrameOpts {
  tier?: DecorTier
  width?: number
  anim?: string
  fx?: FrameFx
  accent?: string
  accent2?: string
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
  accent2: o.accent2,
})

// Armonías: cada marco de este grupo aplica una regla de la teoría del color
export const FRAMES: Frame[] = [
  { key: 'none', label: 'Sin marco', group: 'Clásicos', bg: 'transparent', width: 0, tier: 'free', fx: 'none' },
  f('halo', 'Halo', 'Clásicos', ld('#5f6be0', '#9aa3f5'), { tier: 'grand', fx: 'glow' }),
  f('oro', 'Oro', 'Metales', 'linear-gradient(135deg, #fff1b8, #f0b94a, #a8741a, #f0b94a)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),
  f('plata', 'Plata', 'Metales', 'linear-gradient(135deg, #e8ebf2, #9aa2b6, #5b6277, #c3c9d6)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),
  f('arcoiris', 'Arcoíris', 'Vivos', 'conic-gradient(#ff9fb6, #ffba67, #59dac1, #9fb4ff, #ff9fb6)', { width: 0.09, anim: 'frame-spin', fx: 'glow' }),
  f('aurora', 'Aurora', 'Vivos', 'conic-gradient(#59dac1, #cdd4fb, #f4cfe0, #59dac1)', { width: 0.08, anim: 'frame-spin', fx: 'glow' }),
  f('neon', 'Neón', 'Vivos', 'conic-gradient(#ff2e93, #7a2cff, #00d4ff, #ff2e93)', { width: 0.08, anim: 'frame-spin', fx: 'glow' }),
  f('fuego', 'Fuego', 'Vivos', 'conic-gradient(#f83600, #fe8c00, #f9d423, #fe8c00, #f83600)', { width: 0.1, anim: 'frame-spin', fx: 'glow' }),
  f('cometa', 'Cometa', 'Órbitas', 'conic-gradient(transparent 0 62%, #fff 100%)', { tier: 'grand', width: 0.08, anim: 'frame-spin', fx: 'orbit', accent: '#ffffff' }),
  f('orbita', 'Órbita', 'Órbitas', ld('#c9cdf5', '#3a4470'), { tier: 'grand', width: 0.04, fx: 'orbit', accent: '#ffba67' }),
  f('corona', 'Corona', 'Metales', 'repeating-conic-gradient(#ffba67 0 18deg, #a8741a 18deg 36deg)', { tier: 'grand', width: 0.12, fx: 'sparkle', accent: '#fff1b8' }),
  f('hielo', 'Hielo', 'Brillos', 'repeating-conic-gradient(#cfe3ff 0 15deg, #6dd5ed 15deg 30deg)', { tier: 'grand', width: 0.1, anim: 'frame-spin-slow', fx: 'sparkle', accent: '#ffffff' }),
  f('latido', 'Latido', 'Ondas', ld('#e8457a', '#ff7fa4'), { tier: 'grand', width: 0.08, anim: 'frame-pulse', fx: 'ripple' }),
  f('radar', 'Radar', 'Ondas', ld('#1f9c80', '#59dac1'), { tier: 'grand', width: 0.06, fx: 'ripple' }),
  f('lucero', 'Lucero', 'Brillos', ld('#c9930f', '#ffba67'), { tier: 'grand', width: 0.06, anim: 'frame-pulse', fx: 'sparkle' }),

  // Brillos: un resplandor que respira detrás del aro
  f('brasa', 'Brasa', 'Brillos', 'conic-gradient(#ff4d2e, #ffb347, #ff4d2e)', { anim: 'frame-spin', fx: 'glow', width: 0.08 }),
  f('lumen', 'Lumen', 'Brillos', ld('#0098c7', '#4cdbe3'), { tier: 'grand', fx: 'glow' }),
  f('rubi', 'Rubí', 'Brillos', ld('#c4123f', '#ff7f9a'), { tier: 'grand', fx: 'glow' }),
  f('jade', 'Jade', 'Brillos', ld('#008a5c', '#65ddbb'), { tier: 'grand', fx: 'glow' }),
  f('ambar', 'Ámbar', 'Brillos', ld('#b56a00', '#ffc061'), { tier: 'grand', fx: 'glow' }),
  f('amatista', 'Amatista', 'Brillos', ld('#7a3fd1', '#c3b7ff'), { fx: 'glow' }),
  f('chispas', 'Chispas', 'Brillos', 'linear-gradient(135deg, #fff1b8, #f0b94a)', { fx: 'sparkle', accent: '#ffba67' }),
  f('hada', 'Hada', 'Brillos', 'conic-gradient(#ffc6e6, #d9c6ff, #c6f0ff, #ffc6e6)', { anim: 'frame-spin-slow', fx: 'sparkle', accent: '#ffffff', width: 0.08 }),
  f('estelar', 'Estelar', 'Brillos', 'linear-gradient(135deg, #2b2f6b, #0d0f2b)', { fx: 'sparkle', accent: '#fff1b8', width: 0.09 }),

  // Órbitas: lunas y satélites que giran sobre el aro
  f('satelite', 'Satélite', 'Órbitas', ld('#9aa2b6', '#cfd6ff'), { tier: 'grand', width: 0.035, fx: 'orbit', accent: ld('#1b5296', '#ffffff') }),
  f('luna', 'Luna', 'Órbitas', 'linear-gradient(135deg, #3a3e70, #15172e)', { width: 0.06, fx: 'orbit', accent: '#fff1b8' }),
  f('atomo', 'Átomo', 'Órbitas', ld('#007b63', '#59dac1'), { width: 0.04, fx: 'atom', accent: ld('#e0457f', '#ff9fb6') }),
  f('planeta', 'Planeta', 'Órbitas', 'linear-gradient(135deg, #ffba67, #e8457a)', { width: 0.06, fx: 'double', accent: '#cab0ff' }),
  f('cometas', 'Cometas', 'Órbitas', 'linear-gradient(135deg, #1d3753, #0e2743)', { width: 0.07, fx: 'atom', accent: '#ffba67' }),

  // Ondas: el aro late hacia afuera
  f('sonar', 'Sonar', 'Ondas', ld('#007982', '#4cdbe3'), { tier: 'grand', width: 0.05, fx: 'ripple' }),
  f('gota', 'Gota', 'Ondas', ld('#2a61b1', '#93c6ff'), { tier: 'grand', width: 0.05, fx: 'ripple' }),
  f('eco-rosa', 'Eco rosa', 'Ondas', 'conic-gradient(#ff9fb6, #e8457a, #ff9fb6)', { width: 0.07, anim: 'frame-spin', fx: 'ripple', accent: '#ff9fb6' }),

  // Metales: un reflejo recorre el aro
  f('perla', 'Perla', 'Metales', 'conic-gradient(#ffffff, #f3e6ff, #e2f3ff, #fff3e6, #ffffff)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),
  f('cromo', 'Cromo', 'Metales', 'linear-gradient(135deg, #f5f7fa, #8a93a6, #f5f7fa, #4b5263)', { width: 0.09, fx: 'shimmer' }),
  f('opalo', 'Ópalo', 'Metales', 'conic-gradient(#b8f2e6, #f9c6ff, #ffe7b3, #b3d4ff, #b8f2e6)', { width: 0.09, anim: 'frame-spin-slow', fx: 'shimmer' }),
  f('oro-rosa', 'Oro rosa', 'Metales', 'linear-gradient(135deg, #ffe0d6, #e8a598, #b9706a, #f3c4b8)', { width: 0.09, fx: 'shimmer' }),
  f('bronce', 'Bronce', 'Metales', 'linear-gradient(135deg, #f0c9a0, #b07434, #6e4120, #d9a46b)', { tier: 'grand', width: 0.09, fx: 'shimmer' }),

  // Punteados: el aro se corta en segmentos que giran
  f('pixel', 'Píxel', 'Punteados', 'conic-gradient(#ff2e93, #ffba67, #59dac1, #7a2cff, #ff2e93)', { width: 0.09, fx: 'dash', anim: 'frame-spin' }),

  // Dobles: un segundo aro gira en sentido contrario
  f('eco', 'Eco', 'Dobles', ld('#1b5296', '#93c6ff'), { tier: 'grand', width: 0.05, fx: 'double' }),
  f('saturno', 'Saturno', 'Dobles', 'linear-gradient(135deg, #ffe7a8, #c9930f)', { width: 0.06, fx: 'double', accent: '#ffe7a8' }),
  f('gemelos', 'Gemelos', 'Dobles', ld('#e0457f', '#ff9fb6'), { width: 0.05, fx: 'double', accent: ld('#2a61b1', '#93c6ff') }),
  f('nebula', 'Nébula', 'Dobles', 'conic-gradient(#7a2cff, #00d4ff, #7a2cff)', { width: 0.06, anim: 'frame-spin', fx: 'double', accent: '#ff9fb6' }),

  f('tetrada', 'Tétrada', 'Armonías', 'conic-gradient(#ff9fb6, #ffba67, #59dac1, #cab0ff, #ff9fb6)', { width: 0.09, anim: 'frame-spin-slow', fx: 'glow' }),

  // Temáticos
  f('neon-tubo', 'Tubo de neón', 'Temáticos', '#ff2e93', { width: 0.05, fx: 'glow' }),
  f('hud', 'Visor', 'Temáticos', '#00e5ff', { width: 0.035, fx: 'double', accent: '#00e5ff' }),
  f('fosforo', 'Fósforo', 'Temáticos', '#3dff8a', { width: 0.04, fx: 'ripple' }),
  f('portal', 'Portal', 'Temáticos', 'conic-gradient(#3dffb0, #7a2cff, #3dffb0)', { width: 0.09, anim: 'frame-spin', fx: 'glow' }),
  f('pelicula', 'Rollo de película', 'Temáticos', ld('#13202f', '#e6ecf3'), { tier: 'grand', width: 0.12, fx: 'dash', anim: 'frame-spin-slow' }),
  f('vineta', 'Viñeta', 'Temáticos', '#13202f', { width: 0.09, fx: 'double', accent: '#ffd23d' }),
  f('calabaza', 'Calabaza', 'Temáticos', '#ff8a1f', { width: 0.07, fx: 'glow' }),
  f('runa', 'Runa', 'Temáticos', 'linear-gradient(135deg, #ffe7a8, #c9930f)', { width: 0.07, fx: 'sparkle', accent: '#ffd36b' }),
  f('foco', 'Reflector', 'Temáticos', 'linear-gradient(135deg, #fff6c9, #ffd36b)', { width: 0.07, fx: 'shimmer' }),
  f('ochentero', 'Ochentero', 'Temáticos', 'linear-gradient(135deg, #00e5ff, #ff2e93)', { width: 0.07, fx: 'glow', anim: 'frame-spin' }),

  // Ornamentos: piezas que salen del aro, cada una con variantes
  f('llama', 'Llama', 'Llamas', '#ff5a1f', { tier: 'grand', width: 0.06, fx: 'flames', accent: '#ff5a1f', accent2: '#ffd36b' }),
  f('llama-azul', 'Llama azul', 'Llamas', '#2fa8ff', { width: 0.06, fx: 'flames', accent: '#2fa8ff', accent2: '#e0f7ff' }),
  f('llama-verde', 'Fuego fatuo', 'Llamas', '#3ddc5a', { width: 0.06, fx: 'flames', accent: '#4dff6a', accent2: '#eaffd0' }),
  f('alas-angel', 'Alas de ángel', 'Alas', 'linear-gradient(135deg, #fff1b8, #f0b94a)', { width: 0.06, fx: 'wings', accent: '#ffffff', accent2: '#ffd36b' }),
  f('alas-demonio', 'Alas de sombra', 'Alas', 'linear-gradient(135deg, #5a0a1c, #13020a)', { width: 0.06, fx: 'wings', accent: '#2a0610', accent2: '#ff3d5a' }),
  f('alas-hada', 'Alas de hada', 'Alas', 'conic-gradient(#ffc6e6, #c6f0ff, #d9c6ff, #ffc6e6)', { width: 0.06, fx: 'wings', accent: '#c6f0ffcc', accent2: '#ffc6e6' }),
  f('cuernos', 'Cuernos', 'Cuernos', 'linear-gradient(135deg, #5a0a1c, #13020a)', { width: 0.07, fx: 'horns', accent: '#8a0f2a', accent2: '#ff5a5a' }),
  f('cuernos-hueso', 'Cuernos de hueso', 'Cuernos', 'linear-gradient(135deg, #e8dcc4, #a89878)', { width: 0.07, fx: 'horns', accent: '#f3ead8', accent2: '#a89878' }),
  f('aureola', 'Aureola', 'Aureolas', 'linear-gradient(135deg, #fff1b8, #f0b94a)', { tier: 'grand', width: 0.05, fx: 'angel', accent: '#ffd36b' }),
  f('aureola-neon', 'Aureola neón', 'Aureolas', '#00e5ff', { width: 0.05, fx: 'angel', accent: '#00e5ff' }),
  f('circulo-arcano', 'Círculo arcano', 'Runas', '#9b5cff', { width: 0.04, fx: 'runes', accent: '#c9a4ff' }),
  f('circulo-dorado', 'Círculo dorado', 'Runas', '#f0b94a', { width: 0.04, fx: 'runes', accent: '#ffd36b' }),
  f('corona-cristal', 'Corona de cristal', 'Cristales', '#3de8ff', { width: 0.05, fx: 'crystals', accent: '#3de8ff', accent2: '#e0fbff' }),
  f('corona-rosa', 'Cuarzo', 'Cristales', '#ff7fcf', { width: 0.05, fx: 'crystals', accent: '#ff7fcf', accent2: '#ffe3f4' }),
  f('voltaje', 'Voltaje', 'Electricidad', '#4db8ff', { width: 0.05, fx: 'electric', accent: '#bfe6ff' }),
  f('voltaje-violeta', 'Voltaje violeta', 'Electricidad', '#b26bff', { width: 0.05, fx: 'electric', accent: '#ecd9ff' }),
  f('enredadera', 'Enredadera', 'Naturaleza', '#2f8a4f', { width: 0.05, fx: 'vines', accent: '#4fbf6a', accent2: '#a8e6a0' }),
  f('rosal', 'Rosal', 'Naturaleza', '#2f6a3f', { width: 0.05, fx: 'vines', accent: '#ff6f9f', accent2: '#ffc6d9' }),
  f('joyero', 'Joyero', 'Gemas', 'linear-gradient(135deg, #fff1b8, #c9930f)', { width: 0.07, fx: 'gems', accent: '#ff3d6e', accent2: '#3de8ff' }),
  f('esmeraldas', 'Esmeraldas', 'Gemas', 'linear-gradient(135deg, #e8ebf2, #8a93a6)', { width: 0.07, fx: 'gems', accent: '#1fbf6a', accent2: '#7fffb0' }),
  f('falla', 'Falla', 'Digital', '#ffffff', { width: 0.05, fx: 'glitch', accent: '#ff2e93', accent2: '#00e5ff' }),
  f('falla-acida', 'Falla ácida', 'Digital', '#b6ff00', { width: 0.05, fx: 'glitch', accent: '#9d4bff', accent2: '#00ffd5' }),
  f('orejitas', 'Orejitas', 'Tiernos', '#ffb7d5', { tier: 'grand', width: 0.05, fx: 'ears', accent: '#ffb7d5', accent2: '#ff7fae' }),
  f('orejitas-noche', 'Orejitas de noche', 'Tiernos', '#2a2f5a', { width: 0.05, fx: 'ears', accent: '#2a2f5a', accent2: '#b6a8ff' }),
  f('vacio', 'Vacío', 'Cósmicos', '#120a1a', { width: 0.06, fx: 'void', accent: '#ffb347', accent2: '#ff6a1f' }),
  f('vacio-violeta', 'Vacío violeta', 'Cósmicos', '#140a2a', { width: 0.06, fx: 'void', accent: '#c77dff', accent2: '#7a2cff' }),
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
  e('nieve', 'Nieve', 'Naturaleza', 'snowflake', 'down', ['#ffffff', '#cfe3ff'], { tier: 'grand' }),
  e('hojas', 'Hojas', 'Naturaleza', 'leaf', 'down', ['#71b280', '#ffba67', '#d98a4a'], { tier: 'grand' }),
  e('flores', 'Flores', 'Naturaleza', 'flower-2', 'drift', ['#ff9fb6', '#ffffff', '#ffba67'], { tier: 'grand' }),
  e('notas', 'Música', 'Pasatiempos', 'music', 'up', ['#cab0ff', '#ffffff'], { tier: 'grand' }),
  e('lunas', 'Lunas', 'Brillos', 'moon-star', 'twinkle', ['#fff1b8', '#cdd4fb'], { tier: 'grand' }),
  e('rayos', 'Rayos', 'Brillos', 'zap', 'twinkle', ['#f9d423', '#fe8c00']),
  e('plumas', 'Plumas', 'Naturaleza', 'feather', 'down', ['#ffffff', '#cdd4fb'], { tier: 'grand' }),
  e('nubes', 'Nubes', 'Naturaleza', 'cloud', 'drift', ['#ffffffcc', '#cfe3ffcc'], { tier: 'grand' }),
  e('gemas', 'Gemas', 'Brillos', 'gem', 'twinkle', ['#59dac1', '#cab0ff', '#ff9fb6']),
  e('coronas', 'Coronas', 'Clásicos', 'crown', 'up', ['#ffba67', '#fff1b8']),
  e('cafes', 'Cafés', 'Pasatiempos', 'coffee', 'up', ['#d9b38c', '#fff1e0'], { tier: 'grand' }),
  e('burbujas', 'Burbujas', 'Formas', null, 'bubble', ['#ffffffaa', '#cfe3ffaa'], { tier: 'grand', shape: 'ring' }),
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
  e('petalos', 'Pétalos', 'Naturaleza', null, 'down', ['#ffc6d9', '#ff9fb6', '#ffffff'], { tier: 'grand', shape: 'petal' }),
  e('sakura', 'Sakura', 'Naturaleza', 'flower-2', 'down', ['#ffd1e0', '#ffa3c1'], { tier: 'grand' }),
  e('lluvia', 'Lluvia', 'Naturaleza', null, 'rain', ['#ffffffaa', '#bae1fbaa'], { tier: 'grand', shape: 'streak' }),
  e('pompas', 'Pompas', 'Formas', null, 'bubble', ['#cab0ff99', '#59dac199', '#ff9fb699'], { shape: 'ring' }),
  e('auroras', 'Polvo de aurora', 'Formas', null, 'float', ['#59dac1', '#cab0ff', '#ff9fb6'], { shape: 'glow' }),
  e('atomos', 'Átomos', 'Formas', null, 'orbit', ['#59dac1', '#ff9fb6'], { shape: 'dot' }),
  e('anillos', 'Anillos', 'Formas', null, 'burst', ['#ffffff', '#bae1fb'], { shape: 'ring' }),
  e('soles', 'Soles', 'Naturaleza', 'sun', 'float', ['#ffba67', '#fff1b8'], { tier: 'grand' }),
  e('cine', 'Cine', 'Pasatiempos', 'clapperboard', 'up', ['#ffffff', '#ffba67'], { tier: 'grand' }),
  e('gamer', 'Gamer', 'Pasatiempos', 'gamepad-2', 'float', ['#cab0ff', '#59dac1', '#ff9fb6']),
  e('dados', 'Dados', 'Pasatiempos', 'dices', 'flip', ['#ffffff', '#ff9fb6']),
  e('arte', 'Arte', 'Pasatiempos', 'palette', 'drift', ['#ffba67', '#ff9fb6', '#59dac1']),
  e('fotos', 'Fotos', 'Pasatiempos', 'camera', 'twinkle', ['#ffffff', '#bae1fb']),
  e('viajes', 'Viajes', 'Pasatiempos', 'send', 'drift', ['#ffffff', '#93c6ff']),
  e('pasos', 'Pasos', 'Pasatiempos', 'footprints', 'up', ['#ffffff', '#ffba67'], { tier: 'grand' }),
  e('boletos', 'Boletos', 'Pasatiempos', 'ticket', 'flip', ['#ffba67', '#ff9fb6']),
  e('risas', 'Risas', 'Clásicos', 'smile', 'float', ['#ffba67', '#fff1b8'], { tier: 'grand' }),
  e('brujulas', 'Brújulas', 'Pasatiempos', 'compass', 'orbit', ['#ffffff', '#59dac1']),
  e('cocina', 'Cocina', 'Pasatiempos', 'utensils', 'up', ['#ffffff', '#ffba67']),
  e('idiomas', 'Idiomas', 'Pasatiempos', 'languages', 'drift', ['#ffffff', '#cab0ff']),
  e('estudio', 'Estudio', 'Pasatiempos', 'graduation-cap', 'up', ['#ffffff', '#93c6ff']),
  e('amistad', 'Amistad', 'Clásicos', 'handshake', 'float', ['#ffba67', '#ffffff'], { tier: 'grand' }),

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
  n('menta', 'Menta', ld('#007b5a', '#65ddbb'), 'grand'),
  n('cielo', 'Cielo', ld('#006da6', '#6ed0ff'), 'grand'),
  n('lavanda', 'Lavanda', ld('#6451ac', '#c3b7ff'), 'grand'),
  n('coral', 'Coral', ld('#a43c2f', '#ffa696'), 'grand'),
  n('uva', 'Uva', ld('#7b489e', '#dcaefe'), 'grand'),
  n('esmeralda', 'Esmeralda', ld('#007834', '#89da9b'), 'grand'),
  n('lima', 'Lima', ld('#577600', '#b2d279'), 'grand'),
  n('turquesa', 'Turquesa', ld('#007982', '#4cdbe3'), 'grand'),
  n('cobalto', 'Cobalto', ld('#2a61b1', '#93c6ff'), 'grand'),
  n('orquidea', 'Orquídea', ld('#913f82', '#f4a6e3'), 'grand'),
  n('ciruela', 'Ciruela', ld('#9b3b6e', '#ffa3cf'), 'grand'),
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
  fx('fuego', 'Fuego', ld('#c2410c', '#ffb347'), 'fire'),
  fx('escarcha', 'Escarcha', ld('#0b6aa3', '#bfe8ff'), 'ice'),
  fx('pixel', 'Píxel', ld('#6e2fd1', '#ffd36b'), 'pixel'),
]

// Temas: combinan fondo, marco, efecto y nombre de una sola vez.
// Están inspirados en géneros y estéticas, nunca en obras, personajes ni marcas concretas.
export type Rarity = 'rara' | 'epica' | 'legendaria' | 'mitica'

export interface Theme {
  key: string
  label: string
  group: string
  idea: string
  rarity?: Rarity
  banner: string
  frame: string
  effect: string
  name: string
}

const t = (key: string, label: string, group: string, idea: string, banner: string, frame: string, effect: string, name: string, rarity?: Rarity): Theme => ({
  key,
  label,
  group,
  idea,
  banner,
  frame,
  effect,
  name,
  rarity,
})

export const THEMES: Theme[] = [
  // Colecciones con rareza (como las líneas de aspectos de los juegos)
  t('col-llama', 'Llama ancestral', 'Colecciones', 'Grietas de lava, brasas y un aro en llamas', 'llama-brasa', 'llama', 'brasas', 'fuego', 'legendaria'),
  t('col-infernal', 'Sombra infernal', 'Colecciones', 'Alas oscuras y fuego que no se apaga', 'llama-brasa', 'alas-demonio', 'brasas', 'drama', 'mitica'),
  t('col-celestial', 'Celestial', 'Colecciones', 'Alas blancas, oro y polvo de estrellas', 'runa-dorada', 'alas-angel', 'plumas', 'runa', 'mitica'),
  t('col-horizonte', 'Horizonte de sucesos', 'Colecciones', 'Un agujero negro que se traga la luz', 'horizonte', 'vacio', 'galaxia', 'cromo', 'mitica'),
  t('col-runas', 'Runas arcanas', 'Colecciones', 'Círculos mágicos que giran sin parar', 'runa-arcana', 'circulo-arcano', 'polvo-estelar', 'runa', 'legendaria'),
  t('col-corte', 'Corte real', 'Colecciones', 'Damasco dorado y una aureola', 'realeza-oro', 'aureola', 'lluvia-oro', 'marquesina', 'legendaria'),
  t('col-pulso', 'Pulso digital', 'Colecciones', 'Señal rota, neón y estática', 'pulso-rosa', 'falla', 'codigo', 'falla', 'epica'),
  t('col-cristal', 'Cristal', 'Colecciones', 'Fragmentos que brillan por dentro', 'cristal-cian', 'corona-cristal', 'gemas', 'holograma', 'epica'),
  t('col-tormenta', 'Tormenta eléctrica', 'Colecciones', 'Relámpagos y un aro con voltaje', 'rayo-azul', 'voltaje', 'lluvia', 'cromo', 'epica'),
  t('col-cerezo', 'Tinta y cerezo', 'Colecciones', 'Montañas de tinta, luna y pétalos', 'cerezo-noche', 'rosal', 'petalos', 'rosa-cursiva', 'epica'),
  t('col-sumergido', 'Reino sumergido', 'Colecciones', 'Luz bajo el agua y burbujas', 'arrecife', 'sonar', 'pompas', 'holograma', 'epica'),
  t('col-arcade', 'Arcade', 'Colecciones', 'Paisaje de píxeles y joyas de puntaje', 'arcade-atardecer', 'joyero', 'gamer', 'pixel', 'epica'),
  t('col-colmena', 'Colmena', 'Colecciones', 'Hexágonos que se encienden en oleadas', 'colmena-ambar', 'ambar', 'atomos', 'terminal', 'rara'),
  t('col-escarcha', 'Escarcha', 'Colecciones', 'Hielo en los bordes y nieve que cae', 'escarcha', 'corona-cristal', 'nieve', 'escarcha', 'rara'),
  t('col-tierno', 'Dulzura', 'Colecciones', 'Orejitas, corazones y cielo de caricatura', 'cielo-anime', 'orejitas', 'corazones', 'rosa-cursiva', 'rara'),
  t('neon-nocturno', 'Neón nocturno', 'Ciencia ficción', 'Ciudades lluviosas con letreros de neón', 'ciudad-neon', 'neon-tubo', 'lluvia', 'neon'),
  t('hiperespacio', 'Hiperespacio', 'Ciencia ficción', 'Naves que saltan entre estrellas', 'hiperespacio', 'hud', 'fugaces', 'holograma'),
  t('terminal', 'Terminal', 'Ciencia ficción', 'Pantallas verdes y código que cae', 'terminal', 'fosforo', 'codigo', 'terminal'),
  t('planeta', 'Planeta lejano', 'Ciencia ficción', 'Exploración de mundos con anillos', 'planeta', 'saturno', 'cohetes', 'cromo'),
  t('portal', 'Portal', 'Ciencia ficción', 'Viajes en el tiempo y otras dimensiones', 'portal', 'portal', 'ovnis', 'falla'),
  t('ochentero', 'Ochentero', 'Series y programas', 'Atardeceres de neón y cuadrícula infinita', 'ochentero', 'ochentero', 'destellos', 'cromo'),
  t('tele-antigua', 'Tele de antes', 'Series y programas', 'Comedias de foro con risas grabadas', 'tele-antigua', 'falla', 'teles', 'falla'),
  t('en-vivo', 'En vivo', 'Series y programas', 'Concursos, reflectores y confeti', 'en-vivo', 'foco', 'confeti', 'marquesina'),
  t('telenovela', 'Telenovela', 'Series y programas', 'Romances intensos y miradas dramáticas', 'telenovela', 'rubi', 'petalos', 'drama'),
  t('cine-negro', 'Cine negro', 'Cine', 'Detectives, persianas y lluvia en blanco y negro', 'cine-negro', 'pelicula', 'lluvia', 'cine-negro'),
  t('funcion', 'Función de medianoche', 'Cine', 'Película vieja con grano y palomitas', 'funcion', 'pelicula', 'palomitas', 'sepia'),
  t('vineta', 'Viñeta', 'Cine', 'Historietas de héroes con onomatopeyas', 'vineta', 'vineta', 'fuegos', 'vineta'),
  t('embrujada', 'Noche embrujada', 'Fantasía y terror', 'Neblina, luna llena y algo que se mueve', 'embrujada', 'calabaza', 'fantasmas', 'embrujado'),
  t('murcielagos', 'Medianoche gótica', 'Fantasía y terror', 'Castillos oscuros y alas en la noche', 'embrujada', 'cuernos', 'murcielagos', 'drama'),
  t('reino', 'Reino encantado', 'Fantasía y terror', 'Castillos, magia y brasas al atardecer', 'reino', 'runa', 'brasas', 'runa'),
  t('cielo-anime', 'Cielo de anime', 'Anime y caricatura', 'Nubes enormes y pétalos al viento', 'cielo-anime', 'hada', 'sakura', 'rosa-cursiva'),
  t('sabado', 'Sábado de caricaturas', 'Anime y caricatura', 'Colores planos, risas y golpes de onomatopeya', 'sabado', 'vineta', 'risas', 'vineta'),
  t('teatro', 'Gran estreno', 'Cine', 'Alfombra, reflectores y telón', 'en-vivo', 'oro', 'teatro', 'marquesina'),
]

export const themeOf = (key?: string) => THEMES.find((x) => x.key === key)

export const TOTAL_STYLES = BANNERS.length + FRAMES.length + EFFECTS.length + NAME_STYLES.length - 4
// Estilos incluidos en Grand (sin contar los 'sin estilo' gratuitos)
export const GRAND_STYLES = [...BANNERS, ...FRAMES, ...EFFECTS, ...NAME_STYLES].filter((x) => x.tier === 'grand').length

// Fondos y marcos retirados por simples: quien los tenía pasa al reemplazo más parecido
const LEGACY_BANNERS: Record<string, string> = {
  halo: 'runa-hielo', dusk: 'cerezo-dia', alba: 'escarcha', durazno: 'cerezo-dia', lavanda: 'cristal-amatista', 'rosa-polar': 'cristal-rosa',
  cereza: 'cristal-rosa', 'neon-noche': 'pulso-rosa', prisma: 'cristal-rosa', fuego: 'llama-brasa', sirena: 'arrecife', caramelo: 'cerezo-dia',
  lima: 'colmena-ambar', mandarina: 'llama-brasa', uva: 'runa-arcana', sandia: 'realeza-carmesi', confetti: 'en-vivo', puntos: 'colmena-cian',
  rayas: 'arcade-atardecer', cuadros: 'arcade-noche', tartan: 'realeza-carmesi', escamas: 'arrecife', zigzag: 'pulso-acido', diamantes: 'realeza-oro',
  cuaderno: 'cerezo-dia', plano: 'colmena-cian', terrazo: 'cerezo-dia', niebla: 'escarcha', tropical: 'arrecife', chicle: 'cristal-rosa',
  ajedrez: 'arcade-noche', lunares: 'realeza-carmesi', panal: 'colmena-ambar', complementario: 'horizonte', triada: 'pulso-rosa',
  tetrada: 'cristal-amatista', 'analogo-mar': 'abisal', 'analogo-fuego': 'llama-brasa', dividido: 'pulso-acido', monocromo: 'escarcha-aurora',
}
const LEGACY_FRAMES: Record<string, string> = {
  dusk: 'aureola', rosa: 'orejitas', menta: 'enredadera', petalos: 'rosal', caramelo: 'joyero', selva: 'enredadera', uva: 'circulo-arcano',
  sandia: 'cuernos', noche: 'vacio', tinta: 'falla', hilo: 'aureola', rayitas: 'voltaje', oceano: 'corona-cristal', puntos: 'circulo-dorado',
  confeti: 'joyero', costura: 'circulo-dorado', cinta: 'voltaje', reloj: 'circulo-dorado', complementario: 'llama-azul', triada: 'falla',
  'analogo-mar': 'corona-cristal', 'analogo-fuego': 'llama', dividido: 'falla-acida', monocromo: 'aureola-neon',
}

const find = <T extends { key: string }>(list: T[], key: string | undefined) => list.find((x) => x.key === key) ?? list[0]
export const bannerOf = (key?: string) => find(BANNERS, (key && LEGACY_BANNERS[key]) || key)

// Agrupa un catálogo por su campo group, conservando el orden
export const groupsOf = <T extends { group: string }>(list: T[]) =>
  [...new Set(list.map((x) => x.group))].map((group) => ({ group, items: list.filter((x) => x.group === group) }))
export const frameOf = (key?: string) => find(FRAMES, (key && LEGACY_FRAMES[key]) || key)
export const effectOf = (key?: string) => find(EFFECTS, key)
export const nameStyleOf = (key?: string) => find(NAME_STYLES, key)
