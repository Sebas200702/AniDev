import { createContextLogger } from '@libs/pino'
import { supabase } from '@libs/supabase'
import type { UserProfileToRecommendations } from '@recommendations/types'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('RecommendationsService')

export const getUserPreferences = async (
  userId: string | null
): Promise<{
  userProfile: UserProfileToRecommendations | null
  calculatedAge: number | null
  error: string | null
}> => {
  try {
    const userPlaceholder: UserProfileToRecommendations = {
      name: 'Usuario',
      last_name: 'Anónimo',
      gender: 'No especificado',
      birthday: '2000-01-01',
      favorite_animes: [
        'Naruto',
        'One Piece',
        'Attack on Titan',
        'Demon Slayer',
        'My Hero Academia',
      ],
      favorite_genres: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'],
      favorite_studios: [
        'Studio Pierrot',
        'Toei Animation',
        'Madhouse',
        'Bones',
        'Ufotable',
      ],
      preferred_format: 'Series',
      frequency_of_watch: 'Ocasional',
      fanatic_level: 'Casual',
      search_history: [],
      watched_animes: [],
    }

    if (!userId) {
      return {
        userProfile: userPlaceholder,
        calculatedAge: 25,
        error: null,
      }
    }

    const { data: userProfile, error: userProfileError } = await supabase
      .from('user_profiles')
      .select(
        'search_history(search_history), favorite_animes, favorite_genres, favorite_studios, frequency_of_watch, fanatic_level, gender, last_name, name, preferred_format, birthday, watched_animes'
      )
      .eq('id', userId)
      .single()

    if (userProfileError) {
      logger.warn(
        `Error fetching user profile for ${userId}, using placeholder:`,
        userProfileError
      )
      return {
        userProfile: userPlaceholder,
        calculatedAge: 25,
        error: null,
      }
    }

    const calculatedAge =
      new Date().getFullYear() - new Date(userProfile.birthday).getFullYear()

    return {
      userProfile: {
        ...userProfile,
        search_history: Array.isArray(userProfile.search_history)
          ? userProfile.search_history.map((sh: any) => sh.search_history)
          : [],
      },
      calculatedAge: calculatedAge || 18,
      error: null,
    }
  } catch (error) {
    logger.error('[RecommendationsService.getUserPreferences] Error:', {
      error,
    })
    if (isAppError(error)) {
      throw error
    }
    throw AppError.database('Failed to fetch user preferences', {
      originalError: error,
    })
  }
}
