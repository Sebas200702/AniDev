import { recommendationsRepository } from '@recommendations/repositories'
import { buildStrategies } from '@recommendations/utils/build-strategies'
import { shuffleArray } from '@utils/shuffle-array'

export async function getAlternativeFallback(
  excludedIds: Set<number>,
  needed: number,
  parentalControl: boolean
) {
  const results: any[] = []
  const used = new Set<number>()
  const strategies = shuffleArray(buildStrategies())

  for (const strategy of strategies) {
    if (results.length >= needed) break

    const stillNeeded = needed - results.length
    const data = await recommendationsRepository.findByStrategy(
      strategy.apply,
      new Set([...excludedIds, ...used]),
      Math.min(stillNeeded * 2, 40),
      parentalControl
    )

    for (const anime of data) {
      if (results.length < needed) {
        results.push(anime)
        used.add(anime.mal_id)
      }
    }
  }

  return results
}
