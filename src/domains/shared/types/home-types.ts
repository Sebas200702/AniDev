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
  titles?: string[] // Para collections que necesitan múltiples títulos
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
