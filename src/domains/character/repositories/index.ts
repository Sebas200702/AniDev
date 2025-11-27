import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'
import type { CharacterDetails, Character } from '@character/types'

export const CharacterRepository = {
  async getCharacterDetails(characterId: number) {
    const { data, error } = await supabase.rpc(
      'get_character_details_with_animes',
      {
        input_character_id: characterId,
      }
    ).single()

    if (error) {
      throw AppError.database('Failed to fetch character details', {
        characterId,
        ...error,
      })
    }

    if (!data) {
      throw AppError.notFound('Character not found', { characterId })
    }

    return data as CharacterDetails
  },

  async getCharactersList(filters: Record<string, any>): Promise<Character[]> {
    const { data, error } = await supabase.rpc('get_characters_list', filters)

    if (error) {
      throw AppError.database('Failed to fetch characters list', {
        filters,
        ...error,
      })
    }
    if (!data || data.length === 0) {
      throw AppError.notFound('Characters not found', { filters })
    }

    return data
  },

  async getCharactersCount(filters: Record<string, any>) : Promise<number> {
    const { data, error } = await supabase.rpc('get_characters_count', filters)

    if (error) {
      throw AppError.database('Failed to fetch characters count', {
        filters,
        ...error,
      })
    }


    return data ?? 0
  },

  async getMetadata(characterId: number) {
    const character = await this.getCharacterDetails(characterId)

    if (!character) {
      throw AppError.notFound('Character data not found', { characterId })
    }


    const about = character.character_about
      ? ` ${character.character_about.slice(0, 150)}...`
      : ''

    const kanjiPart = character.character_name_kanji
      ? ` (${character.character_name_kanji})`
      : ''

    return {
      name: character.character_name,
      nameKanji: character.character_name_kanji,
      description: `Learn about ${character.character_name}${kanjiPart}.${about}`,
      image: character.character_image_url,
      about: character.character_about,
    }
  },

  async getCharacterImages(animeId: number, limitCount: number = 10) {
    const { data, error } = await supabase.rpc('get_character_images', {
      p_anime_id: animeId,
      p_limit_count: limitCount,
    })

    if (error) {
      throw AppError.database('Failed to fetch character images', {
        animeId,
        limitCount,
        ...error,
      })
    }

    if (!data || data.length === 0) {
      throw AppError.notFound('Character images not found', {
        animeId,
      })
    }

    return data
  },

  async getCharactersForSitemap(limit: number = 1000) {
    const { data, error } = await supabase
      .from('character')
      .select('slug, updated_at')
      .order('favorites', { ascending: false })
      .limit(limit)

    if (error) {
      throw AppError.database('Failed to fetch characters for sitemap', {
        ...error,
      })
    }

    return data ?? []
  },

  async getAnimeCharacters(animeId: string, language: string) {
    const { data, error } = await supabase.rpc('get_anime_characters', {
      input_anime_id: animeId,
      language_filter: language,
    })

    if (error || !data) {
      if (error) {
        throw AppError.database('Error fetching anime characters', {
          animeId,
          language,
          ...error,
        })
      }

      throw AppError.notFound('Anime characters not found', {
        animeId,
        language,
      })
    }

    return data as Character[]
  },
}
