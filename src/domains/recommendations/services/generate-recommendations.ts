import { aiService } from '@ai/services'
import { createContextLogger } from '@libs/pino'
import {
  functionTool,
  type GenerateRecommendationsProps,
} from '@recommendations/types'
import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { getRecommendations } from './get-recommendations'

const logger = createContextLogger('RecommendationsService')

export const generateRecommendations = async ({
  context,
  prompt,
  jikanRecommendations,
}: GenerateRecommendationsProps): Promise<ApiResponse<any[]>> => {
  try {
    const response = await aiService.callFunction(
      prompt,
      functionTool,
      'fetch_recommendations'
    )

    const functionCall =
      response.response?.candidates?.[0]?.content?.parts?.find(
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

    return await getRecommendations({
      mal_ids: args.mal_ids,
      minResults: context.count ?? 24,
      currentAnimeId: context.data.currentAnime
        ? Number(context.data.currentAnime)
        : undefined,
      jikanRecommendations,
      parentalControl: context.parentalControl,
    })
  } catch (error) {
    logger.error('[RecommendationsService.generateRecommendations] Error:', {
      error,
    })
    if (isAppError(error)) {
      throw error
    }
    throw AppError.invalidState('Failed to generate recommendations', {
      originalError: error,
    })
  }
}
