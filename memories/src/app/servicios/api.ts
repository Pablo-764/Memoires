import { Injectable } from '@angular/core'
import type { Profile } from './app-store'

const API_BASE = 'http://localhost:3000/api'

export interface ApiSession {
  token: string
  usuario: { email?: string | null; phone?: string | null; tier: 'free' | 'grand' | 'lucidite' }
  perfil: Partial<Profile>
}

export interface BillingConfig {
  enabled: boolean
  stripe: { enabled: boolean; configured: boolean }
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

@Injectable({ providedIn: 'root' })
export class BackendApi {
  private readonly tokenKey = 'memoires-api-token'

  get token() {
    return sessionStorage.getItem(this.tokenKey)
  }

  setToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token)
  }

  clearToken() {
    sessionStorage.removeItem(this.tokenKey)
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers)
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    if (this.token) headers.set('Authorization', `Bearer ${this.token}`)
    let response: Response
    try {
      response = await fetch(`${API_BASE}${path}`, { ...options, headers })
    } catch {
      throw new ApiError('No se pudo conectar con la API local. Confirma que el backend esté corriendo en localhost:3000.', 0)
    }
    const payload = await response.json().catch(() => ({})) as { error?: string }
    if (!response.ok) throw new ApiError(payload.error || `La API respondió con error (${response.status}).`, response.status)
    return payload as T
  }

  post<T>(path: string, body: unknown, idempotencyKey?: string) {
    const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
    return this.request<T>(path, { method: 'POST', headers, body: JSON.stringify(body) })
  }
}
