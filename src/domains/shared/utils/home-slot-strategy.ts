import {
  FOCUSES,
  MOODS,
  POPULAR_STUDIOS,
  TYPE_BANK,
} from '@shared/constants/home-constants'
import { GenrePicker, SlotBuilder } from '@shared/utils/home-slot-helpers'

export const HomeSlotStrategy = {
  selectSlotContent: (userGenres: string[], userProfile?: any) => {
    const picker = new GenrePicker(userGenres)

    // Random Helpers
    const randomItem = <T>(arr: T[]): T =>
      arr[Math.floor(Math.random() * arr.length)]
    const randomYear = () =>
      Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010

    // Context Data
    const randomMood = randomItem(MOODS)
    const randomFocus = randomItem(FOCUSES)
    const referenceAnime =
      userProfile?.favorite_animes?.[
        Math.floor(Math.random() * (userProfile.favorite_animes.length || 0))
      ]

    // Pre-selections
    const mixGenres = picker.pickMultiple(userGenres, 4, true)
    const featuredGenre = picker.pick(userGenres, true)
    const recommendedGenre = picker.pick(userGenres, true)
    const discoverGenre = picker.pick(userGenres, false)
    const trendingGenre = picker.pick(userGenres, false)
    const exploreGenres = picker.pickMultiple(userGenres, 4, false)
    const banner3Genre = picker.pick(userGenres, false)
    const moreGenre = picker.pick(userGenres, false)

    // Strategy Decisions
    const useStudioForSlider1 = Math.random() > 0.6
    const slider1Studio = useStudioForSlider1 ? randomItem(POPULAR_STUDIOS) : ''

    const useYearForSlider3 = Math.random() > 0.5
    const slider3Year = useYearForSlider3 ? randomYear() : 0

    const useMovieForBanner3 = Math.random() > 0.4

    const topRatedType = randomItem(TYPE_BANK)
    const referenceContext = referenceAnime
      ? ` and similar to ${referenceAnime}`
      : ''
    const personalTitles = [
      'Selected For You',
      'Only For You',
      'Why We Know You',
      'Picked For You',
      'Just For You',
      'Your Vibes',
      'Tailored For You',
    ]
    const selectedPersonalTitle = randomItem(personalTitles)

    return [
      // 1. Special For You (Personalized Recommendations)
      SlotBuilder.slider(
        'recommendations',
        { limit: 24, mood: randomMood, focus: randomFocus, referenceAnime },
        selectedPersonalTitle
      ),

      // 2. Top 2025
      SlotBuilder.slider(
        '2025',
        { year: 2025 },
        'Top 2025',
        'The most popular anime of 2025. Title MUST be about "New", "2025", or "Latest Hits". NO specific genres.'
      ),

      // 3. Collection Mix
      SlotBuilder.collection(
        'Mix',
        mixGenres,
        'Your Mix',
        `A curated mix of genres including ${mixGenres.join(', ')}. Title MUST be abstract (e.g., "Genre Blender").`
      ),

      // 4. Banner 1
      SlotBuilder.banner(featuredGenre, { genre: featuredGenre }),

      // 5. Slider 1 (Studio vs Genre)
      useStudioForSlider1
        ? SlotBuilder.slider(
            slider1Studio,
            { studio: slider1Studio },
            'Studio Spotlight',
            `A showcase of anime from the studio ${slider1Studio}. Title should highlight the studio's name.`
          )
        : SlotBuilder.slider(
            recommendedGenre,
            { genre: recommendedGenre },
            'Recommended',
            `A recommendation slider for the ${recommendedGenre} genre. Title should be catchy.`
          ),

      // 6. Top Rated
      SlotBuilder.slider(
        topRatedType,
        { type: topRatedType },
        'Top Rated',
        `Top rated anime of format: ${topRatedType}. Title MUST focus on the format. NO specific genres.`
      ),

      // 7. Banner 2
      SlotBuilder.banner(discoverGenre, { genre: discoverGenre }),

      // 8. Slider 3 (Year vs Trending)
      useYearForSlider3
        ? SlotBuilder.slider(
            slider3Year.toString(),
            { year: slider3Year },
            `Best of ${slider3Year}`,
            `Top anime from the year ${slider3Year}. Title should be nostalgic.`
          )
        : SlotBuilder.slider(
            trendingGenre,
            { genre: trendingGenre },
            'Trending',
            `Trending anime in the ${trendingGenre} genre. Title should sound popular.`
          ),

      // 9. Explore Collection
      SlotBuilder.collection(
        'Explore',
        exploreGenres,
        'Explore',
        `An exploration collection with diverse genres: ${exploreGenres.join(', ')}. Title MUST be abstract.`
      ),

      // 10. Banner 3 (Movie vs Genre)
      useMovieForBanner3
        ? SlotBuilder.banner('Movies', { type: 'Movie' })
        : SlotBuilder.banner(banner3Genre, { genre: banner3Genre }),

      // 11. More to Watch
      SlotBuilder.slider(
        moreGenre,
        { genre: moreGenre, type: 'TV' },
        'More to Watch',
        `More ${moreGenre} anime series to keep watching.`
      ),
    ]
  },
}
