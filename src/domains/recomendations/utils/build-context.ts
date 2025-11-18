import type { RecommendationContext } from 'domains/ai/types'

export function buildContextFromUrl(url: URL): RecommendationContext {
  return {
    type:
      (url.searchParams.get('context') as RecommendationContext['type']) ||
      'general',
    data: {
      searchQuery: url.searchParams.get('searchQuery') || undefined,
      currentAnime: {
        title: url.searchParams.get('currentAnimeTitle') || '',
        mal_id: parseInt(url.searchParams.get('currentAnimeId') || ''),
      },
      mood: url.searchParams.get('mood') || undefined,
      referenceAnime: url.searchParams.get('referenceAnime') || undefined,
      season: url.searchParams.get('season') || undefined,
      timeAvailable: url.searchParams.get('timeAvailable') || undefined,
    },
    count: parseInt(url.searchParams.get('count') || '24'),
    focus: url.searchParams.get('focus') || undefined,
    parentalControl: url.searchParams.get('parental_control') === 'true',
  }
}
