import { aiRepository } from '@ai/repositories'
import type { Tool } from '@google/generative-ai'

export const aiService = {
  /**
   * Genera un resumen corto del texto dado.
   */
  async summarize(content: string) {
    if (!content.trim()) throw new Error('El contenido no puede estar vacío')

    const summaryPrompt = `
      Eres un asistente experto en redacción.
      Resume el siguiente texto en un máximo de 3 líneas, manteniendo las ideas principales:
      \n\n${content}
    `

    return await aiRepository.generateText(summaryPrompt)
  },

  /**
   * Analiza un texto y devuelve las palabras clave.
   */
  async extractKeywords(content: string) {
    const keywordPrompt = `
      Extrae las 5 palabras clave más relevantes del siguiente texto y devuélvelas separadas por comas:
      \n\n${content}
    `

    const result = await aiRepository.generateText(keywordPrompt)
    return result
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
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

    return await aiRepository.generateJSON(schemaPrompt)
  },

  /**
   * Genera y parsea un JSON a partir de un prompt arbitrario.
   * Retorna null si falla el parseo o la llamada.
   */
  async generateJSON<T = any>(prompt: string): Promise<T | null> {
    return await aiRepository.generateJSON<T>(prompt)
  },

  /**
   * Llama a una función dinámica registrada como Tool en Gemini
   */
  async callFunction(prompt: string, tool: Tool, functionName: string) {
    if (!tool || !functionName) {
      throw new Error('Tool y functionName son requeridos')
    }

    const response = await aiRepository.functionCall(prompt, tool, functionName)
    return response
  },
}
