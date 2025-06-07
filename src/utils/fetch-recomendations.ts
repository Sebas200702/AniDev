import { supabase } from '@libs/supabase'

export const fetchRecomendations = async (mal_ids: string[]) => {
  const numericIds = mal_ids.map((id) => Number(id))

  const { data, error } = await supabase
    .from('anime')
    .select(`
        mal_id,
        title,
        image_webp,
        image_small_webp,
        image_large_webp,
        year,
        status,
        anime_genres (
          genres ( name )
        )
      `)

    .in('mal_id', numericIds)

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  const receivedIds = new Set(data?.map((a) => a.mal_id))
  const missingIds = numericIds.filter((id) => !receivedIds.has(id))
  if (missingIds.length > 0) {
    console.warn('Missing mal_ids:', missingIds)
  }


  return data
}
