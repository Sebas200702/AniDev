import { AnimeRelated } from '@anime/components/anime-info/anime-info-related/anime-info-related'
import type { AnimeDetail } from '@anime/types'
import { useFetch } from '@shared/hooks/useFetch'

interface Props {
  animeId: number
}

export const AnimeRelatedContainer = ({ animeId }: Props) => {
  const { data, loading, error } = useFetch<AnimeDetail[]>({
    url: `/animes/getAnimeRelations?animeId=${animeId}`,
  })

  return <AnimeRelated related={data!} isLoading={loading} error={error} />
}
