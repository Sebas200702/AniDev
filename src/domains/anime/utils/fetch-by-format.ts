import { Formats } from '@anime/types'
import type {
  AnimeBannerInfo,
  AnimeCardInfo,
  AnimeCollectionInfo,
  AnimeDetail,
  AnimeTopInfo,
} from '@anime/types'
import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

/**
 * Mapeo de formatos a tipos de retorno
 */
type FormatTypeMap = {
  [Formats.AnimeCard]: AnimeCardInfo
  [Formats.AnimeBanner]: AnimeBannerInfo
  [Formats.TopAnime]: AnimeTopInfo
  [Formats.AnimeCollection]: AnimeCollectionInfo
  [Formats.AnimeDetail]: AnimeDetail
  [Formats.Schedule]: AnimeCardInfo
  [Formats.Search]: AnimeCardInfo
}

/**
 * Resultado tipado según el formato
 */

/**
 * Configuración de formatos
 */
const FORMAT_CONFIGS: Record<Formats, { function: string; typeName: string }> =
  {
    [Formats.AnimeCard]: {
      function: 'get_anime_summary_card',
      typeName: 'AnimeCardInfo',
    },
    [Formats.AnimeBanner]: {
      function: 'get_animes_banner',
      typeName: 'AnimeBannerInfo',
    },
    [Formats.TopAnime]: {
      function: 'get_top_animes',
      typeName: 'AnimeTopInfo',
    },
    [Formats.AnimeCollection]: {
      function: 'get_animes_collection',
      typeName: 'AnimeCollectionInfo',
    },
    [Formats.AnimeDetail]: {
      function: 'get_anime_detail_card',
      typeName: 'AnimeDetail',
    },
    [Formats.Schedule]: {
      function: 'get_anime_schedule',
      typeName: 'AnimeCardInfo',
    },
    [Formats.Search]: {
      function: 'get_anime_summary_card',
      typeName: 'AnimeCardInfo',
    },
  }

/**
 * Obtiene datos de anime según el formato con tipado automático
 */
export async function fetchByFormat<T extends Formats>(
  format: T,
  filters: Record<string, any>
): Promise<FormatTypeMap[T][]> {
  const config = FORMAT_CONFIGS[format]
  const { data, error } = await supabase.rpc(config.function, filters)

  if (error) {
    throw AppError.database('Failed to fetch anime by format', {
      format,
      functionName: config.function,
      ...error,
    })
  }

  return (data ?? []) as FormatTypeMap[T][]
}

export async function fetchAnimeCount(
  filters: Record<string, any>
): Promise<number> {
  const { data, error } = await supabase.rpc('get_anime_count', filters)

  if (error) {
    throw AppError.database('Failed to fetch anime count', {
      filters,
      ...error,
    })
  }

  return data ?? 0
}
