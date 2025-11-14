
import { model } from '@libs/gemini'
import { type GenerateRecommendationsProps, functionTool } from '@recomendations/types'
import { fetchRecomendations } from './fetch-recomendations'

export const generateUserRecomendations = async ({
  context,
  prompt,
  jikanRecommendations,
}:GenerateRecommendationsProps) => {
  const response = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${prompt}\n\nINSTRUCCIÓN CRÍTICA: Debes usar "fetch_recommendations" y generar una lista de IDs (mal_ids) de anime. Responde ÚNICAMENTE con la llamada a la función "fetch_recommendations".`,
          },
        ],
      },
    ],
    tools: [functionTool],
  })

  const functionCall = response.response?.candidates?.[0]?.content?.parts?.find(
    (part) => part.functionCall
  )?.functionCall

  if (!functionCall) {
    throw new Error(
      'El modelo no devolvió una llamada a fetch_recommendations.'
    )
  }

  if (functionCall.name !== 'fetch_recommendations') {
    throw new Error(
      `El modelo intentó llamar a una función no soportada: ${functionCall.name}`
    )
  }

    const args = functionCall.args as { mal_ids?: string[] }

  if (!args?.mal_ids?.length) {
    throw new Error('No se generaron mal_ids en la respuesta del modelo.')
  }


  const result = await fetchRecomendations({
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
