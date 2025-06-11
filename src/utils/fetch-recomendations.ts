import { supabase } from '@libs/supabase'

export const fetchRecomendations = async (
  mal_ids: string[],
  minResults: number = 24,
  currentAnimeId?: string
) => {
  const numericIds = mal_ids.map((id) => Number(id))

  console.log('currentAnimeId', currentAnimeId)
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

  // Filtrar el anime actual si se proporciona
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

  // Si no tenemos suficientes resultados, completar con animes populares
  if (data && data.length < minResults) {
    let additionalNeeded = minResults - data.length
    const existingIds = data.map((anime) => anime.mal_id)

    console.log(
      `Insufficient results (${data.length}/${minResults}). Fetching ${additionalNeeded} additional animes.`
    )

    // Intentar múltiples estrategias de fallback hasta completar el mínimo
    let attempts = 0
    const maxAttempts = 3

    while (data.length < minResults && attempts < maxAttempts) {
      attempts++
      const currentLimit = Math.min(additionalNeeded * 2, 50) // Pedir más de lo necesario

      console.log(
        `Fallback attempt ${attempts}: requesting ${currentLimit} animes`
      )

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

      // Excluir el anime actual si se proporciona
      if (currentAnimeId) {
        query = query.neq('mal_id', Number(currentAnimeId))
      }

      const { data: fallbackData, error: fallbackError } = await query

      if (!fallbackError && fallbackData && fallbackData.length > 0) {
        const toAdd = fallbackData.slice(0, additionalNeeded)
        data.push(...toAdd)
        additionalNeeded = minResults - data.length

        console.log(
          `Added ${toAdd.length} fallback animes. Total: ${data.length}/${minResults}`
        )

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
