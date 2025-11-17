import { supabase } from '@libs/supabase'

export const GenreRepository = {
  async getAllGenres() {
    const { data, error } = await supabase
      .from('genres')
      .select('mal_id, name')
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch genres: ${error.message}`)
    }

    return data ?? []
  },
}
