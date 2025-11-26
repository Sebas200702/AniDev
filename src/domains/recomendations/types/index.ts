import type { RecommendationContext } from '@ai/types'
import { SchemaType, type Tool } from '@google/generative-ai'
import type {SearchHistory} from "@search/types"

export const functionTool: Tool = {
  functionDeclarations: [
    {
      name: 'fetch_recommendations',
      description:
        'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          mal_ids: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.STRING,
            },
            description:
              'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
          },
        },
        required: ['mal_ids'],
      },
    },
  ],
}

export interface JikanRecommendations {
  mal_ids: number[]
  titles: string[]
  error?: string
}

export interface FetchRecommendationProps {
  mal_ids: string[]
  minResults: number
  currentAnimeId?: number
  jikanRecommendations?: JikanRecommendations | null
  parentalControl: boolean
}

export interface GenerateRecommendationsProps {
  context: RecommendationContext
  prompt: string
  jikanRecommendations: JikanRecommendations
}

export interface UserProfileToRecomendations {
    name: string
    last_name: string
    gender: string
    birthday: string
    favorite_animes: string[]
    favorite_genres: string[]
    favorite_studios: string[]
    preferred_format: string
    frequency_of_watch: string
    fanatic_level: string
    search_history: SearchHistory[]
    watched_animes: string[]
}
