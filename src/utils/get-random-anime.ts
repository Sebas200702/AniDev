import { supabase } from '@libs/supabase'
import type { RandomAnime } from '@anime/types'
export const getRandomAnime = async (
  parentalControl: boolean | null
): Promise<RandomAnime> => {
  const { data, error } = await supabase.rpc('get_random_anime', {
    parental_control: parentalControl,
  })

  const randomAnime = data[0] as RandomAnime

  if (error || !data) {
    return await getRandomAnime(parentalControl)
  }

  return randomAnime
}
