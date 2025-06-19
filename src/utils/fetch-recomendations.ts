import { supabase } from '@libs/supabase'

export const fetchRecomendations = async (
  mal_ids: string[],
  minResults: number = 24,
  currentAnimeId?: string
) => {
  const numericIds = mal_ids.map((id) => Number(id))
  const excludedIds = new Set<number>()

  // Obtener datos iniciales
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
        score,
        anime_genres ( genres ( name ) )
      `
    )
    .in('mal_id', numericIds)

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  let results = initialData || []

  // Filtrar anime actual si existe
  if (currentAnimeId) {
    const currentIdNum = Number(currentAnimeId)
    results = results.filter((anime) => anime.mal_id !== currentIdNum)
    excludedIds.add(currentIdNum)
  }

  // Registrar IDs recibidos y faltantes
  results.forEach((anime) => excludedIds.add(anime.mal_id))
  const missingIds = numericIds.filter((id) => !excludedIds.has(id))

  if (missingIds.length > 0) {
    console.warn('Missing mal_ids:', missingIds)
  }

  // Función para obtener recomendaciones alternativas
  const getAlternativeRecommendations = async (needed: number) => {
    // Estrategias de búsqueda alternativas
    const strategies = [
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
    ]

    // Seleccionar estrategia aleatoria
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]
    console.log(`Using fallback strategy: ${strategy.name}`)

    const baseQuery = supabase
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
          anime_genres ( genres ( name ) )
        `
      )
      .not('mal_id', 'in', `(${[...excludedIds].join(',')})`)
      .not('score', 'is', null)
      .gt('score', 6.8)
      .limit(Math.min(needed * 3, 50))

    const { data, error } = await strategy.query(baseQuery)

    if (error || !data) {
      console.error('Fallback query error:', error)
      return []
    }

    // Mezclar resultados para mayor variedad
    return shuffleArray([...data]).slice(0, needed)
  }

  // Completar resultados si faltan
  if (results.length < minResults) {
    const needed = minResults - results.length
    const fallbackResults = await getAlternativeRecommendations(needed)

    // Filtrar duplicados y añadir a resultados
    fallbackResults.forEach((item) => {
      if (!excludedIds.has(item.mal_id)) {
        results.push(item)
        excludedIds.add(item.mal_id)
      }
    })

    if (results.length < minResults) {
      console.warn(`Only found ${results.length}/${minResults} recommendations`)
    }
  }

  return shuffleArray(results)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
