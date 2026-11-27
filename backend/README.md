# mémoires API

API REST modular para autenticación, perfiles, descubrimiento, conexiones, chat, planes, reportes, moderación y pagos. Requiere Node.js 24.13 o posterior y usa SQLite persistente por defecto.

La estructura sigue la del ERP: `config/` integra entorno y PayPal; `database/` contiene el esquema y las migraciones; `middleware/` valida entradas y sesiones; `models/` gestiona las consultas de cuentas; `controllers/` adapta HTTP; `services/` aplica reglas del producto; `router/` declara endpoints; `scripts/` prepara la base y la cuenta de moderación.

## Arranque

1. Copia `.env.example` a `.env` y configura `JWT_SECRET` con un secreto aleatorio de al menos 32 caracteres.
2. Ejecuta `npm install` y luego `npm run setup`.
3. Ejecuta `npm run dev`; la API queda en `http://localhost:3000/api`.
4. `GET /api/health` confirma que el servidor responde.

Para crear un moderador inicial, configura `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` (12 caracteres o más) antes de `npm run setup`. El registro público nunca permite elegir rol.

## Rutas principales

- `POST /auth/register` `{ email | phone, password, profile }`; `POST /auth/login` `{ email | phone | contact, password }`.
- `GET /auth/me`, `POST /auth/logout`, `PATCH /profile`, `PATCH /settings`, `DELETE /account`.
- `GET /discover`, `GET /likes/received` (Grand/Lucidité), `GET /users/:id`, `POST /discover/:id/decision` `{ decision: 'like' | 'pass', golden?, about?, comment? }`.
- `GET /connections`, `DELETE /connections/:id`, `GET|POST|DELETE /connections/:id/messages`; proposed chat plans can be accepted or moved with `PATCH /connections/:id/messages/:messageId/plan`.
- `POST /users/:id/block`, `POST /users/:id/reports`.
- `GET|POST /plans`, `POST /plans/:id/join`. New plan dates must be future ISO 8601 timestamps.
- Moderación: `GET /admin/reports`, `PATCH /admin/reports/:id` `{ status: 'descartado' | 'advertido' | 'suspendido' }`.
- Pagos: `GET /billing/config`, `GET /billing/current`, PayPal Orders y captura; Stripe Billing con `POST /billing/stripe/checkout`, verificación con `GET /billing/stripe/checkout/:id` y gestión con `POST /billing/stripe/portal`. Webhook público: `POST /billing/stripe/webhook`.

Las rutas privadas esperan `Authorization: Bearer <token>`. La verificación de identidad/selfie del frontend sigue siendo simulada. `POST /verification/demo` solo existe fuera de producción; en producción debe conectarse un proveedor real de verificación antes de permitir likes, chat o alta de planes.

## PayPal

La API recibe las credenciales del servidor desde `PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`; nunca pongas el secreto en Angular. Usa una app REST de Sandbox y `PAYPAL_ENV=sandbox` para probar. Cada pago completado concede 30 días de Grand o Lucidité; es una compra manual, sin renovación automática.

## Stripe Billing, Checkout y Google Pay

Configura la clave de prueba en `STRIPE_SECRET_KEY` y ejecuta `npm run setup:stripe` para crear o reutilizar los productos y precios mensuales Grand (MXN 92.50) y Lucidité (MXN 185.00). El script guarda los Price IDs en el `.env` ignorado por Git. Checkout usa Billing en modo suscripción; Stripe genera las facturas recurrentes y el Customer Portal permite cambiar el método de pago y cancelar.

Crea un webhook para `POST /api/billing/stripe/webhook` y activa `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` y `invoice.payment_failed`. Guarda el secreto de firma en `STRIPE_WEBHOOK_SECRET`. Checkout deja que Stripe elija métodos de pago elegibles, incluido Google Pay cuando esté disponible para la cuenta, el navegador y el dispositivo.

Stripe Tax queda apagado. No pongas `STRIPE_AUTOMATIC_TAX=true` hasta tener una inscripción fiscal activa en la jurisdicción de cobro y haber confirmado el producto/código fiscal correspondiente; el backend rechaza activar el flag sin `STRIPE_TAX_REGISTRATION_CONFIRMED=true`. Las inscripciones de impuestos no se crean automáticamente.

Antes de producción, configura claves Live, precios Live y un webhook público Live; los Price IDs de prueba no funcionan en Live. El registro y login de Angular usan esta API y la pantalla de suscripción la consulta para activar el plan tras el pago.

En desarrollo, Angular espera la API en `http://localhost:3000/api`.

Las funciones sociales de `memories/` aún usan datos de demostración local; el registro/login y la suscripción usan esta API.
