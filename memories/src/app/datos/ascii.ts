import type { Intent } from '../modelos/intents'

/**
 * Arte ASCII hecho a mano, de línea, para la segunda voz gráfica de mémoires: dibujos
 * "a máquina de escribir" pegados en el álbum.
 *
 * Marcas dentro de cada línea:
 *   {texto}  la única parte en el color de la intención (pétalos, vapor, relleno)
 *   «texto»  detalle en el tono suave del tema
 * Todo lo demás va en el trazo del tema (violeta en el claro, naranja en el oscuro).
 * Cada pieza puede tener varios cuadros: el primero es el de reposo.
 */
export interface AsciiPiece {
  label: string
  intent: Intent
  frames: string[][]
}

// Quita la línea vacía inicial y final y la sangría común, para escribir los dibujos alineados
const art = (raw: TemplateStringsArray) => {
  const lines = String.raw(raw).replace(/^\n|\n\s*$/g, '').split('\n')
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length))
  return lines.map((l) => l.slice(indent).replace(/\s+$/, ''))
}

export const ASCII: Record<string, AsciiPiece> = {
  flor: {
    label: 'una flor abierta',
    intent: 'romance',
    frames: [
      art`
            {.-.}
          {.(   ).}
         {(  '-'  )}
           {'-.-'}
             |
          \  |  /
           \ | /
         «~~~~»|«~~~~»
      `,
    ],
  },
  'flor-marchita': {
    label: 'una flor que se endereza',
    intent: 'romance',
    frames: [
      art`
        
             .--.__
             |     \
             |    {.-.}
             |   {(   )}
             |    {'-'}
             |
          «~~~»|«~~~~~~»
      `,
      art`
            {.-.}
          {.(   ).}
         {(  '-'  )}
           {'-.-'}
             |
          \  |  /
           \ | /
         «~~~~»|«~~~~»
      `,
    ],
  },
  taza: {
    label: 'una taza de café con vapor',
    intent: 'friend',
    frames: [
      art`
          {( (}
           {) )}
        .______.
        |      |]
        \      /
         '----'
      `,
      art`
           {) )}
          {( (}
        .______.
        |      |]
        \      /
         '----'
      `,
      art`
          {(  (}
            {) )}
        .______.
        |      |]
        \      /
         '----'
      `,
    ],
  },
  'dos-tazas': {
    label: 'dos tazas de café esperando',
    intent: 'friend',
    frames: [
      art`
          {( (}        {) )}
           {) )}      {( (}
        .______.   .______.
        |      |]  |      |]
        \      /   \      /
         '----'     '----'
      `,
    ],
  },
  concha: {
    label: 'un pan dulce',
    intent: 'friend',
    frames: [
      art`
            _.-~~~~-._
          .'{/ \ / \ /} '.
         ( {\ / \ / \ / \} )
          '-.._______..-'
      `,
    ],
  },
  cerezas: {
    label: 'unas cerezas',
    intent: 'romance',
    frames: [
      art`
             _/
            / \
           /   \
        {(@)}  {(@)}
      `,
    ],
  },
  taco: {
    label: 'un taco',
    intent: 'plan',
    frames: [
      art`
            _.-'''''-._
          .'{  o  *  o  }'.
         /{~~~~~~~~~~~~~~~}\
        /_________________\
      `,
    ],
  },
  mantel: {
    label: 'un plato vacío sobre un mantel',
    intent: 'plan',
    frames: [
      art`
             _.-'''''-._
           .'  {.---.}  '.
          |   {(     )}   |
           '.  {'---'}  .'
             '-._____.-'
        «/\/\/\/\/\/\/\/\/\/\»
      `,
    ],
  },
  libro: {
    label: 'un libro abierto',
    intent: 'hobby',
    frames: [
      art`
          __________ ___________
         /          |           \
        |  «~~~~~~»   |  {~~~~~}    |
        |  «~~~~»     |  «~~~~~~»   |
        |  «~~~~~»    |  «~~~»      |
        |___________|___________|
         '----------'-----------'
      `,
    ],
  },
  dado: {
    label: 'un dado',
    intent: 'hobby',
    frames: [
      art`
           _______
          /\  {o}   \
         /{o} \   {o}  \
        /  {o} \______\
        \ {o}  /{o}     /
         \  /   {o}  /
          \/_____{o}/
      `,
    ],
  },
  nota: {
    label: 'una nota musical',
    intent: 'hobby',
    frames: [
      art`
             {|\}
             {| \}
             |  {\}
         .-. |   {|}
        (   )|  {/}
         '-'
      `,
    ],
  },
  tenis: {
    label: 'un tenis para correr',
    intent: 'plan',
    frames: [
      art`
              _____
             / {///} \
         ___/  {///}  |
        (___________)
         '«-o-o-o-o-»'
      `,
    ],
  },
  maceta: {
    label: 'una maceta con un brote',
    intent: 'hobby',
    frames: [
      art`
          {_    _}
         {( \  / )}
            ||
         ___||___
        [________]
         \      /
          \____/
      `,
    ],
  },
  lupa: {
    label: 'una lupa',
    intent: 'hobby',
    frames: [
      art`
          .-"""-.
         /   {?}   \
        |         |
         \       /
          '-...-'\
                  \\
                   \\
      `,
    ],
  },
  planta: {
    label: 'una planta que crece',
    intent: 'plan',
    frames: [
      art`
        
        
        
        
        
            {.}
          [___]
           \_/
      `,
      art`
        
        
        
        
           {\}|
            |
          [___]
           \_/
      `,
      art`
        
        
        
          {\} | {/}
           {\}|{/}
            |
          [___]
           \_/
      `,
      art`
           {.-.}
          {(   )}
           {'-'}
          {\} | {/}
           {\}|{/}
            |
          [___]
           \_/
      `,
    ],
  },
}

// Miniatura por intención para tarjetas sin foto y estados vacíos
export const ASCII_BY_INTENT: Record<Intent, string> = {
  romance: 'flor',
  friend: 'taza',
  plan: 'taco',
  hobby: 'dado',
}

export interface AsciiSeg {
  t: string
  k: '' | 'a' | 'd'
}

// Parte una línea en tramos según las marcas {intención} y «detalle»
export function parseLine(line: string): AsciiSeg[] {
  const out: AsciiSeg[] = []
  const re = /\{([^}]*)\}|«([^»]*)»/g
  let last = 0
  for (let m = re.exec(line); m; m = re.exec(line)) {
    if (m.index > last) out.push({ t: line.slice(last, m.index), k: '' })
    out.push(m[1] !== undefined ? { t: m[1], k: 'a' } : { t: m[2], k: 'd' })
    last = re.lastIndex
  }
  if (last < line.length) out.push({ t: line.slice(last), k: '' })
  return out
}
