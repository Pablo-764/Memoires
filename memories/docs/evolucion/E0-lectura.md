# E0 · Lectura de fuentes

Rama `diseno-evolucion`. Punto de partida: `main` en `5824fa4`, 49 archivos de prueba y 53 pruebas en verde. Capturas de "antes" de las 16 rutas a 390 y 1440 px, fuera del repositorio (`Memoires/capturas/E0-antes`); en E9 se suben las comparaciones.

## iroFactory (MIT, RemLam)

- **disco.** Base del sistema: papel `#FAFAF8` / tinta `#1A1814` de día y `#1C1A18` / `#F0EDE8` de noche. Paleta semántica tomate, índigo, menta, mostaza, lila, durazno, cielo y rosa, cada una con su "tinta de texto" (`--x-ink`) del mismo matiz y más oscura para pasar 4.5:1. Radios 12/20/28, botones en píldora de 44 px de alto, `:active` a `scale(.97)` y hover solo con puntero fino.
- **asanoha.** Patrón de hoja de cáñamo generado por trigonometría como SVG de fondo, a 15 % de opacidad. Se reescribe en Angular como fondo CSS (no se copia el JS).
- **luces ambientales.** Manchas radiales que rebotan; `multiply` de día y `screen` de noche, bajadas a .72 de noche para no romper el contraste.
- **mirai.** "Tiradas": la página se imprime con una tinta clave y las demás visten las secciones con `data-role`. Tres curvas de movimiento (`--ease-out`, `--ease-in-out`, `--spring` con `linear()`). Tintas planas sin degradado.
- **tarot.** Vitrinas con marco doble (`outline-offset`) y esquinas; biomas que llegan como `--b1..b3`. Sirve para "Tu historia" (diario): el marco doble como hoja de álbum.

## LinNeo (AGPL; solo ideas, nada de código)

- **UI teñida por contexto.** El reino activo se refleja en un atributo del `body` y cambia un "lavado" de día y el papel de noche. Aquí: `data-intent` en `<html>` con `--wash` y `--tint` por intención.
- **Grafo como lámina impresa.** Centro y primer nivel como palabras con un punto de pigmento; el segundo nivel como puntos que se rotulan al acercar. Aquí: tú al centro, tus intereses en anillo y las personas afuera.
- **Mosaico empacado** con azar con semilla, para que el acomodo no cambie al recargar.
- **Buscador combobox** con resaltado de la coincidencia y una nota de por qué salió cada resultado.

## Fontificar (MIT, RemLam)

Agrega `é ñ á í ó ú ü ¿ ¡` y Latin Extended armando cada caracter con los glifos de la fuente. Elegida: **Blackout Midnight** (Tyler Finck, The League of Moveable Type, SIL OFL 1.1) porque no trae ningún acento. Tiene *Reserved Font Name* "Blackout", así que la derivada se publica con otro nombre de familia.

## Baraja Gambit

dis-019 (tokens primero), dis-064 (wireframes grises), dis-090 (jerarquía), dis-043 (dos bases y un acento), dis-023 (un momento por página), dis-027 (cuadrícula o lista), dis-034 (tarjeta que se expande), dis-071 y dis-059 (vuelo y nudo al conectar), dis-101 (transición entre páginas, menos de 1 s), dis-025 (carga con identidad), dis-084 (tipografía que florece) y dis-094/dis-081 (QR ilustrado que sigue siendo escaneable).
