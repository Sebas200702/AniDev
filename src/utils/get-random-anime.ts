import { supabase } from '@libs/supabase'
import type { RandomAnime } from 'types'
export const getRandomAnime = async (): Promise<RandomAnime> => {
  const randomId = Math.floor(Math.random() * (61483 - 1 + 1) + 1)
  const { data, error } = await supabase
    .from('old_anime')
    .select('mal_id, title')
    .eq('mal_id', randomId)

  if (error || !data) {
    return await getRandomAnime()
  }

  return data[0] as RandomAnime
}
