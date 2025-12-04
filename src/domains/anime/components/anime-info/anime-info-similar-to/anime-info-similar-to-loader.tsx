import { LoadingCard } from '@search/components/search-results/loading-card'

export const AnimeSimilarToLoader = () => {
  return new Array(10).fill(null).map((_, idx) => <LoadingCard key={idx + 1} />)
}
