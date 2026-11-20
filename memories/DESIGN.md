# Sistema de diseño de mémoires · "Constelación de intenciones"

Fuente de verdad del código: `src/styles.css` (bloque `@theme`, `:root`, `.dark` y `[data-intent]`). Si algo cambia allá, se actualiza aquí. Ningún componente usa colores sueltos: todo sale de estos tokens.

## 1. Idea

Cada persona es un punto; sus intereses son hilos que la unen con otras. La interfaz es papel neutro con un patrón *asanoha* casi invisible, y **el color lo pone la intención activa**: pareja, amistad, un plan o un pasatiempo. Al cambiar de intención cambia la tinta de toda la UI, como cambia la tirada de un impreso (mirai) o el reino en LinNeo.

Tres reglas que se revisan en cada pantalla:

1. **Dos bases y una tinta** (dis-043). Papel y tinta neutros hacen el 90 %; la tinta de la intención va en la acción principal, lo activo y los puntos del grafo. Nunca en párrafos ni fondos grandes.
2. **Un momento firma por página** (dis-023). Lo demás se mueve 150 a 250 ms o no se mueve.
3. **La seguridad se ve.** Verificación, reporte y bloqueo tienen su propio lenguaje (el sello) y están siempre a un toque.

## 2. Color

### Bases

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `paper` | `#F7F5F0` | `#16140F` | Fondo de página |
| `paper-2` | `#EFECE5` | `#211E19` | Tarjetas, campos, barra lateral |
| `paper-3` | `#E5E1D8` | `#2C2923` | Chips, rellenos, hover |
| `line` | `#D8D4CC` | `#3A3630` | Divisores y bordes de tarjeta |
| `line-strong` | `#8E877C` | `#6E675D` | Borde de controles (3:1) |
| `ink` | `#1A1814` | `#F2EEE7` | Texto principal (16.3:1 / 15.9:1) |
| `ink-2` | `#57524B` | `#B4ACA1` | Texto secundario (7.1:1 / 8.2:1) |
| `ink-3` | `#6E6860` | `#9A9288` | Metadatos; solo sobre `paper` y `paper-2` (5.1:1 / 6.0:1) |

### Tinta por intención

Sacadas de la paleta semántica de *disco* (iroFactory) y ajustadas a AA. Cada intención tiene cuatro valores:

- `tint`: el pigmento. Puntos, hilos, grafo, ilustración. No se usa para texto.
- `tint-ink`: la misma tinta como texto sobre papel (≥ 4.5:1 incluso sobre `paper-3`).
- `tint-fill` y `on-tint-fill`: botón principal y su texto.
- `wash`: lavado muy claro (o papel virado en oscuro) para la franja de la intención.

| Intención | Color de disco | `tint` claro | `tint-ink` claro | Relleno / texto | `tint` oscuro |
|---|---|---|---|---|---|
| Pareja (`romance`) | rosa | `#D04A72` | `#B03A5F` (5.3:1) | `#B03A5F` / blanco (5.8:1) | `#F2729A` (6.7:1) |
| Amistad (`friend`) | mostaza | `#E09A1E` | `#875A06` (5.5:1) | `#E09A1E` / tinta (7.4:1) | `#F0B040` (9.6:1) |
| Un plan (`plan`) | cielo | `#3A6FD0` | `#2C5BB4` (5.9:1) | `#2C5BB4` / blanco (6.4:1) | `#7FA6F5` (7.6:1) |
| Pasatiempo (`hobby`) | menta | `#2E9A62` | `#21714A` (5.5:1) | `#21714A` / blanco (6.0:1) | `#4CCB8A` (9.0:1) |
| Marca (sin intención) | índigo | `#4A50C8` | `#4A50C8` (5.9:1) | `#4A50C8` / blanco (6.4:1) | `#9096F6` (6.9:1) |

En oscuro el texto sobre relleno es el papel oscuro (6.7:1 a 9.6:1). Contrastes medidos con la fórmula de WCAG 2.1.

**Cómo se aplica.** `ThemeService` pone `data-intent` en `<html>`. Cada página declara su intención (Descubre: la pestaña elegida; Persona y Chat: la intención principal en común; el resto: la preferida del usuario). Las clases de Tailwind `bg-tint-fill`, `text-tint-ink`, `bg-wash` leen variables que cambian con ese atributo, así que un componente no sabe ni le importa qué intención hay.

Los cuatro colores fijos (`romance`, `friend`, `plan`, `hobby`) también existen sueltos para las insignias de intención, que deben verse con su color sin importar la intención activa.

### Estados y seguridad

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `danger` | `#B42424` | `#F36767` | Reportar, bloquear, borrar, errores. Siempre con ícono y texto |
| `ok` | `= hobby-ink` | `= hobby` | Confirmaciones |
| `seal` | `ink` sobre `paper-2` | igual | El sello de seguridad: neutro a propósito, para no confundirse con ninguna intención |
| `lila` | `#7A3CB8` | `#B884F0` | Solo Lucidité (plan de pago más alto) |

## 3. Tipografía

| Rol | Familia | Dónde |
|---|---|---|
| Display | **Mémoires Display**: Blackout Midnight (Tyler Finck, OFL) ampliada con Fontificar para `é ñ á í ó ú ü ¿ ¡` y Latin Extended. Renombrada porque "Blackout" es nombre reservado | Logotipo y títulos de 32 px o más, en mayúsculas. Nunca en párrafos |
| Texto | **Plus Jakarta Sans** variable (OFL), la de *disco* | Todo lo demás |

Escala (razón ~1.25, base 16): `xs 12 · sm 14 · base 16 · lg 18 · xl 22 · 2xl 28 · 3xl 36 · 4xl 48 · 5xl 64 · 6xl 88`.

- Interlineado: 1.6 en texto, 1.15 en títulos de texto y 0.9 en display.
- Ancho de lectura: 60 a 68 caracteres (`max-w-prose`).
- Números con `tabular-nums` en contadores, precios y tiempos.
- `text-wrap: balance` en títulos y `pretty` en párrafos.
- Display con `letter-spacing: .01em`; las versalitas no se fuerzan, la fuente ya es de mayúsculas.

## 4. Espacio, forma y profundidad

- Espaciado en múltiplos de 4 px (Tailwind por defecto). Huecos de sección: 48 / 64 / 96.
- Radios: `sm 12`, `md 20`, `lg 28`, `pill`. Controles en píldora; tarjetas en `md`; hojas y modales en `lg`.
- Profundidad plana, como impreso: borde de 1 px `line`. Solo lo que flota (modal, aviso, menú) lleva sombra: `0 24px 60px` de tinta al 16 %.
- Alto mínimo de lo que se toca: 44 px.

## 5. Fondo

- **Asanoha** (de iroFactory, reescrito como CSS): la hoja de cáñamo trazada en `ink` a 5 % de opacidad, fija detrás de todo.
- **Dos luces**: manchas radiales de `tint` y `brand` que derivan muy despacio; `multiply` de día y `screen` de noche a 70 %. Con movimiento reducido se quedan quietas.

## 6. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Entradas, aparecer |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Ir y volver, cambios de lugar |
| `--spring` | `linear(...)` con un rebote corto | Confirmar, el nudo de "conectar" |
| `--dur-1/2/3/4` | `150 / 250 / 400 / 600 ms` | Hover / cambio de estado / entrada / momento firma |

- `:active` de botones a `scale(.97)`; hover solo con `(hover: hover) and (pointer: fine)`.
- Navegación entre páginas con View Transitions (deslizar y desvanecer, menos de 400 ms; dis-101).
- `prefers-reduced-motion`: todo pasa a desvanecido de 150 ms o a nada; el grafo aparece ya armado.
- GSAP y Lenis solo en el navegador y solo en la landing (desplazamiento suave y el florecer del logotipo).

### Momentos firma

| Página | Momento |
|---|---|
| Landing | La palabra MÉMOIRES florece letra por letra y el acento de la `É` cae como un punto que tira hilos hacia las cuatro intenciones (dis-084) |
| Descubre | El grafo radial se arma: tú al centro, tus intereses se abren en anillo y las personas llegan por sus hilos |
| Conectar | Dos hilos se anudan sobre la tarjeta y la tarjeta vuela a Conexiones; el contador rebota (dis-071, dis-059) |
| Planes | El álbum en mosaico se acomoda como fotos que caen sobre una mesa |
| Cambio de tema | Círculo que se abre desde el botón (View Transition) |

## 7. Componentes

| Componente | Notas |
|---|---|
| Botón | `primary` (relleno de la intención), `secondary` (borde `line-strong`), `ghost`, `danger`. Píldora, 44 px, ícono opcional a la izquierda |
| Tarjeta | `paper-2`, borde `line`, radio `md`, padding 20/24 |
| Chip | Píldora de 32 px. `intent` lleva un punto del color de su intención; `selected` usa `wash` y borde `tint` |
| Campo | Etiqueta arriba, ayuda abajo, error con ícono. Borde `line-strong`, foco con anillo de 2 px `tint` |
| Modal / hoja | Hoja inferior en móvil, centrado en escritorio. Radio `lg`, sombra, foco atrapado, Esc cierra |
| Navegación | Escritorio: riel izquierdo de 248 px (logotipo, 4 secciones, tu plan, tema y tú). Móvil: barra superior con logotipo y barra de pestañas inferior de 4 secciones |
| Sello | Escudo con borde dentado (como timbre). Variantes: verificado, reportar, bloquear. Siempre visible en la tarjeta de una persona |
| Insignia de intención | Punto + nombre, color fijo de su intención |
| Avatar | Inicial sobre `paper-3` o foto; aro opcional (decoración) |
| Aviso (toast) | Abajo al centro, con ícono por tono, 3.2 s |

## 8. Pantallas (wireframes en `docs/evolucion/wireframes.png`)

- **Landing**: héroe con el logotipo grande y una sola frase; las cuatro intenciones como cuatro columnas de tinta plana (retícula editorial de mirai); seguridad; planes de precio; pie.
- **Descubre**: pestañas de intención arriba; en escritorio, grafo radial a la izquierda y la tarjeta de la persona elegida a la derecha; en móvil, la tarjeta primero y el grafo como alternativa ("Ver como constelación"). Siempre hay una lista equivalente para teclado y lector de pantalla.
- **Perfil**: tarjeta compacta que se expande (dis-034) a la vista completa; QR del perfil para compartir.
- **Chat**: cabecera con la persona, el sello y "reportar / bloquear" a un toque; mensajes; caja que crece.
- **Planes**: filtros encadenados (zona, luego colonia) y buscador; mosaico de planes cumplidos.

## 9. Créditos

En `THIRD_PARTY_NOTICES.md`: iroFactory y Fontificar (MIT, RemLam), Blackout (OFL, Tyler Finck), Plus Jakarta Sans (OFL). LinNeo (AGPL) solo aportó ideas; no hay código suyo en este proyecto.
