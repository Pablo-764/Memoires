import { fail } from "../middleware/errors.js";
export function paypalGateway(settings, request = fetch) {
  const base =
    settings.environment === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  let token = "",
    expires = 0;
  const enabled = () => !!settings.clientId && !!settings.secret;
  async function access() {
    if (!enabled())
      throw fail(503, "PayPal no está configurado en el backend.");
    if (expires > Date.now()) return token;
    let response;
    try {
      response = await request(`${base}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${settings.clientId}:${settings.secret}`).toString(
              "base64",
            ),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw fail(502, "No hubo conexión con PayPal.");
    }
    if (!response.ok)
      throw fail(502, "PayPal rechazó las credenciales de la aplicación.");
    const data = await response.json();
    if (!data.access_token) throw fail(502, "PayPal no devolvió un token.");
    token = data.access_token;
    expires = Date.now() + Math.max(0, data.expires_in - 60) * 1000;
    return token;
  }
  async function call(path, method = "GET", body, key) {
    const bearer = await access();
    let response;
    try {
      response = await request(base + path, {
        method,
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          ...(key ? { "PayPal-Request-Id": key } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(20000),
      });
    } catch {
      throw fail(
        502,
        "PayPal no respondió; revisa la orden antes de reintentar.",
      );
    }
    if (!response.ok) {
      if (response.status === 401) expires = 0;
      throw fail(502, "PayPal no pudo completar la operación.");
    }
    return response.json();
  }
  return {
    enabled,
    publicConfig: () => ({
      enabled: enabled(),
      clientId: settings.clientId,
      environment: settings.environment,
      currency: settings.currency,
    }),
    create: (tier, amount, key) =>
      call(
        "/v2/checkout/orders",
        "POST",
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              custom_id: key,
              description: `mémoires ${tier} mensual`,
              amount: {
                currency_code: settings.currency,
                value: amount.toFixed(2),
              },
            },
          ],
          application_context: {
            brand_name: "mémoires",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${settings.frontendOrigin}/app/suscripcion`,
            cancel_url: `${settings.frontendOrigin}/app/suscripcion?paypal_cancel=1`,
          },
        },
        key,
      ),
    get: (id) => call(`/v2/checkout/orders/${encodeURIComponent(id)}`),
    capture: (id, key) =>
      call(
        `/v2/checkout/orders/${encodeURIComponent(id)}/capture`,
        "POST",
        {},
        key,
      ),
  };
}
