import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const saveSearchHistory = async (
  userId: string,
  searchHistory: any[]
) => {
  const { error } = await supabase.from('search_history').upsert(
    {
      search_history: JSON.stringify(searchHistory),
      user_id: userId,
    },
    {
      onConflict: 'user_id',
    }
  )

  if (error) {
    throw AppError.database('Failed to save search history', {
      userId,
      ...error,
    })
  }

  return { success: true }
}

export const getSearchHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('search_history')
    .select('search_history')
    .eq('user_id', userId)

  if (error) {
    throw AppError.database('Failed to fetch search history', {
      userId,
      ...error,
    })
  }

  if (!data || data.length === 0) {
    return []
  }

  return JSON.parse(data[0].search_history)
}

export const deleteSearchHistory = async (userId: string) => {
  const { error } = await supabase
    .from('search_history')
    .delete()
    .eq('id', userId)

  if (error) {
    throw AppError.database('Failed to delete search history', {
      userId,
      ...error,
    })
  }

  return { success: true }
}
