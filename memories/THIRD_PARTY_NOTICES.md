# Avisos de terceros

mémoires usa o se inspira en el trabajo de otras personas. Este archivo dice qué se tomó, de dónde y con qué licencia.

## Código y técnicas

| Proyecto | Autor | Licencia | Qué se tomó |
|---|---|---|---|
| [iroFactory](https://github.com/RemiH06/iroFactory) | RemLam (@RemiH06) | MIT | De *disco*: la paleta semántica (tomate, índigo, menta, mostaza, lila, durazno, cielo, rosa) con sus tintas de texto AA, radios y botones en píldora. El patrón *asanoha* (hoja de cáñamo trazada por trigonometría) y las luces ambientales, reescritos en CSS y Angular. De *mirai*: las curvas de movimiento y la idea de "tirada" (una tinta clave que cambia la página). De *tarot*: el marco doble. |
| [Fontificar](https://github.com/RemiH06/Fontificar) | RemLam (@RemiH06) | MIT | La herramienta que agregó los acentos, la eñe, `¿ ¡` y Latin Extended a la fuente display. Solo se usó la salida; el código no está en este repositorio. |
| [LinNeo](https://github.com/RemiH06/LinNeo) | RemLam (@RemiH06) | AGPL-3.0 | **Solo ideas, ningún código**: la UI teñida según el contexto activo, el grafo radial como lámina impresa, el mosaico empacado con azar con semilla, el buscador con sugerencias y los filtros encadenados. Todo se implementó desde cero para no heredar la AGPL. |

## Fuentes

| Fuente | Autor | Licencia | Uso |
|---|---|---|---|
| Mémoires Display | Derivada de **Blackout Midnight** de Tyler Finck ([The League of Moveable Type](https://www.theleagueofmoveabletype.com/blackout)) | SIL OFL 1.1, con *Reserved Font Name* "Blackout"; por eso la versión modificada lleva otro nombre. Licencia en `public/fonts/MemoiresDisplay-OFL.txt` | Logotipo y títulos grandes. Cambios: acentos, eñe, `¿ ¡` y Latin Extended armados con Fontificar; el acento agudo se redibujó a mano |
| Plus Jakarta Sans | Tokotype | SIL OFL 1.1 (vía Fontsource) | Todo el texto |

## Bibliotecas

| Biblioteca | Licencia |
|---|---|
| Angular (core, router, forms, build, CLI) | MIT |
| Tailwind CSS 4 y `@tailwindcss/postcss` | MIT |
| RxJS | Apache-2.0 |
| tslib | 0BSD |
| Fontsource (paquete de Plus Jakarta Sans) | MIT |
| Vitest y jsdom (pruebas) | MIT |
| ESLint, angular-eslint y typescript-eslint | MIT |
| Prettier | MIT |

## Skills de diseño

Se usaron como guía durante el rediseño (no se incluye su código): impeccable, design-taste-frontend, better-typography, emil-design-eng, gsap-scrolltrigger, refactoring-ui y web-design-guidelines.

## Ideas de la baraja Gambit

Cartas de diseño de André (proyecto personal): dis-019, dis-023, dis-025, dis-027, dis-034, dis-043, dis-059, dis-064, dis-071, dis-081, dis-084, dis-090, dis-094 y dis-101. Las herramientas externas que mencionan algunas cartas (type-garden, bubbbly) no se usaron; sus ideas se implementaron con código propio.
