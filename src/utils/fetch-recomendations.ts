import { supabase } from '@libs/supabase'
import { shuffleArray } from '@utils/shuffle-array'

export const fetchRecomendations = async (
  mal_ids: string[],
  minResults: number = 24,
  currentAnimeId?: string,
  jikanRecommendations?: {
    mal_ids: number[]
    titles: string[]
    error?: string
  } | null,
  parentalControl = true
) => {
  const numericIds = mal_ids
    .filter((id) => id && !isNaN(Number(id)) && Number.isInteger(Number(id)))
    .map((id) => Number(id))

  const excludedIds = new Set<number>()

  const hasValidIds = numericIds.length > 0

  let query = supabase.from('anime').select(
    `
        mal_id,
        title,
        image_webp,
        image_small_webp,
        image_large_webp,
        year,
        status,
        score,
        rating,
        anime_genres ( genres ( name ) )
      `
  )

  if (hasValidIds) {
    query = query.in('mal_id', numericIds)
  }

  if (parentalControl) {
    query = query
      .not('rating', 'ilike', '%Rx - Hentai%')
      .not('rating', 'ilike', '%R+ - Mild Nudity%')
  }

  const { data: initialData, error } = await query

  if (error) {
    console.error('Supabase error:', error)
  }

  let results = initialData || []

  if (currentAnimeId) {
    const currentIdNum = Number(currentAnimeId)
    results = results.filter((anime) => anime.mal_id !== currentIdNum)
    excludedIds.add(currentIdNum)
  }

  results.forEach((anime) => excludedIds.add(anime.mal_id))
  const missingIds = numericIds.filter((id) => !excludedIds.has(id))

  if (missingIds.length > 0) {
    console.warn('Missing mal_ids:', missingIds)
  }

  const getJikanFallback = async (needed: number) => {
    if (!jikanRecommendations || jikanRecommendations.mal_ids.length === 0) {
      return []
    }

    const availableJikanIds = jikanRecommendations.mal_ids.filter(
      (id) => !excludedIds.has(id)
    )

    if (availableJikanIds.length === 0) {
      return []
    }

    const shuffledJikanIds = shuffleArray(availableJikanIds).slice(0, needed)

    let jikanQuery = supabase
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
          score,
          rating,
          anime_genres ( genres ( name ) )
        `
      )
      .in('mal_id', shuffledJikanIds)

    if (parentalControl) {
      jikanQuery = jikanQuery
        .not('rating', 'ilike', '%Rx - Hentai%')
        .not('rating', 'ilike', '%R+ - Mild Nudity%')
    }

    const { data, error } = await jikanQuery

    if (error || !data) {
      console.error('Jikan fallback query error:', error)
      return []
    }

    return data
  }
  const getAlternativeFallback = async (needed: number) => {
    const fallbackResults: any[] = []
    const usedInFallback = new Set<number>()

    const strategies = shuffleArray([
      {
        name: 'high_score',
        query: (q: any) =>
          q.order('score', { ascending: false }).gt('score', 7.5),
      },
      {
        name: 'popular',
        query: (q: any) =>
          q.order('members', { ascending: false }).gt('members', 50000),
      },
      {
        name: 'recent',
        query: (q: any) =>
          q.order('year', { ascending: false }).gt('year', 2020),
      },
      {
        name: 'hidden_gems',
        query: (q: any) =>
          q
            .order('score', { ascending: false })
            .lt('members', 30000)
            .gt('score', 7.0),
      },
    ])

    for (const strategy of strategies) {
      if (fallbackResults.length >= needed) break

      const stillNeeded = needed - fallbackResults.length

      const allExcludedIds = [...excludedIds, ...usedInFallback].join(',')

      let baseQuery = supabase.from('anime').select(
        `
            mal_id,
            title,
            image_webp,
            image_small_webp,
            image_large_webp,
            year,
            status,
            score,
            rating,
            anime_genres ( genres ( name ) )
          `
      )

      if (parentalControl) {
        baseQuery = baseQuery
          .not('rating', 'ilike', '%Rx - Hentai%')
          .not('rating', 'ilike', '%R+ - Mild Nudity%')
      }

      baseQuery = baseQuery
        .not('mal_id', 'in', `(${allExcludedIds})`)
        .not('score', 'is', null)
        .gt('score', 6.8)
        .limit(Math.min(stillNeeded * 2, 40))

      const { data, error } = await strategy.query(baseQuery)

      if (error || !data) {
        console.error(`Fallback strategy ${strategy.name} query error:`, error)
        continue
      }

      for (const anime of data) {
        if (fallbackResults.length < needed) {
          fallbackResults.push(anime)
          usedInFallback.add(anime.mal_id)
        }
      }
    }

    return fallbackResults
  }

  if (results.length < minResults) {
    const needed = minResults - results.length

    let fallbackResults = await getJikanFallback(needed)

    if (fallbackResults.length < needed) {
      const stillNeeded = needed - fallbackResults.length

      const traditionalResults = await getAlternativeFallback(stillNeeded)
      fallbackResults = [...fallbackResults, ...traditionalResults]
    }

    fallbackResults.forEach((item) => {
      if (!excludedIds.has(item.mal_id)) {
        results.push(item)
        excludedIds.add(item.mal_id)
      }
    })

    if (results.length < minResults) {
      console.warn(
        `Only found ${results.length}/${minResults} recommendations after fallback`
      )
    }
  }

  return shuffleArray(results)
}
