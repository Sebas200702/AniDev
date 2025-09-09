import { supabase } from '@libs/supabase'

const userPlaceholder = {
  name: 'Usuario',
  last_name: 'Anónimo',
  gender: 'No especificado',
  birthday: '2000-01-01', // Edad por defecto: ~25 años
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

export const getUserDataToRecomendations = async (
  userId: string | null | undefined,
  isAuth: boolean
) => {
  if (!isAuth && !userId) {
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
    .eq('user_id', userId)

  if (userProfileError) {
    return {
      userProfile: null,
      calculatedAge: null,
      error: userProfileError.message,
    }
  }

  const calculatedAge =
    new Date().getFullYear() - new Date(userProfile[0].birthday).getFullYear()

  return {
    userProfile: userProfile[0],
    calculatedAge,
    error: null,
  }
}
