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
}
