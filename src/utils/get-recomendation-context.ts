import type { RecommendationContext } from 'types'

export const generateContextualPrompt = (
  userProfile: any,
  calculatedAge: number,
  context: RecommendationContext,
  currentAnime?: string
): string => {
  const baseProfile = `
      ## PERFIL DEL USUARIO:
      **Información Personal:**
      - Nombre: ${userProfile.name} ${userProfile.last_name}
      - Género: ${userProfile.gender}
      - Edad: ${calculatedAge} años (nacido el ${userProfile.birthday})

      **Preferencias de Anime:**
      - Animes Favoritos: ${userProfile.favorite_animes.join(', ')}
      - Géneros Preferidos: ${userProfile.favorite_genres.join(', ')}
      - Estudios Favoritos: ${userProfile.favorite_studios.join(', ')}
      - Formato Preferido: ${userProfile.preferred_format}

      **Hábitos de Consumo:**
      - Frecuencia de Visualización: ${userProfile.frequency_of_watch}
      - Nivel de Fanatismo: ${userProfile.fanatic_level}
      - Historial de Búsqueda: ${userProfile.search_history}

      **Anime Ya Consumido:**
      - Animes Vistos: ${userProfile.watched_animes.join(', ')}
    `

  let contextualInstructions = ''
  let recommendationCount = context.count || 12

  switch (context.type) {
    case 'current_search':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: BÚSQUEDA ACTUAL
          El usuario está buscando: "${context.data?.searchQuery}"

          **ENFOQUE ESPECIAL:**
          - Prioriza animes que coincidan directamente con la búsqueda actual
          - Incluye variaciones y sinónimos del término buscado
          - Considera animes relacionados temáticamente con la búsqueda
          - Si es un género, enfócate 80% en ese género específico
          - Si es un estudio, incluye principalmente animes de ese estudio
          - Si es un personaje/seiyuu, busca animes donde aparezcan
        `
      break

    case 'currently_watching':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: ANIME ACTUAL
          El usuario está viendo actualmente: "${context.data?.currentAnime}"

          **ENFOQUE ESPECIAL:**
          - Recomienda animes similares en tono y temática
          - Considera el mismo género o subgénero
          - Incluye animes del mismo estudio o director si es posible
          - Busca animes con protagonistas o dinámicas similares
          - Prioriza animes que complementen la experiencia actual
        `
      break

    case 'mood_based':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: ESTADO DE ÁNIMO
          El usuario busca algo para su estado de ánimo: "${context.data?.mood}"

          **ENFOQUE ESPECIAL:**
          - Adapta las recomendaciones al estado emocional actual
          - Para "relajado": slice of life, iyashikei, comedias ligeras
          - Para "emocionado": action, adventure, shounen intensos
          - Para "nostálgico": clásicos, animes retro, coming of age
          - Para "triste": drama, romance, animes emotivos
          - Para "divertido": comedias, parodies, animes absurdos
        `
      break

    case 'similar_to':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: SIMILAR A
          Buscar animes similares a: "${context.data?.referenceAnime}" (No incluir el anime de referencia en las recomendaciones)

          **ENFOQUE ESPECIAL:**
          - Analiza profundamente el anime de referencia
          - Considera género, temas, estilo narrativo y visual
          - Incluye animes del mismo director/estudio
          - Busca animes con protagonistas o tramas similares
          - Considera la época y el target demográfico
        `
      break

    case 'seasonal':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: TEMPORADA
          Recomendaciones para la temporada: "${context.data?.season}"

          **ENFOQUE ESPECIAL:**
          - Enfócate en animes de la temporada actual o próxima
          - Incluye animes que están en emisión
          - Considera animes estacionales populares
          - Incluye tanto continuaciones como series nuevas
          - Prioriza animes con buen recibimiento actual
        `
      break

    case 'marathon':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: MARATÓN
          El usuario quiere hacer un maratón de anime

          **ENFOQUE ESPECIAL:**
          - Recomienda series largas (50+ episodios) o sagas completas
          - Incluye animes con múltiples temporadas
          - Considera animes perfectos para ver de corrido
          - Prioriza animes con arcos narrativos satisfactorios
          - Incluye tanto shounen largos como series episódicas
        `
      recommendationCount = 8
      break

    case 'quick_watch':
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: VISUALIZACIÓN RÁPIDA
          Tiempo disponible: "${context.data?.timeAvailable}"

          **ENFOQUE ESPECIAL:**
          - Prioriza animes cortos (12 episodios o menos)
          - Incluye películas de anime
          - Considera OVAs y especiales
          - Busca animes con historias autoconclusivas
          - Evita series largas o con múltiples temporadas
        `
      break

    default:
      contextualInstructions = `
          ## CONTEXTO ESPECÍFICO: RECOMENDACIONES GENERALES
          Genera recomendaciones diversas basadas en el perfil completo del usuario.
        `
      recommendationCount = 24
      break
  }

  // Sistema de variabilidad dinámica mejorado
  const currentDate = new Date()
  const hourOfDay = currentDate.getHours()
  const dayOfWeek = currentDate.getDay()
  const sessionId = Math.floor(Math.random() * 1000)

  // Factores contextuales dinámicos
  const timeContext = {
    mood:
      hourOfDay < 12
        ? 'energético'
        : hourOfDay < 18
          ? 'relajado'
          : 'introspectivo',
    period:
      hourOfDay < 6
        ? 'madrugada'
        : hourOfDay < 12
          ? 'mañana'
          : hourOfDay < 18
            ? 'tarde'
            : 'noche',
    weekType: dayOfWeek < 5 ? 'día laboral' : 'fin de semana',
  }

  const explorationStrategies = [
    {
      id: 'hidden_gems',
      title: 'Cazador de Joyas Ocultas',
      description: 'Animes excepcionales con scores 7.5+ pero <100k miembros',
      distribution: '40% géneros favoritos, 60% descubrimientos sorprendentes',
      focus:
        'calidad sobre popularidad, directores emergentes, estudios boutique',
    },
    {
      id: 'temporal_journey',
      title: 'Viajero del Tiempo Anime',
      description: 'Expedición cronológica por diferentes eras del anime',
      distribution: '25% cada década (90s, 2000s, 2010s, 2020s)',
      focus:
        'evolución del medio, clásicos vs modernos, nostalgia vs innovación',
    },
    {
      id: 'auteur_showcase',
      title: 'Exposición de Autores',
      description: 'Enfoque en directores visionarios y sus obras maestras',
      distribution: '2-3 directores únicos, máximo 2 obras por director',
      focus: 'Miyazaki, Shinkai, Kon, Yuasa, Yamada, Ikuhara, Watanabe',
    },
    {
      id: 'studio_expedition',
      title: 'Expedición de Estudios',
      description: 'Tour por la diversidad de estudios de animación',
      distribution: '3-4 estudios diferentes, estilos contrastantes',
      focus: 'Ghibli, Madhouse, Bones, Trigger, WIT, MAPPA, P.A.Works',
    },
    {
      id: 'genre_fusion',
      title: 'Fusión de Géneros',
      description: 'Exploración de subgéneros y mezclas inesperadas',
      distribution: '60% híbridos únicos, 40% géneros puros',
      focus: 'cyberpunk slice-of-life, psychological sports, romantic mecha',
    },
    {
      id: 'emotional_spectrum',
      title: 'Espectro Emocional',
      description: 'Viaje emocional completo con balance cuidadoso',
      distribution: '25% inspirador, 25% relajante, 25% intenso, 25% reflexivo',
      focus: 'curva emocional, catarsis, variety pack',
    },
    {
      id: 'cultural_bridge',
      title: 'Puente Cultural',
      description: 'Diversidad cultural y perspectivas internacionales',
      distribution: '70% japonés tradicional, 30% influencias globales',
      focus: 'temas universales, colaboraciones, adaptaciones',
    },
    {
      id: 'thematic_symphony',
      title: 'Sinfonía Temática',
      description: 'Narrativa unificada alrededor de un tema central',
      distribution: 'todas las selecciones conectadas temáticamente',
      focus: 'crecimiento, familia, amistad, superación, identidad',
    },
  ]

  const selectedStrategy =
    explorationStrategies[sessionId % explorationStrategies.length]

  return `
# 🎯 SISTEMA DE CURACIÓN INTELIGENTE v2.0

## 👤 PERFIL COMPLETO DEL USUARIO
**${userProfile.name}** (${calculatedAge} años, ${userProfile.gender})
- 📊 Nivel: ${userProfile.fanatic_level} | Frecuencia: ${userProfile.frequency_of_watch}
- 🎨 Géneros favoritos: ${userProfile.favorite_genres.join(', ')}
- 🏢 Estudios preferidos: ${userProfile.favorite_studios.join(', ')}
- 📺 Formato favorito: ${userProfile.preferred_format}

**HISTORIAL DE CONSUMO:**
- ✅ Vistos: ${userProfile.watched_animes.slice(0, 6).join(', ')}${userProfile.watched_animes.length > 6 ? ` (+${userProfile.watched_animes.length - 6} más)` : ''}
- ⭐ Favoritos: ${userProfile.favorite_animes.join(', ')}
${currentAnime ? `- 🎬 Viendo actualmente: MAL_ID ${currentAnime}` : ''}

## 🌟 CONTEXTO DE SESIÓN
**📋 Tipo de recomendación:** ${context.type.toUpperCase()}
${contextualInstructions}

**⏰ Contexto temporal:**
- 🕐 ${timeContext.period} (${hourOfDay}:00) - Mood ${timeContext.mood}
- 📅 ${timeContext.weekType}
- 🎲 ID de sesión: #${sessionId}

${context.focus ? `**🎪 Elemento especial:** ${context.focus}` : ''}

## 🎨 ESTRATEGIA DE CURACIÓN: "${selectedStrategy.title}"
**📖 Descripción:** ${selectedStrategy.description}
**📊 Distribución:** ${selectedStrategy.distribution}
**🎯 Enfoque:** ${selectedStrategy.focus}

## 🚫 RESTRICCIONES ABSOLUTAS
- ❌ EXCLUIR todos los animes vistos: [${userProfile.watched_animes.join(', ')}]
- ❌ EXCLUIR todos los favoritos: [${userProfile.favorite_animes.join(', ')}]
${currentAnime ? `- ❌ EXCLUIR anime actual (MAL_ID ${currentAnime})` : ''}
- ❌ NO repetir IDs en la lista final

## 📊 COMPOSICIÓN INTELIGENTE
**Por relevancia al perfil:**
- 🎯 ${Math.floor(recommendationCount * 0.65)} animes alineados con preferencias conocidas
- 🔍 ${Math.floor(recommendationCount * 0.25)} animes de exploración guiada
- ⚡ ${recommendationCount - Math.floor(recommendationCount * 0.65) - Math.floor(recommendationCount * 0.25)} animes sorpresa estratégicos

**Por época (flexible según estrategia):**
- 🆕 30-50% modernos (2018-2024)
- 🏛️ 30-40% establecidos (2010-2017)
- 💎 15-25% clásicos (2000-2009)
- 🏺 5-15% vintage (<2000)

**Por popularidad:**
- 🔥 50% reconocidos y accesibles
- 💫 30% populares pero no obvios
- 💎 20% joyas por descubrir

## ⚙️ PARÁMETROS DE CALIDAD
- Score mínimo MyAnimeList: 6.8
- Balance popularidad/originalidad según estrategia
- Máximo 2 animes por estudio (salvo estrategia específica)
- Diversidad de décadas y subgéneros
- Consideration for ${timeContext.mood} mood

## 🎯 INSTRUCCIONES FINALES
Actúa como experto curador creando una selección de ${recommendationCount} animes perfectamente personalizada para ${userProfile.name} usando la estrategia "${selectedStrategy.title}" en este contexto específico de ${timeContext.period}.

**FORMATO DE RESPUESTA:**
Solo MAL_IDs numéricos, uno por línea:

[Tus ${recommendationCount} selecciones cuidadosamente curadas]
    `
}
