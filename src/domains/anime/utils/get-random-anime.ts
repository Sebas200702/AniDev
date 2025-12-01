import type { RandomAnime } from '@anime/types'
import { createContextLogger } from '@libs/pino'
import { supabase } from '@libs/supabase'

const logger = createContextLogger('getRandomAnime')

export const getRandomAnime = async (
  parentalControl: boolean | null,
  retryCount = 0,
  userId?: string | null
): Promise<RandomAnime> => {
  const MAX_RETRIES = 3

  const { data, error } = await supabase.rpc(
    'get_random_anime_recommendation',
    {
      p_user_id: userId ?? null,
      p_parental_control: parentalControl,
    }
  )

  if (error || !data) {
    if (retryCount >= MAX_RETRIES) {
      logger.error('Failed to fetch random anime after retries:', error)
      throw new Error('Unable to fetch random anime recommendation')
    }
    return await getRandomAnime(parentalControl, retryCount + 1, userId)
  }

  const randomAnime = data[0] as RandomAnime

  return randomAnime
}
