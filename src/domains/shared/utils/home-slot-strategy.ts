import { GENRE_BANK, TYPE_BANK } from '@shared/constants/home-constants'
import { shuffleArray } from '@utils/shuffle-array'

export const HomeSlotStrategy = {
  /**
   * Selects the content (genres/types) for each dynamic slot
   */
  selectSlotContent: (userGenres: string[], userProfile?: any) => {
    const availableGenres = shuffleArray([...GENRE_BANK]) as string[]
    const POPULAR_STUDIOS = [
      'MAPPA',
      'Madhouse',
      'Bones',
      'Kyoto Animation',
      'ufotable',
      'A-1 Pictures',
      'Wit Studio',
      'Sunrise',
      'Toei Animation',
      'Production I.G',
      'Studio Pierrot',
    ]
    const MOODS = [
      'Exciting',
      'Relaxing',
      'Emotional',
      'Dark',
      'Wholesome',
      'Mind-bending',
    ]
    const FOCUSES = [
      'Story',
      'Characters',
      'Visuals',
      'World-building',
      'Action',
      'Romance',
    ]

    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)]
    const randomFocus = FOCUSES[Math.floor(Math.random() * FOCUSES.length)]
    const referenceAnime =
      userProfile?.favorite_animes?.[
        Math.floor(Math.random() * (userProfile.favorite_animes.length || 0))
      ]

    const pickGenre = (preferred: boolean = true): string => {
      const source = preferred
        ? userGenres.filter((g) => availableGenres.includes(g))
        : availableGenres

      const pool = source.length > 0 ? source : availableGenres
      const picked =
        pool.find((g) => availableGenres.includes(g)) || availableGenres[0]

      const index = availableGenres.indexOf(picked)
      if (index > -1) availableGenres.splice(index, 1)

      return picked
    }

    const getRandomStudio = () =>
      POPULAR_STUDIOS[Math.floor(Math.random() * POPULAR_STUDIOS.length)]
    const getRandomYear = () =>
      Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010

    // Pre-select content to ensure uniqueness and build context
    const mixGenres = [pickGenre(), pickGenre(), pickGenre(), pickGenre(false)]

    // Complex strategies
    const featuredGenre = pickGenre()

    // Strategy for Slider 1: Genre vs Studio
    const useStudioForSlider1 = Math.random() > 0.6 // 40% chance for Studio
    const slider1Studio = useStudioForSlider1 ? getRandomStudio() : ''
    const recommendedGenre = useStudioForSlider1 ? '' : pickGenre()

    const topRatedType = TYPE_BANK[Math.floor(Math.random() * TYPE_BANK.length)]
    const discoverGenre = pickGenre(false)

    // Strategy for Slider 3: Genre vs Throwback Year
    const useYearForSlider3 = Math.random() > 0.5 // 50% chance for Year
    const slider3Year = useYearForSlider3 ? getRandomYear() : 0
    const trendingGenre = useYearForSlider3 ? '' : pickGenre(false)

    const exploreGenres = [
      pickGenre(false),
      pickGenre(false),
      pickGenre(false),
      pickGenre(false),
    ]

    // Strategy for Banner 3: Movie vs Sci-Fi/Fantasy/Action Banner
    const useMovieForBanner3 = Math.random() > 0.4 // 60% chance for Movie
    const banner3Genre = useMovieForBanner3 ? '' : pickGenre(false)

    const moreGenre = pickGenre(false)

    // Define the content for each slot in DYNAMIC_SECTION_IDS order
    return [
      // special-for-you
      {
        type: 'slider',
        filters: {
          limit: 24,
          mood: randomMood,
          focus: randomFocus,
          referenceAnime: referenceAnime,
        },
        value: 'recommendations', // Keep for legacy check if needed, or remove
        defaultTitle: 'Special For You',
        aiContext: `Highly personalized anime recommendations based on mood: ${randomMood}, focus: ${randomFocus}${
          referenceAnime ? ` and similar to ${referenceAnime}` : ''
        }. Title should be personal and intriguing (e.g., "Mood: ${randomMood}", "Focus on ${randomFocus}").`,
      },
      // top-2025
      {
        type: 'slider',
        filters: { year: 2025 }, // Removed type: 'TV' to broaden results
        value: '2025',
        defaultTitle: 'Top 2025',
        aiContext:
          'The most popular anime of 2025. Title MUST be about "New", "2025", or "Latest Hits". ABSOLUTELY NO specific genres (like GL, Action, Romance) in the title because this section contains ALL genres.',
      },
      // collection-1
      {
        type: 'collection',
        filters: { genre: 'Mix' },
        value: 'Mix',
        values: mixGenres,
        defaultTitle: 'Your Mix',
        aiContext: `A curated mix of genres including ${mixGenres.join(', ')}. Title MUST be abstract (e.g., "Genre Blender", "Variety Pack") unless all genres are similar. Do NOT pick just one genre to name the section.`,
      },
      // banner-1
      {
        type: 'banner',
        filters: { genre: featuredGenre, withBanner: true },
        value: featuredGenre,
      },
      // slider-1 (Dynamic: Studio or Genre)
      useStudioForSlider1
        ? {
            type: 'slider',
            filters: { studio: slider1Studio },
            value: slider1Studio,
            defaultTitle: 'Studio Spotlight',
            aiContext: `A showcase of anime from the studio ${slider1Studio}. Title should highlight the studio's name or reputation (e.g., "Made by ${slider1Studio}", "${slider1Studio} Masterpieces").`,
          }
        : {
            type: 'slider',
            filters: { genre: recommendedGenre },
            value: recommendedGenre,
            defaultTitle: 'Recommended',
            aiContext: `A recommendation slider for the ${recommendedGenre} genre. Title should be catchy and related to ${recommendedGenre}.`,
          },
      // slider-2
      {
        type: 'slider',
        filters: { type: topRatedType },
        value: topRatedType,
        defaultTitle: 'Top Rated',
        aiContext: `Top rated anime of format: ${topRatedType}. Title MUST focus on the format (e.g., "Movie Night", "TV Series"). ABSOLUTELY NO specific genres in the title.`,
      },
      // banner-2
      {
        type: 'banner',
        filters: { genre: discoverGenre, withBanner: true },
        value: discoverGenre,
      },
      // slider-3 (Dynamic: Year or Genre)
      useYearForSlider3
        ? {
            type: 'slider',
            filters: { year: slider3Year },
            value: slider3Year?.toString(),
            defaultTitle: `Best of ${slider3Year}`,
            aiContext: `Top anime from the year ${slider3Year}. Title should be nostalgic or specific to that year (e.g., "Flashback to ${slider3Year}", "${slider3Year} Rewind").`,
          }
        : {
            type: 'slider',
            filters: { genre: trendingGenre },
            value: trendingGenre,
            defaultTitle: 'Trending',
            aiContext: `Trending anime in the ${trendingGenre} genre. Title should sound popular or buzzing.`,
          },
      // collection-2
      {
        type: 'collection',
        filters: { genre: 'Explore' },
        value: 'Explore',
        values: exploreGenres,
        defaultTitle: 'Explore',
        aiContext: `An exploration collection with diverse genres: ${exploreGenres.join(', ')}. Title MUST be abstract (e.g., "Hidden Gems", "Anime Buffet") unless all genres are similar. Do NOT pick just one genre to name the section.`,
      },
      // banner-3 (Dynamic: Movie or Genre Banner)
      useMovieForBanner3
        ? {
            type: 'banner',
            filters: { type: 'Movie', withBanner: true },
            value: 'Movies',
          }
        : {
            type: 'banner',
            filters: { genre: banner3Genre, withBanner: true },
            value: banner3Genre,
          },
      // slider-4
      {
        type: 'slider',
        filters: { genre: moreGenre, type: 'TV' }, // Combo: Genre + Type (Series)
        value: moreGenre,
        defaultTitle: 'More to Watch',
        aiContext: `More ${moreGenre} anime series to keep watching.`,
      },
    ]
  },
}
