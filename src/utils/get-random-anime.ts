import type { RandomAnime } from '@anime/types'
import { supabase } from '@libs/supabase'
export const getRandomAnime = async (
  userId: string | null,
  parentalControl: boolean | null,
  retryCount = 0
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
      console.error('Failed to fetch random anime after retries:', error)
      throw new Error('Unable to fetch random anime recommendation')
    }
    return await getRandomAnime(userId, parentalControl, retryCount + 1)
  }

  const randomAnime = data[0] as RandomAnime

  return randomAnime
}
