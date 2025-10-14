import { AnimeSimilarTo } from '@anime/components/anime-info/anime-info-similar-to/anime-info-similar-to'
import type { AnimeCardInfo } from '@anime/types'

import { useFetch } from '@shared/hooks/useFetch'
import { useGlobalUserPreferences } from '@user/stores/user-store'

interface Props {
  title: string
  mal_id: number
}
export const AnimeSimilarToContainer = ({ title, mal_id }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()
  const { data, loading, error } = useFetch<AnimeCardInfo[]>({
    url: `/api/animes/getRecomendations?similar_to=${title}&currentAnime=${mal_id}&parental_control=${parentalControl}`,
  })

  return <AnimeSimilarTo loading={loading} data={data!} error={error!} />
}
