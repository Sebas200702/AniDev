import type { AnimeSummary } from '@anime/types'
import type { Seiyuu } from '@seiyuu/types'

export interface CharacterDetails {
  character_id: number
  character_name: string
  character_name_kanji: string | null
  character_nicknames: string[] | null
  character_about: string | null
  character_image_url: string | null
  character_small_image_url: string | null
  character_url: string | null
  animes: AnimeSummary[]
  voice_actors: Seiyuu[]
}

export interface Character {
  mal_id: number
  character_id: number
  character_name: string
  character_name_kanji: string
  character_nicknames: string[]
  character_about: string
  character_image_url: string
  character_small_image_url: string
  character_url: string
  role: string
  voice_actor_id: number
  voice_actor_name: string
  voice_actor_alternative_names: string[]
  voice_actor_family_name: string
  voice_actor_given_name: string
  voice_actor_birthday: string
  voice_actor_about: string
  voice_actor_image_url: string
  voice_actor_language: string
}

export interface CharacterImages {
  character_id: number
  character_name: string
  character_image_url: string
  character_small_image_url: string
  anime_title: string
}

export enum CharacterFilters {
  limit_count = 'limit_count',
  role_filter = 'role_filter',
  search_query = 'search_query',
  order_by = 'order_by',
  page_number = 'page_number',
  language_filter = 'language_filter',
}
