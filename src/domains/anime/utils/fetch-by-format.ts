import { supabase } from '@libs/supabase'

export enum Formats {
  AnimeCard = 'anime-card',
  AnimeBanner = 'anime-banner',
  TopAnime = 'top-anime',
  AnimeCollection = 'anime-collection',
  AnimeDetail = 'anime-detail',
  Search = 'search',
  Schedule = 'schedule',
}

const getFormat = (format: string) => {
  switch (format) {
    case Formats.AnimeCard:
      return 'get_anime_summary_card'
    case Formats.AnimeBanner:
      return 'get_animes_banner'
    case Formats.TopAnime:
      return 'get_top_animes'
    case Formats.AnimeCollection:
      return 'get_animes_collection'
    case Formats.AnimeDetail:
      return 'get_anime_detail_card'
    case Formats.Search:
      return 'get_anime_summary_card'
    case Formats.Schedule:
      return 'get_anime_schedule'
    default:
      return 'get_anime_summary_card'
  }
}

export async function fetchByFormat(
  format: string,
  filters: Record<string, any>
) {
  const rpcFunction = getFormat(format)
  const { data, error } = await supabase.rpc(rpcFunction, filters)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchAnimeCount(filters: Record<string, any>) {
  const { data, error } = await supabase.rpc('get_anime_count', filters)
  if (error) throw new Error(error.message)
  return data ?? 0
}
