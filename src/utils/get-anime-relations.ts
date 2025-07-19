import { supabase } from '@libs/supabase'

export const getAnimeRelations = async (animeId: string) => {
  const { data, error } = await supabase.rpc('get_related_anime', {
    p_mal_id: animeId,
  })

  if (error) {
    console.error(error)
    return []
  }

  return data
}
