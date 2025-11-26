import { aiRepository } from '@ai/repositories'
import type { Tool } from '@google/generative-ai'
import { AppError, isAppError } from '@shared/errors'

export const aiService = {
  /**
   * Genera un resumen corto del texto dado.
   */
  async summarize(content: string) {
    if (!content.trim()) {
      throw AppError.validation('Content cannot be empty')
    }

    const summaryPrompt = `
      Eres un asistente experto en redacción.
      Resume el siguiente texto en un máximo de 3 líneas, manteniendo las ideas principales:
      \n\n${content}
    `

    try {
      return await aiRepository.generateText(summaryPrompt)
    } catch (error) {
      if (isAppError(error)) throw error
      throw AppError.externalApi('Failed to summarize content', {
        originalError: error,
      })
    }
  },

  /**
   * Analiza un texto y devuelve las palabras clave.
   */
  async extractKeywords(content: string) {
    const keywordPrompt = `
      Extrae las 5 palabras clave más relevantes del siguiente texto y devuélvelas separadas por comas:
      \n\n${content}
    `

    try {
      const result = await aiRepository.generateText(keywordPrompt)
      return result
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    } catch (error) {
      if (isAppError(error)) throw error
      throw AppError.externalApi('Failed to extract keywords', {
        originalError: error,
      })
    }
  },

  /**
   * Genera recomendaciones de anime o datos estructurados
   */
  async generateRecommendations(prompt: string) {
    const schemaPrompt = `
      A partir del siguiente contexto, genera un JSON con las siguientes propiedades:
      - "recommendations": una lista de objetos con campos { id, title, reason }
      - "criteria": breve descripción de cómo se generaron
      \n\nContexto:\n${prompt}
    `

    try {
      return await aiRepository.generateJSON(schemaPrompt)
    } catch (error) {
      if (isAppError(error)) throw error
      throw AppError.externalApi('Failed to generate recommendations', {
        originalError: error,
      })
    }
  },

  /**
   * Genera y parsea un JSON a partir de un prompt arbitrario.
   * Retorna null si falla el parseo o la llamada.
   */
  async generateJSON<T = any>(prompt: string): Promise<T | null> {
    try {
      return await aiRepository.generateJSON<T>(prompt)
    } catch (error) {
      if (isAppError(error)) throw error
      throw AppError.externalApi('Failed to generate JSON from AI', {
        originalError: error,
      })
    }
  },

  /**
   * Llama a una función dinámica registrada como Tool en Gemini
   */
  async callFunction(prompt: string, tool: Tool, functionName: string) {
    if (!tool || !functionName) {
      throw AppError.validation('Tool and functionName are required')
    }

    try {
      const response = await aiRepository.functionCall(
        prompt,
        tool,
        functionName
      )
      return response
    } catch (error) {
      if (isAppError(error)) throw error
      throw AppError.externalApi('AI function call failed', {
        functionName,
        originalError: error,
      })
    }
  },
}
