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
    label: 'una rosa abierta',
    intent: 'romance',
    frames: [
      art`
                   {.-'''''''-.}
               {.-'  .-''''-.  '-.}
             {.'   .'  .--.  '.   '.}
            {/    /  .'    '.  \    \}
           {|    |  (   @@   )  |    |}
           {|    |   '.    .'   |    |}
            {\    \    '--'    /    /}
             {'.   '-.______.-'   .'}
         {.-''-.'-.            .-'.-''-.}
        {(      '-.'-..____..-'.-'      )}
          {'-.       ''''''''       .-'}
            {'-..___          ___..-'}
                 {''''-.  .-''''}
                       ||
           .-«~~~»-.     ||     .-«~~~»-.
         .'  «~~~  »'.   ||   .'  «~~~  »'.
        (  «~~~~~~~  »'-.||.-'  «~~~~~~~  »)
         '.  «~~~   ».'  ||  '.   «~~~  ».'
           '-...-'    >||<    '-...-'
                       ||
                       ||
         «~~~~~~~~~~~~~~»||«~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `,
    ],
  },
  'flor-marchita': {
    label: 'una rosa que se endereza',
    intent: 'romance',
    frames: [
      art`




                        {.-----------.}
                      {.'             '.}
                     /                 {\}
                    |               {.-'''''-.}
                    |             {.'  .--.   '.}
                    |            {(   (  @@ )   )}
                    |             {'.  '--'   .'}
                    |               {'-.___.-'}
                    |                  {'.'}
                    |
           .-«~~~»-.  |
         .'  «~~~  »'.|
        (  «~~~~~~~  »'|
         '.  «~~~   ».'|
           '-...-'   |
                     |
                     |
         «~~~~~~~~~~~~»|«~~~~~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `,
      art`
                   {.-'''''''-.}
               {.-'  .-''''-.  '-.}
             {.'   .'  .--.  '.   '.}
            {/    /  .'    '.  \    \}
           {|    |  (   @@   )  |    |}
           {|    |   '.    .'   |    |}
            {\    \    '--'    /    /}
             {'.   '-.______.-'   .'}
         {.-''-.'-.            .-'.-''-.}
        {(      '-.'-..____..-'.-'      )}
          {'-.       ''''''''       .-'}
            {'-..___          ___..-'}
                 {''''-.  .-''''}
                       ||
           .-«~~~»-.     ||     .-«~~~»-.
         .'  «~~~  »'.   ||   .'  «~~~  »'.
        (  «~~~~~~~  »'-.||.-'  «~~~~~~~  »)
         '.  «~~~   ».'  ||  '.   «~~~  ».'
           '-...-'    >||<    '-...-'
                       ||
                       ||
         «~~~~~~~~~~~~~~»||«~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `,
    ],
  },
  taza: {
    label: 'una taza de café con vapor',
    intent: 'friend',
    frames: [
      art`
                   {(     )    (}
                    {)   (    )  )}
                   {(     )  (   (}
                    {)  (     )    )}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `,
      art`
                    {)    (     )}
                   {(   )    (    (}
                    {)    (  )    )}
                   {(   (     )   (}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `,
      art`
                   {(    (     )}
                    {)     )  (   )}
                   {(    (    )   (}
                    {)    )  (     )}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `,
    ],
  },
  'dos-tazas': {
    label: 'dos tazas de café esperando',
    intent: 'friend',
    frames: [
      art`
               {(   )                          (   )}
                {)   (                        )   (}
               {(   )                          (   )}
            .-'''''''''-.                .-'''''''''-.
           (             )              (             )
           |'-.._____..-'|---.      .---|'-.._____..-'|
           |  «.-.   .-.  »|   |      |   |  «.-.   .-.  »|
           |  «'-'   '-'  »| .-'      '-. |  «'-'   '-'  »|
           |             |-'          '-|             |
            \           /                \           /
              '-.._..-'                    '-.._..-'
         ____________________________________________________
        (____________________________________________________)
      `,
    ],
  },
  cerezas: {
    label: 'unas cerezas con su hoja',
    intent: 'romance',
    frames: [
      art`
                           __
                         .'  '.
                     _.-'  «~~  »)
                   .' «~~~~  ».-'|
                   '-....-''   |
                         /     \
                        /       \
                       /         \
                      /           \
                     /             \
               {.--../               \..--.}
             {.' .-.  '.           .' .-.  '.}
            {/  (   )   \         /  (   )   \}
           {|    '-'     |       |    '-'     |}
           {|            |       |            |}
            {\          /         \          /}
             {'.      .'           '.      .'}
               {'----'               '----'}
      `,
    ],
  },
  'ramo-arleth': {
    label: 'un ramo de rosas para Arleth',
    intent: 'romance',
    frames: [
      art`
           {.-'''-.     .-'''-.     .-'''-.}
          {( (@@@) )   ( (@@@) )   ( (@@@) )}
           {'-...-'     '-...-'     '-...-'}
           {.-'''-.  }\  {.-'''-.  }/  {.-'''-.}
          {( (@@@) )  }\{( (@@@) )}/  {( (@@@) )}
           {'-...-'    }\{'-...-'}/    {'-...-'}
                \  «~~  »\  |  /  «~~  »/
                 \ «~~~  »\ | /  «~~~ »/
                  '. «~   »\|/   «~ ».'
                    '-.  \|/  .-'
                    '-.___|___.-'
              .-----------'-----------.
             (     «~   »{Arleth   }«~     »)
              '-----------.-----------'
                     /  \ | /  \
                    /    \|/    \
                   /      |      \
                  / «·  ·  »|  «·  · »\
                 /________|________\
      `,
    ],
  },
  corazon: {
    label: 'un corazón con el nombre de Arleth',
    intent: 'romance',
    frames: [
      art`
            .-'''''-.     .-'''''-.
          .'         '. .'         '.
         /             V             \
         |                           |
         |           {Arleth          }|
         |                           |
         \      «~ »{eres bonita }«~      »/
          '.                       .'
            '.                   .'
              '.               .'
                '.           .'
                  '.       .'
                    '.   .'
                      'V'
      `,
    ],
  },
  tetera: {
    label: 'una tetera humeante',
    intent: 'friend',
    frames: [
      art`
                          {_}
                        {_(_)_}
                     .-'     '-.
              .--.  /           \        __
             /  .-'|  «~~~ ~~~~   »|      / /
            |  /   |             |_____/ /
            |  \   |  «~~~~ ~~~   »|------'
             \  '-.|             |
              '--' \  «~~ ~~~~~  »/
                    '-._______.-'
                 .-'''''''''''''-.
                 '-.___________.-'
      `,
    ],
  },
  pan: {
    label: 'un pan dulce',
    intent: 'friend',
    frames: [
      art`
                _.-''''''''''''-._
             {.-'  .  '  .  '  .  '-.}
           {.'  '  .  '  .  '  .  '  '.}
          {/  .  '  .  '  .  '  .  '  . \}
         {|  '  .  '  .  '  .  '  .  '  |}
         |«~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»|
         '-.__________________________.-'
      `,
    ],
  },
  globo: {
    label: 'un globo aerostático',
    intent: 'plan',
    frames: [
      art`
             {.-''''''''''-.}
           {.'  |   |   |   '.}
          {/   |    |    |    \}
          {|   |     |     |   |}
          {|   |     |     |   |}
           {\   \    |    /   /}
            {'.  \   |   /  .'}
              '. \  |  / .'
                '.\ | /.'
                  \ | /
                   \|/
                 [_____]
                 |_____|
      `,
    ],
  },
  boletos: {
    label: 'dos boletos para un plan con Arleth',
    intent: 'plan',
    frames: [
      art`
         .------------------.-------.
         |  ¿{vamos}?         :  {N}.   |
         )   {para dos       }:  02   (
         |  «· · · · · · ·   »:       |
         '------------------'-------'
              .------------------.-------.
              |  {primera fila    }:  {N}.   |
              )   {Arleth y tú    }:  03   (
              |  «· · · · · · ·   »:       |
              '------------------'-------'
      `,
    ],
  },
  tienda: {
    label: 'una tienda de campaña bajo las estrellas',
    intent: 'plan',
    frames: [
      art`
            {*        .        *}
              {.             *}
                     /\
                    /  \
                   /    \
                  /  /\  \
                 /  /  \  \
                /  /    \  \
               /  /      \  \
              /  /   ..   \  \
             /__/___/  \___\__\
         «~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `,
    ],
  },
  guitarra: {
    label: 'una guitarra',
    intent: 'hobby',
    frames: [
      art`
               _
             «=»|_|«=»
             «=»|_|«=»
              | |
              | |
              | |
              | |
            {.-| |-.}
           {/  | |  \}
          {|  .| |.  |}
          {\ (  O  ) /}
          {/  '---'  \}
         {|    ===    |}
         {|           |}
          {\         /}
           {'-.___.-'}
      `,
    ],
  },
  paleta: {
    label: 'una paleta de pintor',
    intent: 'hobby',
    frames: [
      art`
                 _.-''''''''''-._
              .-'  ({o})    ({o})    '-.
            .'  ({o})            .--.  '.
           /          ({o})     (    )   \
          |   ({o})              '--'     |
           \          .-.              /
            '.       (   )          _.'
              '-.     '-'      _.--''
                 ''--..___..--''
      `,
    ],
  },
  taco: {
    label: 'un taco',
    intent: 'plan',
    frames: [
      art`
                      _.--''''''''''''''--._
                  {_.-'  o    *    o    *    '-._}
               .-'  {~~~~~~~~~~~~~~~~~~~~~~~~~~  '}-.
             .'  .  {*  .  o  .  *  .  o  .  *  .   }'.
            /  ~~~{~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~}~~  \
           «/   .     .     .     .     .     .        \»
          /____________________________________________\
      `,
    ],
  },
  mantel: {
    label: 'un plato vacío sobre un mantel',
    intent: 'plan',
    frames: [
      art`
                         _.--''''''''--._
            |||       .{-'   _.------._   '-}.        /|
            |||     .'   {.-'          '-.   }'.     | |
            |||    /    {/                \    }\    | |
            \_/   |    {|                  |    }|   | |
             |    |    {|                  |    }|   | |
             |    |    {|                  |    }|   |/
             |     \    {\                /    }/    |
             |      '.   {'-._        _.-'   }.'     |
             |        '{-.    ''----''    .-}'       |
             |           ''--..____..--''          |
         «/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\»
         «\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/»
      `,
    ],
  },
  libro: {
    label: 'un libro abierto',
    intent: 'hobby',
    frames: [
      art`
          ______________________ ______________________
         /                      |                      \
        |   «~~~~~~~~~~~~~~~~    »|   «~~~~~~~~~~~~~       »|
        |   «~~~~~~~~~~~~        »|   «~~~~~~~~~~~~~~~~~   »|
        |   «~~~~~~~~~~~~~~~     »|   «~~~~~~~~~           »|
        |   «~~~~~~~~~           »|   «~~~~~~~~~~~~~~      »|
        |   «~~~~~~~~~~~~~~      »|   «~~~~~~~~~~~~        »|
        |   «~~~~~~~~~~~         »|   «~~~~~~~~~~~~~~~~    »|
        |_______________________{|}_______________________|
         '-.____________________{V}____________________.-'
      `,
    ],
  },
  dado: {
    label: 'un dado',
    intent: 'hobby',
    frames: [
      art`
               ____________________
              /\                   \
             /  \     ({o})           \
            /({o}) \                   \
           /      \     ({o})           \
          / ({o})    \                   \
         /          \___________________\
         \          /                   /
          \ ({o})    /    ({o})       ({o})  /
           \      /                   /
            \    /     ({o})      ({o})  /
             \  /                   /
              \/___________________/
      `,
    ],
  },
  nota: {
    label: 'dos notas musicales',
    intent: 'hobby',
    frames: [
      art`
                      ______________________
                     |{______________________}|
                     |{______________________}|
                     |                      |
                     |                      |
                     |                      |
                 .--.|                  .--.|
                (    |                 (    |
                 '--'                   '--'
          «-------------------------------------»
          «-------------------------------------»
          «-------------------------------------»
      `,
    ],
  },
  tenis: {
    label: 'un tenis para correr',
    intent: 'plan',
    frames: [
      art`
                            ___________
                       _.--'  {|X|X|X|  }'--._
                    .-'       {|X|X|X|       }'-.
                 «.-'     o    o    o    o      '.»
            __.-'                                '.
          .'                                       '-------._
         (___________________________________________________)
          «'-..-..-..-..-..-..-..-..-..-..-..-..-..-..-..-..-'»
      `,
    ],
  },
  maceta: {
    label: 'una maceta con plantas y una flor',
    intent: 'hobby',
    frames: [
      art`
                         {.-.}
                      {.-(   )-.}
                     {(  '-.-'  )}
                      {'-.._..-'}
                 .-.      |      .-.
               .'   '.    |    .'   '.
              ( «~~~~  »'.  |  .'  «~~~~ »)
               '.  «~~~  »'.|.'  «~~~  ».'
                 '-...-'  |  '-...-'
            .-«~~»-.        |        .-«~~»-.
          .' «~~~  »'.      |      .'  «~~~ »'.
         ( «~~~~~~   »'-.   |   .-'   «~~~~~~ »)
          '.  «~~~    ».'   |   '.    «~~~  ».'
            '-.....-'     |     '-.....-'
          .-------------------------------.
          |_______________________________|
           «\ .:.   .:.   .:.   .:.   .:. /»
            «\  ':'  ':'  ':'  ':'  ':'  /»
             \                         /
              \_______________________/
      `,
    ],
  },
  lupa: {
    label: 'una lupa',
    intent: 'hobby',
    frames: [
      art`
                _.--''''''''--._
             .-'   _.------._   '-.
           .'   .-'          '-.   '.
          /    /                \    \
         |    |      {.--.        }|    |
         |    |      {'  .'       }|    |
         |    |        {|         }|    |
          \    \       {o        }/    /
           '.   '-._        _.-'   .'
             '-.    ''----''    .-'\ \
                ''--..____..--''    \ \
                                     \ \
                                      \ \
                                       \_\
      `,
    ],
  },
}

// Pieza para un plan sin foto: por palabras del título o la descripción; si no, por intención
const PLAN_WORDS: [RegExp, string][] = [
  [/corr|carrera|trote|km\b/i, 'tenis'],
  [/juego|catan|mesa|dado|rol\b/i, 'dado'],
  [/concierto|música|musica|banda|karaoke|guitarra/i, 'nota'],
  [/libro|lectura|leer|club de lectura|biblioteca/i, 'libro'],
  [/café|cafe|desayuno|pan\b/i, 'taza'],
  [/taco|comida|comer|cena|pizza|mercado/i, 'taco'],
  [/arleth|flor/i, 'ramo-arleth'],
  [/jard|planta|vivero/i, 'maceta'],
]

export function asciiForPlan(text: string, intent: Intent) {
  return PLAN_WORDS.find(([re]) => re.test(text))?.[1] ?? ASCII_BY_INTENT[intent]
}

// Dibujos de las esquinas de Descubre según lo que se busca (arriba izq., arriba der., abajo izq., abajo der.)
export const CORNERS_BY_SEARCH: Record<Intent | 'any', [string, string, string, string]> = {
  any: ['cerezas', 'flor', 'ramo-arleth', 'maceta'],
  romance: ['cerezas', 'flor', 'ramo-arleth', 'corazon'],
  friend: ['tetera', 'taza', 'pan', 'maceta'],
  plan: ['globo', 'boletos', 'tienda', 'lupa'],
  hobby: ['guitarra', 'paleta', 'dado', 'nota'],
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
