# mémoires: frontend

Aplicación web para conectar personas según su intención declarada (pareja, amistad, un plan o un pasatiempo) y sus intereses, con la seguridad como prioridad. Proyecto integrador de Programación Web 2.

## Cómo ejecutarlo

```bash
npm install
npm start          # desarrollo en http://localhost:4200
npm run build      # versión de producción en dist/
```

Para entrar a la demostración usa cualquier correo y una contraseña de 8 caracteres. El panel de moderación está en `/admin`.

## Stack

Angular 22 (componentes standalone, signals, zoneless y rutas con carga diferida), TypeScript 6 y Tailwind CSS 4 conectado con `@tailwindcss/postcss`.

## Estructura

Sigue la organización del repositorio del equipo: cada componente y cada página vive en su carpeta con su `.ts`, `.html`, `.css` y `.spec.ts`.

| Carpeta | Contenido |
| --- | --- |
| `src/app/componentes` | Piezas reutilizables: `navbar`, `sidebar`, `tab-bar`, `footer`, `app-shell`, `modal`, `avatar`, `swipe-card`, diálogos y controles |
| `src/app/pages` | Una carpeta por pantalla: `landing`, `login`, `register`, `onboarding`, `discover`, `connections`, `chat`, `person`, `plans`, `profile`, `subscription`, `settings`, `admin`, `privacy`, `rest` |
| `src/app/servicios` | Estado con signals (`app-store`), tema (`theme`) y animaciones de celebración (`celebrate`) |
| `src/app/guards` | Guard de sesión (`auth-guard`) |
| `src/app/directivas` | `pill-group` (barras con figura) y `reveal` (aparición al desplazar) |
| `src/app/modelos` | Intenciones, planes, formatos de plan, navegación y catálogo de estilos de perfil |
| `src/app/utilidades` | Árbol de decisión (`matching`), búsqueda de texto, imágenes y transiciones de lista |
| `src/app/datos` | Datos de demostración |

Los estilos globales (colores, tipografía, botones y animaciones compartidas) están en `src/styles.css`; lo propio de cada componente está en su `.css`.

## Pruebas

```bash
npm test -- --watch=false
```

## Pantallas

| Ruta | Qué hace |
| --- | --- |
| `/` | Inicio con selector de intención, cómo funciona, seguridad y planes |
| `/registro`, `/entrar` | Registro (valida mayoría de edad y consentimiento) e inicio de sesión |
| `/bienvenida` | Configuración inicial en 3 pasos: intención, intereses y perfil |
| `/app/descubre` | Sugerencias con explicación, tarjeta deslizable, filtros por plan y límite semanal |
| `/app/conexiones`, `/app/chat/:id` | Conexiones por interés mutuo y chat con contador de palabras |
| `/app/planes` | Crear planes y unirse a los de otras personas |
| `/app/perfil` | Edición del perfil y decoraciones según el plan |
| `/app/suscripcion` | Planes Gratuito, Grand y Lucidité; pago simulado con PayPal o Google Pay |
| `/app/ajustes` | Apariencia, aviso de bienestar, privacidad, cerrar sesión y eliminar cuenta |
| `/admin` | Moderación de reportes: descartar, advertir o suspender |

## Lo que es simulado

Este frontend aún no se conecta al backend. Los datos viven en `src/app/data/mock.ts` y el estado se guarda en `localStorage`. El pago es una simulación: no se piden ni se guardan datos de tarjeta. Las respuestas del chat son automáticas.

Para conectarlo al backend, reemplaza las acciones de `src/app/core/app-store.service.ts` por llamadas a la API REST y a Socket.IO.

## Fotos

Fotos de [Unsplash](https://unsplash.com), en `public/fotos/`:

- `cafe.webp`: tommao wang
- `correr.webp`: Nathan Nuyda
- `juegos.webp`: 2H Media
- `concierto.webp`: Yvette de Wit
- `biblioteca.webp`: Jim Petkiewicz

No se usan fotos de personas reales como perfiles de usuario: los perfiles de la demostración muestran solo la inicial del nombre.
