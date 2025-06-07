import { supabase } from '@libs/supabase'

export const getAnimeCharacters = async (animeId: string, language: string) => {
  const { data, error } = await supabase.rpc('get_anime_characters', {
    input_anime_id: animeId,
    language_filter: language,
  })

  if (error || !data) {
    throw new Error(error?.message || 'Error fetching anime characters')
  }

  return data
}
