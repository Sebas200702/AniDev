export type HomeSectionType =
  | 'carousel'
  | 'slider'
  | 'top'
  | 'collection'
  | 'banner'

export interface HomeSection {
  id: string
  type: HomeSectionType
  title?: string
  url?: string
  urls?: string[] // Para collections que necesitan múltiples URLs (hasta 4)
  order: number
  isStatic: boolean
  aiGenerated?: boolean
  componentId?: number // Para banners y collections
  clientDirective: 'load' | 'visible'
  metadata?: {
    genre?: string
    year?: number
    type?: string
    studio?: string
    reason?: string // Por qué la IA sugirió esta sección
  }
}

export interface HomeSectionsCache {
  sections: HomeSection[]
  userId: string | null
  generatedAt: string
  expiresAt: string
}

export interface AISuggestion {
  type: 'collection' | 'banner' | 'slider'
  value: string
  values?: string[]
  title: string
}

export interface AIResponse {
  sections: AISuggestion[]
}

export interface ProcessedSuggestion {
  url: string
  urls?: string[]
  title: string
}
