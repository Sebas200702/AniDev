import { aiService } from '@ai/services'
import {
  type GenerateRecommendationsProps,
  functionTool,
} from '@recommendations/types'
import { AppError } from '@shared/errors'
import { fetchRecommendations } from './fetch-recommendations'

export const generateUserRecommendations = async ({
  context,
  prompt,
  jikanRecommendations,
}: GenerateRecommendationsProps) => {
  // Use aiService.callFunction which delegates to the repository functionCall wrapper
  const response = await aiService.callFunction(
    prompt,
    functionTool,
    'fetch_recommendations'
  )

  const functionCall = response.response?.candidates?.[0]?.content?.parts?.find(
    (part) => part.functionCall
  )?.functionCall

  if (!functionCall) {
    throw AppError.externalApi(
      'Model did not return a fetch_recommendations function call',
      { context }
    )
  }

  if (functionCall.name !== 'fetch_recommendations') {
    throw AppError.externalApi('Model tried to call unsupported function', {
      functionName: functionCall.name,
    })
  }

  const args = functionCall.args as { mal_ids?: string[] }

  if (!args?.mal_ids?.length) {
    throw AppError.externalApi('Model did not return any mal_ids', {
      context,
    })
  }

  const result = await fetchRecommendations({
    mal_ids: args.mal_ids,
    minResults: context.count ?? 24,
    currentAnimeId: context.data.currentAnime
      ? Number(context.data.currentAnime)
      : undefined,
    jikanRecommendations,
    parentalControl: context.parentalControl,
  })

  return result
}
