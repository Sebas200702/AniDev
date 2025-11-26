import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const GenreRepository = {
  async getAllGenres() {
    const { data, error } = await supabase
      .from('genres')
      .select('mal_id, name')
      .order('name', { ascending: true })

    if (error) {
      throw AppError.database('Failed to fetch genres', {
        ...error,
      })
    }

    return data ?? []
  },
}
