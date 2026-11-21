# Pendientes del rediseño (lista única)

Rama `diseno-evolucion` · PR https://github.com/Pablo-764/Memories/pull/2
Si el trabajo se interrumpe, se retoma desde el primer `[ ]` de esta lista.

## E9 (lo que faltó del corte)

- [ ] `impeccable` critique y polish (se hace sobre el diseño FORMA, en F7)
- [ ] Revisión final de `design-taste-frontend` (se hace sobre el diseño FORMA, en F7)
- [ ] Lighthouse de rendimiento en 95 o más en todas las rutas
- [x] Capturas de antes y después: absorbido por F8 (las de E9 quedan en `antes-despues/E9/`)
- [x] Descripción del PR: absorbido por F8 (PR #2)

## Fase F (`PLAN_EVOLUCION_FORMA.md`)

### F0
- [x] Wireframes antes contra nuevo (`F0-comparacion.png`) y aviso a Arthemis

### F1: estructura global y componentes
- [x] Sin barra lateral: `sidebar` borrado
- [x] Barra de mando flotante: monograma, 4 destinos con indicador deslizante, Ctrl+K, avisos, avatar con menú (plan, tema, ajustes, privacidad, salir); se oculta al bajar
- [x] Dock en celular con "Conectar" elevado que toma la acción principal de cada página
- [x] Paleta de comandos (personas, intereses, conversaciones, ajustes, cambiar tema)
- [x] Páginas sin cajas y retícula editorial de 12 columnas
- [x] Botón primario de 48 px que se hunde y desliza su ícono; secundario como texto con subrayado animado
- [x] Chips sin caja en mono con punto
- [x] Tarjetas sin borde con filo superior de la intención
- [x] Campos con etiqueta flotante y línea que crece
- [x] Hojas laterales (escritorio) e inferiores (celular) con arrastre para cerrar
- [x] Confirmación en el lugar de la acción; avisos sueltos solo para errores
- [x] Pestañas como segmentado con indicador deslizante
- [x] Avatar con anillo de intención y sello de verificación
- [x] Estados vacíos con la constelación y una acción
- [x] Limpieza: `sidebar`, `ascii-art`, `inflado`, `polaroid-board`, `navbar`, `tab-bar`, `theme-segmented`, `thread` y `discover-graph`

### F2: portada
- [x] Héroe a pantalla completa como constelación viva (cursor con inercia, nebulosas por número real de personas)
- [x] Registro que empieza arrastrando un hilo, con 4 botones accesibles equivalentes
- [x] "Cómo funciona" en 3 capítulos con escena fija
- [x] Bloque de seguridad con sello
- [x] Pie con QR

### F3: Descubre
- [x] Mapa de afinidad a pantalla completa (distancia por afinidad, tamaño por intención)
- [x] Hilos de intereses al pasar el cursor o enfocar
- [x] Ficha flotante (hoja inferior en celular) con por qué, plan ideal y sello
- [x] Gestos: "Me interesa" anuda y orbita; "Ahora no" aleja; atajos → y ←
- [x] Dial de intenciones y "Afinar" como hoja
- [x] Modo "Mazo" en abanico de 3 tarjetas

### F4: Conexiones y chat
- [x] Tablero por etapas (columnas en escritorio, pestañas en celular), automático y arrastrable
- [x] Cintas con avatar, intereses, último mensaje, próximo plan y medidor de hilo
- [x] Cuadrícula o lista y buscador
- [x] Estado vacío ilustrado
- [x] Chat: encabezado con intereses y seguridad, ideas de plan, "Proponer plan" estructurado, escritura como hilo, burbujas con la intención

### F5: Perfil
- [x] Pantalla dividida con vista previa en vivo y pasos
- [x] Anillo de perfil completo que dice qué falta
- [x] Preguntas como tarjetas en carrusel
- [x] Campos de etiquetas con búsqueda
- [x] Momentos tipo polaroid con arrastre y carga diseñada
- [x] Una tarjeta por intención con sus preferencias
- [x] QR en "Compartir"

### F6: resto de pantallas
- [x] Planes: franja de calendario y mosaico
- [x] Suscripción: escala visual con el recomendado elevado y tabla aparte
- [x] Ajustes y privacidad en bloques con el efecto de cada opción
- [x] Moderación como cola de trabajo con prioridad y acciones rápidas
- [x] Descanso y 404 con ilustración propia

### F7
- [x] Movimiento de los gestos y movimiento reducido
- [x] axe en 0 (16 rutas, claro y oscuro, 390 y 1440)
- [x] Pruebas existentes en verde y lint
- [ ] `impeccable` critique y polish (ver E9)
- [ ] `design-taste-frontend` (ver E9)
- [ ] Lighthouse 95 o más en todas las rutas (ver E9)

### F8
- [ ] Capturas de las 16 pantallas, antes y después, en `docs/evolucion/antes-despues/`
- [x] DESIGN.md de la fase FORMA
- [x] Descripción del PR para el equipo

## Funciones y plan de pago (`PLAN_FUNCIONES_Y_PLANES.md`)

### P1
- [x] Registro de 13 pasos (una pregunta por pantalla, hilo de progreso, constelación de fondo, borrador que se conserva)
- [x] Prompts por intención (3 en el registro)
- [x] "Me interesa" a un prompt concreto con comentario que llega como primer mensaje
- [ ] "Me interesa" a una foto concreta
- [x] Tu hilo del día (gratis, con la razón)
- [x] Hilo dorado (1 gratis por semana, comentario obligatorio, no obliga a responder)
- [x] Filtros innegociables (sin marcar solo ordenan)
- [x] Chat: imágenes difuminadas
- [x] Chat: "¿Seguro que quieres enviar esto?"
- [x] Primeros pasos de un toque
- [x] Plan de pago rehecho sin "matches" como beneficio
- [x] "Qué compras y qué no" antes de pagar
- [x] Garantías medibles y cancelación en 2 toques
- [x] `/terminos-suscripcion`
- [ ] Marca "Impulsado" y tope de 1 de cada 10 sugerencias
- [ ] Guía de perfil con la frase de visibilidad gratuita

### 4b: verificación obligatoria y perfil completo
- [x] Sin verificar: no "me interesa", hilo dorado, comentario, chat ni unirse a planes
- [x] "Verifícate para conectar" en la ficha de Descubre, la persona, el chat y los planes
- [x] Selfie con pose aleatoria simulada, sello azul y confirmación
- [ ] Texto "Nadie habla con perfiles falsos" en la verificación y en las reglas de la casa
- [ ] Aviso fijo y discreto en la barra de mando (y el dock) hasta verificar
- [ ] Identificación oficial opcional con sello dorado
- [ ] `matching` excluye a los no verificados de las sugerencias de otros
- [x] Registro: la selfie se puede saltar y el resumen dice que sin verificar no se conecta
- [x] Puntaje 0 a 100 con los pesos de la tabla
- [x] Anillo con lo que falta y cuánto sube ("+10 %")
- [ ] Peso de completitud en el orden de sugerencias (0.6 / 1 / 1.25), igual para quien paga
- [ ] Solo perfiles con 80 % o más entran a "Tu hilo del día" de otros
- [x] Frase de visibilidad gratuita en "Qué compras y qué no"

### Pruebas pedidas
- [x] Registro completo con test y sin test
- [x] Menor de 18 rechazado
- [x] Ningún texto ofrece "matches" como beneficio de pago
- [x] "Qué compras y qué no" visible antes de pagar
- [x] Cancelación en 2 pasos
- [x] Sin verificar no puede dar "me interesa", chatear ni unirse a planes; tras verificar, sí
- [ ] Un no verificado no aparece en sugerencias de otros
- [ ] Bordes del puntaje: 49, 50, 79 y 80 %
- [ ] El orden de sugerencias aplica los pesos
- [ ] Quien paga no recibe el peso de completitud sin completar su perfil

### P2 (si hay tiempo)
- [ ] Planes con fecha, lugar seguro y cupo; recordatorio
- [ ] Círculos por interés con planes abiertos
- [ ] "¿Se cumplió el plan?" con calificación privada
- [ ] "Comparte tu plan" y registro de llegada
- [ ] Hilos que se aflojan a las 72 h y se archivan a los 7 días
- [x] Test de personalidad (en el registro y en el perfil)

### P3 (si hay tiempo)
- [ ] Prompts de audio de 30 s
- [ ] Videollamada de seguridad
- [ ] Modo viaje "Voy a…"
- [ ] Modo incógnito
- [ ] Impulso con garantía medida
- [ ] Resumen semanal

## README y avisos
- [x] "Herramientas y créditos" con RemiH06
- [ ] Revisar que siga correcto tras los cambios (sin GSAP ni Lenis; íconos y fuentes)
