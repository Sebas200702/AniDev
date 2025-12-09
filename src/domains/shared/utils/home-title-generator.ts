import { aiService } from '@ai/services'
import { createContextLogger } from '@libs/pino'

const logger = createContextLogger('HomeTitleGenerator')

const buildPrompt = (
  sectionsDescription: string,
  userGenres: string[],
  age: number
) => `
    As an expert anime curator, create SHORT, EXCITING, and UNIQUE titles (2-4 words) for these home page sections.

    Target Audience: ${age} years old.
    User Context (Preferences): ${userGenres.join(', ') || 'General Anime'}

    Sections to name:
    ${sectionsDescription}

    CRITICAL RULES:
    1. The title MUST describe the SPECIFIC CONTENT of the section based on the "Context/Instruction" provided.
    2. Do NOT use the user's preferences to name a section if the section content is different.
    3. If the instruction says "ABSOLUTELY NO specific genres", you MUST NOT include words like "Action", "Romance", "GL", "BL", "Horror" in the title.
    4. If the content is a specific Format (TV, Movie, OVA), the title MUST reflect that format (e.g., "Cinematic Experience" for Movies, "Bonus Content" for OVAs).
    5. If the content is "Action", use words like "Fight", "Battle", "Adrenaline".
    6. If the content is "Romance", use words like "Love", "Heart", "Feelings".
    7. For "Mix" or "Explore", try to find a common theme among the values, or use a broad exciting title like "Weekend Marathon" or "Hidden Gems".
    8. For "recommendations", use personal titles like "Picked for You" or "Your Next Obsession".
    9. For "2025", use titles like "Best of 2025" or "New This Year".
    10. If the content is a specific Studio, the title MUST mention the studio name or "Masterpieces".
    11. If the content is a specific Year (other than 2025), use nostalgic titles like "Classics of [Year]" or "[Year] Rewind".

    Return ONLY a JSON object: { "titles": ["Title 1", "Title 2", ...] }
`

export const HomeTitleGenerator = {
  /**
   * Uses AI to generate creative titles
   */
  generateCreativeTitles: async (
    slots: any[],
    userGenres: string[],
    age: number
  ) => {
    // Filter slots that need AI titles (have aiContext)
    const slotsToName = slots
      .map((s, i) => ({ ...s, originalIndex: i }))
      .filter((s) => s.aiContext)

    if (slotsToName.length === 0) return []

    const sectionsDescription = slotsToName
      .map((s, i) => {
        const valuesText = s.values ? `(${s.values.join(', ')})` : ''
        const filtersText = s.filters ? JSON.stringify(s.filters) : ''
        return `${i + 1}. Content: ${s.value} ${valuesText} (Type: ${s.type}). Filters: ${filtersText}.\n   Context/Instruction: ${s.aiContext}`
      })
      .join('\n')

    const prompt = buildPrompt(sectionsDescription, userGenres, age)

    try {
      const response = await aiService.generateJSON<{ titles: string[] }>(
        prompt
      )
      const generatedTitles = response?.titles || []

      // Map generated titles back to original slot indices
      const finalTitles = new Array(slots.length).fill(undefined)
      for (const [i, slot] of slotsToName.entries()) {
        if (generatedTitles[i]) {
          finalTitles[slot.originalIndex] = generatedTitles[i]
        }
      }

      return finalTitles
    } catch (e) {
      logger.warn('AI title generation failed, using defaults', e)
      return []
    }
  },
}
