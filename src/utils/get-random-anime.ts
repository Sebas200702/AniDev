import { supabase } from '@libs/supabase'
import type { RandomAnime } from 'types'
export const getRandomAnime = async (): Promise<RandomAnime> => {
  const { data, error } = await supabase.rpc('get_weighted_random_entry')

  if (error || !data) {
    return await getRandomAnime()
  }

  return data[0] as RandomAnime
}
