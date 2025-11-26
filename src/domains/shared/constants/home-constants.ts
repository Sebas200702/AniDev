import type { HomeSection } from '@shared/types/home-types'

/**
 * Secciones estáticas que SIEMPRE estarán presentes en el home
 * Estas no se generan con IA, son fijas
 */
export const STATIC_SECTIONS: HomeSection[] = [
  {
    id: 'carousel',
    type: 'carousel',
    order: 1,
    isStatic: true,
    clientDirective: 'load',
  },
  {
    id: 'special-for-you',
    type: 'slider',
    title: 'Special For You',
    url: '/recommendations?count=24',
    order: 2,
    isStatic: true,
    clientDirective: 'load',
  },
  {
    id: 'anime-top',
    type: 'top',
    order: 3,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'top-2025',
    type: 'slider',
    title: 'Top 2025',
    url: '/animes?limit_count=24&year_filter=2025&type_filter=TV&banners_filter=false',
    order: 4,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'collection-1',
    type: 'collection',
    componentId: 1,
    order: 5,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'banner-1',
    type: 'banner',
    componentId: 1,
    order: 6,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'slider-1',
    type: 'slider',
    order: 7,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'slider-2',
    type: 'slider',
    order: 8,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'banner-2',
    type: 'banner',
    componentId: 2,
    order: 9,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'slider-3',
    type: 'slider',
    order: 10,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'collection-2',
    type: 'collection',
    componentId: 2,
    order: 11,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'banner-3',
    type: 'banner',
    componentId: 3,
    order: 12,
    isStatic: true,
    clientDirective: 'visible',
  },
  {
    id: 'slider-4',
    type: 'slider',
    order: 13,
    isStatic: true,
    clientDirective: 'visible',
  },
]

/**
 * Géneros que NO se deben sugerir porque ya están hardcodeados en secciones estáticas
 * (Ahora vacío porque la IA generará las URLs para Action, Comedy, Drama)
 */
export const EXCLUDED_GENRES: string[] = []

/**
 * Configuración de cache para secciones del home
 */
export const HOME_CACHE_CONFIG = {
  TTL_SECONDS: 3600, // 1 hora
  REDIS_KEY_PREFIX: 'home:sections:',
  MAX_DYNAMIC_SECTIONS: 8, // 3 banners + 2 collections + 3 sliders (Action, Comedy, Drama)
}
