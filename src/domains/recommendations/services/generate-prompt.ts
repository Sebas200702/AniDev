import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'
import type { GeneratePromptProps } from 'domains/ai/types'

const logger = createContextLogger('RecommendationsService')

export const generatePrompt = async ({
  userProfile,
  calculatedAge,
  context,
  jikanRecommendations,
  favoriteAnime,
}: GeneratePromptProps) => {
  try {
    let contextInstructions = ''
    let recommendationCount = context.count || 12

    switch (context.type) {
      case 'current_search':
        contextInstructions = `
## CONTEXT: CURRENT SEARCH
User is searching for: "${context.data?.searchQuery}"
- Focus on anime that directly match or strongly relate to the search term.
- Include synonyms, related themes, and connected works.
- If it's a genre, 80% should be from that genre.
- If it's a studio, focus mainly on works from that studio.
- If it's a character/seiyuu, include anime they appear in.
    `
        break
      case 'currently_watching':
        contextInstructions = `
## CONTEXT: CURRENTLY WATCHING
User is watching: "${context.data?.currentAnime}"
- Recommend anime with similar tone, themes, or subgenres.
- Include works by the same studio/director.
- Look for similar protagonists or dynamics.
- Prioritize titles that complement the current viewing.
    `
        break
      case 'mood_based':
        contextInstructions = `
## CONTEXT: MOOD-BASED
User mood: "${context.data?.mood}"
- Adapt recommendations to current mood.
- Relaxed: slice of life, iyashikei, light comedies.
- Excited: action, adventure, intense shounen.
- Nostalgic: classics, retro anime, coming-of-age.
- Sad: drama, romance, emotional works.
- Fun: comedies, parodies, absurd humor.
    `
        break
      case 'similar_to':
        contextInstructions = `
## CONTEXT: SIMILAR TO
Find anime similar to: "${context.data?.referenceAnime}" (exclude it from results)
- Analyze deeply: genre, themes, narrative style, visuals.
- Include works by same director/studio.
- Look for similar plots or protagonists.
- Consider era and demographic.
    `
        break
      case 'seasonal':
        contextInstructions = `
## CONTEXT: SEASONAL
Season: "${context.data?.season}"
- Focus on anime from the current/upcoming season.
- Include ongoing shows and seasonal hits.
- Mix sequels and new titles.
- Prioritize current high-rated works.
    `
        break
      case 'marathon':
        contextInstructions = `
## CONTEXT: MARATHON
User wants a binge session.
- Recommend long series (50+ eps) or full sagas.
- Include multi-season anime.
- Works perfect for continuous viewing.
- Strong story arcs and satisfying conclusions.
    `
        recommendationCount = 8
        break
      case 'quick_watch':
        contextInstructions = `
## CONTEXT: QUICK WATCH
Available time: "${context.data?.timeAvailable}"
- Short series (≤12 eps), movies, OVAs, specials.
- Self-contained stories.
- Avoid long-running titles.
    `
        break
      default:
        contextInstructions = `
## CONTEXT: GENERAL RECOMMENDATIONS
Diverse recommendations based on full user profile.
    `
        recommendationCount = 24
        break
    }

    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    const timeContext = {
      mood: hour < 12 ? 'energetic' : hour < 18 ? 'relaxed' : 'introspective',
      period:
        hour < 6
          ? 'early morning'
          : hour < 12
            ? 'morning'
            : hour < 18
              ? 'afternoon'
              : 'night',
      weekType: day < 5 ? 'weekday' : 'weekend',
    }

    const strategies = [
      {
        id: 'hidden_gems',
        title: 'Hidden Gems',
        focus: 'High-quality underrated anime',
        dist: '40% favorites, 60% discoveries',
      },
      {
        id: 'auteur_focus',
        title: 'Auteur Showcase',
        focus: 'Visionary directors & masterpieces',
        dist: '2–3 directors, ≤2 works each',
      },
      {
        id: 'studio_tour',
        title: 'Studio Expedition',
        focus: 'Variety of top studios',
        dist: '3–4 studios, contrasting styles',
      },
      {
        id: 'emotional_curve',
        title: 'Emotional Spectrum',
        focus: 'Balanced emotional journey',
        dist: 'Equal mix of moods',
      },
    ]
    const selectedStrategy =
      strategies[Math.floor(Math.random() * strategies.length)]

    const jikanSection = jikanRecommendations?.mal_ids?.length
      ? `
## OFFICIAL JIKAN RECOMMENDATIONS
Base anime: ${favoriteAnime || context.data.currentAnime}
- ${jikanRecommendations.mal_ids.length} official MAL recommendations
- Compare generated list with Jikan’s → keep best matches & improve with user profile
${favoriteAnime ? '- Treat as high-priority favorite' : ''}
  `
      : ''

    return `
# SMART ANIME RECOMMENDER v3.0 (React-style generation)

## USER PROFILE
${userProfile.name} (${calculatedAge} y/o, ${userProfile.gender})
- Level: ${userProfile.fanatic_level} | Watch frequency: ${userProfile.frequency_of_watch}
- Favorite genres: ${userProfile.favorite_genres.join(', ')}
- Favorite studios: ${userProfile.favorite_studios.join(', ')}
- Preferred format: ${userProfile.preferred_format}
- Watched: ${userProfile.watched_animes.slice(0, 6).join(', ')}${userProfile.watched_animes.length > 6 ? ` (+${userProfile.watched_animes.length - 6} more)` : ''}
- Favorites: ${userProfile.favorite_animes.join(', ')}
${context.data.currentAnime ? `- Currently watching: ${context.data.currentAnime}` : ''}

${contextInstructions}
${jikanSection}

## TIME CONTEXT
- ${timeContext.period} (${hour}:00) — Mood: ${timeContext.mood}
- ${timeContext.weekType}

## CURATION STRATEGY: ${selectedStrategy.title}
- Focus: ${selectedStrategy.focus}
- Distribution: ${selectedStrategy.dist}

## RULES
- EXCLUDE all watched & favorite anime from final list (to avoid repeats).
- No duplicate IDs.
- Min MAL score: 7.8.
- Max 2 anime per studio (unless strategy-specific).
- Keep decade & genre diversity.
- FAVORITE PRIORITY: Always bias towards titles similar to favorites in tone, genre, or studio.

## REACT-LIKE FLOW
1️⃣ Generate new recommendations based purely on profile + context + strategy.
2️⃣ Compare with Jikan recommendations (if available). Keep overlaps & upgrade list with Jikan’s strongest suggestions.
3️⃣ Reflect on results — adjust for balance, diversity, and stronger alignment with favorites.
4️⃣ Return the final ${recommendationCount} MAL_ID list.
`
  } catch (error) {
    logger.error('[RecommendationsService.generatePrompt] Error:', { error })
    if (isAppError(error)) {
      throw error
    }
    throw AppError.invalidState('Failed to generate prompt', {
      originalError: error,
    })
  }
}
