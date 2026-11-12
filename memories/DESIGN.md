# Sistema de diseño de mémoires

Fuente de verdad: `src/styles.css` (bloques `@theme` y `.dark`). Este documento resume las decisiones; si algo cambia en el código, se actualiza aquí.

## Idea

La interfaz es un álbum de recuerdos: papel con grano, tinta impresa con sombra desplazada, cinta adhesiva, notas a mano y polaroids. No hay vidrio ni desenfoques decorativos.

## Color

Cada tema tiene su propia pareja de colores y reparte 60-30-10: 60 % base (fondos), 30 % superficies y texto, 10 % acento (botones principales, enlaces, selección, lo activo y números clave).

| Tema | Base | Acento | Nunca |
|---|---|---|---|
| Claro | Beige (tono 80) | Violeta y lila (tono 300) | Morado oscuro en bloques, naranja |
| Oscuro | Morado (tono 300) | Naranja (tono 55) | Beige, lila |

- **Claro.** Beige y violeta son complementarios en el círculo de pintor. El beige casi no tiene croma, así que el violeta resalta sin gritar. La jerarquía se arma en un esquema monocromático: lila claro para superficies destacadas, lila medio para decoración, violeta para acción y violeta muy oscuro para el texto.
- **Oscuro.** Morado y naranja están a 115° en OKLCH, dos vértices de una tríada. Dan el máximo contraste de temperatura y de luminosidad. El texto es blanco con un toque de naranja.
- **Hilo entre temas.** Los dos comparten el tono 300, así la marca se reconoce al cambiar de tema.

### Tokens

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `mist` | `#f7f2e8` | `#110a1d` | Fondo de página |
| `surface` | `#fefcf8` | `#1a1228` | Tarjetas, campos |
| `raised` | `#fbf6ef` | `#251c36` | Superficie elevada |
| `line` / `line-strong` | `#e6ded3` / `#8b7e6d` | `#352c45` / `#796e8e` | Divisores / bordes de controles |
| `ink` | `#2e1f46` | `#f8ece3` | Texto principal |
| `ink-soft` / `ink-mute` | `#524569` / `#635975` | `#dac6b8` / `#b6a08f` | Texto secundario / terciario |
| `accent` / `accent-hover` | `#6e3ead` / `#5c2f95` | `#fc984c` / `#fdb57e` | Acción principal |
| `on-accent` | `#ffffff` | `#0c0519` | Texto sobre el acento |
| `accent-soft` | `#ede5fe` | naranja al 14 % | Selección, fondos suaves |
| `lila` | `#d2c0f5` | (no se usa en texto) | Decoración sin intención |
| `night` | `#e4d9fd` | `#0c0519` | Bloque destacado: panel de plan, Lucidité |
| `safe` | `#ede5fe` | `#321e24` | Sección de seguridad |
| `danger` | `#af2b25` | `#f68678` | Errores (siempre con ícono y texto) |

Variables de material (en `:root` y `.dark`): `--offset` (sombra desplazada: lila en el claro, naranja apagado en el oscuro), `--edge` (borde de tinta), `--paper-grain` (ruido SVG teñido), `--polaroid` y `--polaroid-ink`, `--note-bg` y `--note-ink`, `--marker` (resaltador).

### Intenciones (hexada)

Son los únicos colores fuera de las dos parejas. Tienen la misma luz y el mismo croma para que ninguna pese más, y solo van en piezas pequeñas: chips, hilo, cinta y el detalle del tramado.

| Intención | Tono | Claro (texto / suave) | Oscuro |
|---|---|---|---|
| Pareja (`romance`) | 355 | `#93506c` / `#fdeaf1` | `#f2a3c1` |
| Amistad (`friend`) | 95 | `#7a681c` / `#f5f0e0` | `#d2bd70` |
| Plan (`plan`) | 175 | `#0d7a66` / `#e2f5ef` | `#71d3ba` |
| Pasatiempo (`hobby`) | 245 | `#346e9c` / `#e4f2fe` | `#86c5fa` |

Un contenedor con `data-intent="…"` define `--intent-c` y `--intent-soft`; la cinta (`--tape`) y el hilo (`--thread`) los toman de ahí. Sin intención usan el acento del tema.

### Contraste (WCAG 2.1)

Todo texto pasa 4.5:1 y los bordes de controles 3:1 en ambos temas. Peores casos: `ink-mute` sobre `night` 4.86 en el claro; intenciones sobre su fondo suave 4.63; blanco sobre las intenciones 5.26 o más; `line-strong` 3.5.

### Sombras

- Claro: teñidas de violeta (`rgb(46 31 70 / …)`), nunca negras.
- Oscuro: negras, con un borde interior de luz naranja al 4 %.

## Tipografía

| Rol | Fuente | Notas |
|---|---|---|
| Títulos | Syne (ExtraBold) | Ancha y geométrica; da la voz |
| Palabras destacadas | Fraunces itálica | En el acento del tema |
| Texto | Space Grotesk | Grotesca legible |
| Notas a mano | Caveat | Subtítulos, polaroids, etiquetas flotantes |
| Datos y arte ASCII | Space Mono Bold | Microetiquetas con datos reales (`.mono-tag`: matches por semana, palabras del chat, cupo `3/6`, fecha y hora); nunca numeraciones de adorno |

Las cuatro son libres (SIL OFL) y se instalan desde Fontsource.

## Movimiento

- Duraciones: de 120 a 760 ms en la interfaz (botones 160–260 ms, cambios de página 560–620 ms, entradas 380–760 ms). Los trazos del hilo tardan 1.1 s (corto) y 2.2 s (largo).
- Curvas: `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` para entradas y respuestas; `--ease-in-out` `cubic-bezier(0.77, 0, 0.175, 1)` para cambios de estado; `--ease-drawer` `cubic-bezier(0.32, 0.72, 0, 1)` para paneles.
- Todo se anima con `transform`, `opacity` o `clip-path`. Con `prefers-reduced-motion` se quitan las animaciones y los hilos aparecen ya dibujados.

## Piezas

- **Hoja de sección** (`.page-sheet`): papel beige o morado con grano y una luz suave (`--paper-light`): brillo lila o naranja arriba a la derecha y sombra tibia abajo a la izquierda.
- **Hilo** (`app-thread`): trazo a mano que une dos avatares. En "Cómo funciona" cruza las tres hojas de lado y se dibuja con el scroll; corto en cada conexión (la persona y tú).
- **Álbum horizontal** ("Cómo funciona"): en escritorio la sección mide 300vh, su contenido queda fijo y el scroll vertical pasa las tres hojas de lado (`animation-timeline`, con respaldo en JS). Indicador de puntos y "1/3" en el acento. En móvil es un carrusel con `scroll-snap`; con movimiento reducido, las hojas se apilan. Cada hoja se puede enfocar con teclado.
- **Tramado** (fotos de Planes): semitono de dos tintas; un solo detalle (la cinta de la esquina) en el color de la intención. Al pasar el cursor se ve la foto a color.
- **Etiquetas flotantes** (Descubre): hasta cuatro intereses en común alrededor de la tarjeta, en el color de la intención. Solo en pantallas de 900 px o más; la tarjeta ya los dice en texto.
- **Nota adhesiva**: lila con texto violeta en el claro; naranja claro con texto morado en el oscuro.
- **Mancha de tinta** (cambio de tema): en lugar de un círculo, una mancha irregular con gotas (tres variantes al azar). Hacia oscuro, la tinta se esparce desde el botón; hacia claro, se retira hacia él. 560–600 ms con `--ease-in-out`. Con "Sistema", sin View Transitions o con movimiento reducido, el cambio es directo.
- **Ver con Lucidité** (Suscripción): interruptor que cruza el perfil propio sin y con el tema Celestial (fondo, marco con alas, efecto y nombre).
- **Conexiones**: cada tarjeta tiene borrar chat, eliminar conexión (con confirmación) y una agarradera para moverla. Al arrastrarla se inclina según la velocidad, como las fotos del tablero, las demás se hacen a un lado (FLIP) y al soltar se acomoda con rebote. Con teclado, las flechas la mueven una posición. Un botón quita de una vez las conexiones sin mensajes.

- **Objeto inflado de texto** (`app-inflado`, render en `utilidades/inflado-render.ts`, frases en `datos/inflados.ts`): globo de cromo dibujado con letras (ASCII). Cada celda de pantalla muestra la letra de las frases que cae en ese punto de la superficie; de frente es una letra por celda, así el texto se lee entero. Se mece unos 22° en lugar de girar completo. Formas por intención: corazón, taza, boleto y estrella, cubiertas de palabras bonitas ("eres mi lugar favorito", "un café contigo", "un atardecer juntos"…) con el nombre de Arleth entre ellas, siempre en su propio color. Letras de la sombra a la luz: violeta oscuro → violeta en el claro, naranja → durazno en el oscuro. Al aparecer se escribe hasta llenarse (2 s); al cambiar de intención se desinfla y se vuelve a llenar (600 ms). Con movimiento reducido o en equipos modestos, cuadro fijo. Va en el héroe, en la conexión nueva, al final de la bienvenida (estrella con tus intereses) y en la colección de efectos "Inflados" de Lucidité (cubierto con el nombre de la persona).
- **Arleth**: su nombre aparece en las frases del inflado, en el fondo tipográfico, en la persona de ejemplo de la intención Pareja (19 años, ya conectada contigo y con una conversación iniciada), en el ramo ASCII de los fondos "Jardín de texto" (y la variante "Jardín de Arleth"), en un plan cumplido ("flores para Arleth"), en la 404, en Descanso, en el álbum de "Cómo funciona", en la bienvenida y en el pie.
- **Planes cumplidos** (Planes): polaroids arrastrables de los planes a los que fuiste, con la foto en tramado (o la nota a mano en grande si no hay foto), la fecha en Space Mono y las iniciales de quienes fueron. Flechas para moverlas; cuadrícula fija con movimiento reducido; si no hay, una cámara ASCII que se decodifica.
- **Seguridad** (portada): borde superior de papel rasgado que se abre un poco con el scroll.
- **Pie**: columnas de producto, legal, contacto y equipo.
- **Un solo botón sólido por vista**: en la portada, "Crear cuenta" del encabezado y Lucidité en precios van en contorno.

## Un momento animado por página

Cada página tiene un solo protagonista en movimiento; lo demás son transiciones de 150 a 250 ms.

| Página | Protagonista |
|---|---|
| Portada | El objeto inflado del héroe (el hilo del álbum queda como movimiento ligado al scroll) |
| Descubre | Las etiquetas flotantes |
| Conexiones | El hilo corto de cada conexión |
| Planes | El tablero de planes cumplidos |
| Conexión nueva | El objeto inflado de esa intención |
| Ajustes | La mancha de tinta |
| Descanso | El vapor de la taza ASCII |
| 404 | La flor que se endereza |

Por esta regla se quitaron la presión en los títulos, el rastro de fotos del héroe, las fotos del héroe y el tablero "Tu álbum" de la portada (ahora vive en Planes).

## Arte ASCII

- Segunda voz gráfica: dibujos de línea "a máquina de escribir", hechos a mano, en Space Mono Bold (solo para el arte, nunca para texto de lectura).
- Solo piezas grandes y detalladas (de 7 a 16 líneas y hasta 54 columnas, con letra de 7 a 13 px); nada de glifos sueltos ni dibujos de 3 líneas.
- Datos en `datos/ascii.ts`; el componente `app-ascii` los pinta. En cada línea, `{…}` marca la única parte en el color de la intención y `«…»` el detalle suave.
- Color: trazo en el acento (violeta o naranja), detalle en lila o durazno, una parte en la intención.
- Cada `<pre>` lleva `aria-hidden` y una descripción oculta ("Ilustración: …").
- Modo `decode`: el dibujo se escribe carácter por carácter, cada uno pasa por `. : + *` y se fija en el orden del trazo. Se usa en los estados vacíos y en las esquinas de Descubre; nunca en títulos.
- Dónde: las cuatro esquinas de Descubre en pantallas anchas, a 10.5 px, que se vuelven a escribir al cambiar lo que se busca: Todo (cerezas, rosa, ramo de Arleth, maceta), Pareja (cerezas, rosa, ramo, corazón con el nombre de Arleth), Amistad (tetera, taza, pan dulce, maceta), Plan (globo, boletos "¿vamos?" con Arleth, tienda bajo las estrellas, lupa) y Pasatiempo (guitarra, paleta, dado, notas); el color de la parte destacada sigue a la intención; estados vacíos (Conexiones, búsqueda, chat sin mensajes, Planes sin resultados), Descanso (taza con vapor), 404 (flor marchita que se endereza al pasar el cursor) y tarjetas de planes sin foto (una pieza por intención).
- **Planes sin foto**: la pieza sale de las palabras del plan (correr, juegos, concierto, lectura, café, comida); si no hay coincidencia, la de su intención.
- **Modo álbum de texto** (Ajustes, se recuerda en el navegador): los fondos se vuelven jardín de texto con sus colores, los marcos un aro de `*` y `+`, y los efectos caracteres. Nunca toca las fotos.
- **Jardín de texto** (fondos de perfil): flores, cerezas y una taza acomodadas lejos del avatar. Variantes Papel y Noche (Grand), Menta y Que crece (Lucidité; las piezas se revelan de abajo hacia arriba una vez).

## Fuera de este sistema

Los estilos coleccionables del perfil (fondos, marcos, efectos y nombres en `modelos/decor.ts` y sus CSS) conservan sus propios colores: son contenido que cada persona elige, no parte de la interfaz. Lo mismo para los botones de PayPal y Google Pay, que siguen los lineamientos de cada marca.
