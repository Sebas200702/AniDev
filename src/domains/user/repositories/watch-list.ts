import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const upsertWatchListItem = async (
  userId: string,
  animeId: number,
  type: string
) => {
  const { error } = await supabase.from('watch_list').upsert({
    anime_id: animeId,
    user_id: userId,
    type: type,
  })

  if (error) {
    throw AppError.database('Failed to add anime to watch list', {
      userId,
      animeId,
      type,
      ...error,
    })
  }

  return { success: true }
}

export const removeFromWatchList = async (userId: string, animeId: number) => {
  const { error } = await supabase
    .from('watch_list')
    .delete()
    .eq('anime_id', animeId)
    .eq('user_id', userId)

  if (error) {
    throw AppError.database('Failed to remove anime from watch list', {
      userId,
      animeId,
      ...error,
    })
  }

  return { success: true }
}

export const getWatchList = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_user_watch_list', {
    p_user_id: userId,
  })

  if (error) {
    throw AppError.database('Failed to fetch watch list', {
      userId,
      ...error,
    })
  }
  if (!data) {
    throw AppError.notFound('Watch list not found', { userId })
  }

  return data
}
