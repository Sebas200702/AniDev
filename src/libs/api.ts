import { baseUrl } from '@shared/utils/base-url'

export interface ApiResponse<T> {
  data: T | null
  status: number
  error?: string
  meta?: Record<string, any>
}

class Api {
  readonly baseUrl: string
  readonly defaultHeaders: HeadersInit

  constructor(baseUrl = '', defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  private async request<T>(
    method: string,
    url: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: this.defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      })

      const status = res.status
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          data: null,
          status,
          error: json.error || json.message || res.statusText,
        }
      }

      if (
        json &&
        typeof json === 'object' &&
        'data' in json &&
        ('total_items' in json || 'current_page' in json || 'last_page' in json)
      ) {
        const { data, ...meta } = json
        return { data, meta, status }
      }

      const payload = 'data' in json ? json.data : json
      return { data: payload, status }
    } catch (err: any) {
      return { data: null, status: 0, error: err || 'Network error' }
    }
  }

  get<T>(url: string, options?: RequestInit) {
    return this.request<T>('GET', url, undefined, options)
  }

  post<T>(url: string, body?: any, options?: RequestInit) {
    return this.request<T>('POST', url, body, options)
  }

  put<T>(url: string, body?: any, options?: RequestInit) {
    return this.request<T>('PUT', url, body, options)
  }

  delete<T>(url: string, options?: RequestInit) {
    return this.request<T>('DELETE', url, undefined, options)
  }
}

export const api = new Api(`${baseUrl}/api`)
