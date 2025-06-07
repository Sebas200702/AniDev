import { SchemaType } from '@google/generative-ai'
import { model } from '@libs/gemini'
import { supabase } from '@libs/supabase'
import { checkSession } from '@middlewares/auth'
import { fetchRecomendations } from '@utils/fetch-recomendations'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'

const fetchRecomendationsFunctionDeclaration = {
  name: 'fetch_recommendations',
  description:
    'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      mal_ids: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
        description:
          'Usa las recomendaciones generadas por el modelo para obtener los anime que se encuentren en la base de datos.',
      },
    },
    required: ['mal_ids'],
  },
}

export const GET: APIRoute = checkSession(async ({ request, cookies }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies.get('sb-access-token')?.value,
      refreshToken: cookies.get('sb-refresh-token')?.value,
    })

    const userName = userInfo?.name

    if (!userName) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const { data: userId, error: userIdError } = await supabase
      .from('public_users')
      .select('id')
      .eq('name', userName)

    if (userIdError) {
      return new Response(JSON.stringify({ error: userIdError.message }), {
        status: 500,
      })
    }

    const { data: userProfile, error: userProfileError } = await supabase
      .from('user_profiles')
      .select(
        'search_history(search_history), favorite_animes, favorite_genres, favorite_studios, frequency_of_watch, fanatic_level, gender, last_name, name, preferred_format, birthday, watched_animes'
      )
      .eq('user_id', userId?.[0]?.id)

    if (userProfileError) {
      return new Response(JSON.stringify({ error: userProfileError.message }), {
        status: 500,
      })
    }

    const calculatedAge =
      new Date().getFullYear() - new Date(userProfile[0].birthday).getFullYear()

    const prompt = `
    Eres un especialista en anime con amplio conocimiento de la industria, géneros, estudios y tendencias. Tu objetivo es generar recomendaciones personalizadas y precisas basadas en el análisis detallado del perfil del usuario.

    ## PERFIL DEL USUARIO:
    **Información Personal:**
    - Nombre: ${userProfile[0].name} ${userProfile[0].last_name}
    - Género: ${userProfile[0].gender}
    - Edad: ${calculatedAge} años (nacido el ${userProfile[0].birthday})

    **Preferencias de Anime:**
    - Animes Favoritos: ${userProfile[0].favorite_animes.join(', ')}
    - Géneros Preferidos: ${userProfile[0].favorite_genres.join(', ')}
    - Estudios Favoritos: ${userProfile[0].favorite_studios.join(', ')}
    - Formato Preferido: ${userProfile[0].preferred_format}

    **Hábitos de Consumo:**
    - Frecuencia de Visualización: ${userProfile[0].frequency_of_watch}
    - Nivel de Fanatismo: ${userProfile[0].fanatic_level}
    - Historial de Búsqueda: ${userProfile[0].search_history}

    **Anime Ya Consumido:**
    - Animes Vistos: ${userProfile[0].watched_animes.join(', ')}

    ## INSTRUCCIONES PARA LAS RECOMENDACIONES:

    ### Criterios de Selección:
    1. **EXCLUSIONES OBLIGATORIAS**: No incluir ningún anime de la lista de "Animes Vistos" o "Animes Favoritos"
    2. **COMPATIBILIDAD DE GÉNEROS**: Priorizar animes que compartan al menos 60% de géneros con las preferencias del usuario
    3. **ESTUDIOS PREFERIDOS**: Dar prioridad a animes de los estudios favoritos del usuario
    4. **ANÁLISIS DEMOGRÁFICO**: Considerar la edad y género para recomendar contenido apropiado y atractivo
    5. **PATRONES DE BÚSQUEDA**: Usar el historial de búsqueda para identificar tendencias e intereses emergentes

    ### Estructura de Respuesta Requerida:
    Para cada anime recomendado, proporciona unicamente:
    - **Id de MAL**: Id de MAL del anime(MyAnimeList)


    ### Calidad y Diversidad:
    - Incluir animes de diferentes épocas (clásicos y recientes)
    - Mezclar series populares con joyas ocultas
    - Considerar diferentes formatos si es apropiado (series, películas, OVAs)
    - Asegurar variedad en tonos y temáticas dentro de los géneros preferidos

    ### Formato de Entrega:
    - **EXACTAMENTE 24 recomendaciones ni mas ni menos**


    ### Consideraciones Especiales:
    - Si el usuario tiene nivel de fanatismo alto, incluye animes más específicos o de nicho
    - Si ve anime frecuentemente, puede manejar series más largas o complejas
    - Si es casual, prioriza animes más accesibles y populares

    Genera las recomendaciones ahora, siguiendo estrictamente estas instrucciones.`

    const initialResponse = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const getRecomendations = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                initialResponse.response.candidates?.[0]?.content?.parts?.[0]
                  ?.text || '',
            },
          ],
        },
      ],
      tools: [
        { functionDeclarations: [fetchRecomendationsFunctionDeclaration] },
      ],
    })

    const functionCall =
      getRecomendations.response?.candidates?.[0]?.content?.parts?.[0]
        ?.functionCall

    if (functionCall) {
      let functionResult = await fetchRecomendations(
        Object.values(functionCall.args)?.[0] as string[]
      )

      return new Response(JSON.stringify({ data: functionResult }), {
        status: 200,
      })
    } else {
      return new Response(
        JSON.stringify({
          error: 'Could not generate recommendations. Please try again.',
          recommendations: [],
        }),
        {
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
})
