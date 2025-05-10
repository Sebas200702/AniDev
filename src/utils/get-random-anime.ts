import { supabase } from '@libs/supabase'
import type { RandomAnime } from 'types'
export const getRandomAnime = async (
  parentalControl: boolean | null
): Promise<RandomAnime> => {
  const { data, error } = await supabase.rpc('get_weighted_random_entry', {
    parental_control: parentalControl,
  })

  if (error || !data) {
    return await getRandomAnime(parentalControl)
  }

  return data[0] as RandomAnime
}
