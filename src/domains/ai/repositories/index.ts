import { model } from '@libs/gemini'
import { type Tool } from '@google/generative-ai'

export const aiRepository = {

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await model.generateContent(prompt)
      return response.response.text().trim()
    } catch (error) {
      console.error('[AIRepository.generateText] Error:', error)
      return ''
    }
  },


  async generateJSON<T>(prompt: string): Promise<T | null> {
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })

      const text = response.response.text()
      return JSON.parse(text) as T
    } catch (error) {
      console.error('[AIRepository.generateJSON] Error:', error)
      return null
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
