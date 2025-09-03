import { model } from '@libs/gemini'

export const formatAbout = async (about: string) => {
  const prompt = `Eres un formateador de datos.
    Toma el siguiente texto (campo "about" de un personaje de anime/manga o de una persona relacionada con la industria del anime: actor de voz, cantante, staff, director, etc.)
    y devuelve SOLO un objeto JSON válido, sin ningún marcador Markdown ni comentarios, exactamente así:

    {
      "description": "texto narrativo libre sobre la persona o personaje",
      "members": [
        { "name": "Nombre del miembro", "role": "rol en la banda" }
      ],
      "details": {
        "clave": "valor"
      },
      "favorites": {
        "category": ["valores..."]
      },
      "awards": ["lista de premios"],
      "links": {
        "twitter": "...",
        "instagram": "...",
        "profile": "...",
        "website": "..."
      }
    }

    Reglas:
    - "description": incluye la biografía o historia de vida (para personas) o la narrativa de historia/contexto (para personajes).
    - "members": solo se usa si el texto lista integrantes de una banda o grupo.
    - "details": contiene pares clave:valor de información personal o física:
       • Personas: birthplace, birth_name, height, blood_type, hometown, died, education, etc.
       • Personajes: birthdate, zodiac_sign, age, occupation, height, weight, hair_color, eye_color, likes, dislikes, alias, nickname, etc.
    - "favorites": si aparecen secciones como "Favorites", "Hobbies", "Favorite roles", "Likes", "Dislikes", etc., organízalas en arrays por categoría.
    - "awards": lista de premios mencionados, cada premio en un string independiente.
    - "links": redes sociales o páginas oficiales (twitter, instagram, website, profile).
    - Si una sección no existe, devuélvela vacía.
    - Usa claves en inglés y snake_case.
    - No inventes información, usa solo lo que aparezca en el texto.
    - No uses bloques \`\`\` ni etiquetas de formato, devuelve solo el objeto JSON puro.

    Texto a procesar:
    """
    ${about}
    """
    `

  console.log(about)
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // 🔑 Sanitizar: quitar bloque de markdown si aún lo manda
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    return JSON.parse(clean)
  } catch (error) {
    console.error(error)
    throw new Error(error as string)
  }
}
