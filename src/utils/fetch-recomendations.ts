import { supabase } from '@libs/supabase'

export const fetchRecomendations = async (
  mal_ids: string[],
  minResults: number = 24,
  currentAnimeId?: string
) => {
  const numericIds = mal_ids.map((id) => Number(id))

  const { data: initialData, error } = await supabase
    .from('anime')
    .select(
      `
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
      `
    )
    .in('mal_id', numericIds)

  if (error) {
    console.error('Supabase error:', error)
    return []
  }


  let data = initialData
  if (currentAnimeId && data) {
    const currentAnimeIdNum = Number(currentAnimeId)
    data = data.filter((anime) => anime.mal_id !== currentAnimeIdNum)
  }

  const receivedIds = new Set(data?.map((a) => a.mal_id))
  const missingIds = numericIds.filter((id) => !receivedIds.has(id))

  if (missingIds.length > 0) {
    console.warn('Missing mal_ids:', missingIds)
  }


  if (data && data.length < minResults) {
    let additionalNeeded = minResults - data.length



    let attempts = 0
    const maxAttempts = 3

    while (data.length < minResults && attempts < maxAttempts) {
      attempts++
      const currentLimit = Math.min(additionalNeeded * 2, 50)



      let query = supabase
        .from('anime')
        .select(
          `
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
          `
        )
        .not('mal_id', 'in', `(${data.map((a) => a.mal_id).join(',')})`)
        .not('score', 'is', null)
        .order('score', { ascending: false })
        .limit(currentLimit)

      if (currentAnimeId) {
        query = query.neq('mal_id', Number(currentAnimeId))
      }

      const { data: fallbackData, error: fallbackError } = await query

      if (!fallbackError && fallbackData && fallbackData.length > 0) {
        const toAdd = fallbackData.slice(0, additionalNeeded)
        data.push(...toAdd)
        additionalNeeded = minResults - data.length

        if (data.length >= minResults) {
          break
        }
      } else {
        console.warn(`Fallback attempt ${attempts} failed or returned no data`)
        break
      }
    }

    if (data.length < minResults) {
      console.warn(
        `Warning: Could only fetch ${data.length}/${minResults} recommendations after ${attempts} attempts`
      )
    }
  }

  return data || []
}
