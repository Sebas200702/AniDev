import { createContextLogger } from '@libs/pino'
import { supabase } from '@libs/supabase'

const logger = createContextLogger('RecommendationsRepository')

export const SELECT_FIELDS = `
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

export const recommendationsRepository = {
  baseQuery(parentalControl: boolean) {
    let query = supabase.from('anime').select(SELECT_FIELDS)
    if (parentalControl) {
      query = query
        .not('rating', 'ilike', '%Rx - Hentai%')
        .not('rating', 'ilike', '%R+ - Mild Nudity%')
    }
    return query
  },

  async findByIds(ids: number[], parentalControl: boolean) {
    if (!ids.length) return []
    const { data, error } = await this.baseQuery(parentalControl).in(
      'mal_id',
      ids
    )
    if (error) {
      logger.error('[RecommendationsRepository.findByIds]', error)
      return []
    }
    return data || []
  },

  async findByStrategy(
    strategy: (q: any) => any,
    excludedIds: Set<number>,
    limit: number,
    parentalControl: boolean
  ) {
    const allExcluded = [...excludedIds].join(',')
    let base = this.baseQuery(parentalControl)
      .not('mal_id', 'in', `(${allExcluded})`)
      .not('score', 'is', null)
      .gt('score', 7.8)
      .limit(limit)

    const { data, error } = await strategy(base)
    if (error) {
      logger.error('[RecommendationsRepository.findByStrategy]', error)
      return []
    }

    return data || []
  },
}
