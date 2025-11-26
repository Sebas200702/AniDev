import { type Tool } from '@google/generative-ai'
import { model } from '@libs/gemini'
import { AppError } from '@shared/errors'

export const aiRepository = {
  async generateText(prompt: string): Promise<string> {
    const response = await model.generateContent(prompt)
    const text = response.response.text().trim()

    if (!text) {
      throw AppError.externalApi('Empty response from AI model', { prompt })
    }

    return text
  },

  async generateJSON<T>(prompt: string): Promise<T | null> {
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })

      const text = response.response.text()

      if (!text) {
        throw AppError.externalApi('Empty JSON response from AI model', {
          prompt,
        })
      }

      try {
        return JSON.parse(text) as T
      } catch {
        throw AppError.externalApi('Failed to parse AI JSON response', {
          prompt,
          raw: text,
        })
      }
    } catch (error) {
      if (AppError && typeof AppError.externalApi === 'function') {
        if (error instanceof Error && error.name === 'ExternalApiError') {
          throw error
        }
        throw AppError.externalApi('AI JSON generation failed', {
          prompt,
          originalError: error,
        })
      }

      // Fallback if AppError is not available for some reason
      if (error instanceof Error) {
        throw error
      }

      throw new Error('AI JSON generation failed')
    }
  },

  async summarizeText(content: string): Promise<string> {
    const prompt = `Resume el siguiente texto en 3 líneas o menos:\n\n${content}`
    return await this.generateText(prompt)
  },

  async extractKeywords(content: string): Promise<string[]> {
    const prompt = `
      Extrae las 5 palabras clave más importantes del siguiente texto y devuélvelas como lista separada por comas:
      \n\n${content}
    `
    const result = await this.generateText(prompt)
    return result
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
  },

  async functionCall(prompt: string, functionTool: Tool, functionName: string) {
    try {
      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `
                  ${prompt}
                  INSTRUCCIÓN CRÍTICA: Debes usar la función ${functionName} y responder SOLO invocándola.
                `,
              },
            ],
          },
        ],
        tools: [functionTool],
      })

      return response
    } catch (error) {
      console.error(`[AIRepository.functionCall:${functionName}] Error:`, error)
      throw error
    }
  },
}
