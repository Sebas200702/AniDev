import { supabase } from '@libs/supabase'

export const CharacterRepository = {
  async getCharacterDetails(characterId: number) {
    const { data, error } = await supabase.rpc(
      'get_character_details_with_animes',
      {
        input_character_id: characterId,
      }
    )

    if (error) {
      throw new Error(`Failed to fetch character details: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Character not found')
    }

    return data[0]
  },

  async getCharactersList(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_characters_list', filters)

    if (error) {
      throw new Error(`Failed to fetch characters list: ${error.message}`)
    }

    return data ?? []
  },

  async getCharactersCount(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_characters_count', filters)

    if (error) {
      throw new Error(`Failed to fetch characters count: ${error.message}`)
    }

    return data ?? 0
  },

  async getMetadata(characterId: number) {
    const character = await this.getCharacterDetails(characterId)

    if (!character?.character) {
      throw new Error('Character data not found')
    }

    const char = character.character
    const about = char.character_about
      ? ` ${char.character_about.slice(0, 150)}...`
      : ''

    const kanjiPart = char.character_name_kanji
      ? ` (${char.character_name_kanji})`
      : ''

    return {
      name: char.character_name,
      nameKanji: char.character_name_kanji,
      description: `Learn about ${char.character_name}${kanjiPart}.${about}`,
      image: char.character_image_url,
      about: char.character_about,
    }
  },

  async getCharacterImages(animeId: number, limitCount: number = 10) {
    const { data, error } = await supabase.rpc('get_character_images', {
      p_anime_id: animeId,
      p_limit_count: limitCount,
    })

    if (error) {
      throw new Error(`Failed to fetch character images: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Data not found')
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
      throw new Error(`Failed to fetch characters for sitemap: ${error.message}`)
    }

    return data ?? []
  },
}
