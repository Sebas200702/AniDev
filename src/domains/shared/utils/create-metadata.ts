import { MetadataService } from '@shared/services/metadata-service'
import { baseTitle, baseUrl } from '@shared/utils/base-url'

interface Props {
  title?: string
  description?: string
  image?: string
  animeId?: number
  themeId?: string
  characterId?: string
  artistName?: string
  slug?: string
}

interface ResolvedMetadata {
  title: string
  description: string
  image: string
}

/**
 * Crea los metadatos finales para el <head>
 * Prioridad:
 * artist > character > theme > anime > custom props > defaults
 */
export const createMetadata = async (
  props: Props
): Promise<ResolvedMetadata> => {
  const defaults: ResolvedMetadata = {
    title: props.title || baseTitle,
    description:
      props.description ||
      'AniDev is a modern anime streaming and exploration platform. It offers dynamic experiences for discovering, searching, and enjoying top animes.',
    image: props.image || `${baseUrl}/og-image.png`,
  }

  try {
    const serviceMetadata = await resolveMetadataFromService(props)

    return {
      ...defaults,
      ...serviceMetadata,
    }
  } catch (error) {
    console.error('[createMetadata] Failed to resolve metadata:', error)
    return defaults
  }
}

const resolveMetadataFromService = async (
  props: Props
): Promise<Partial<ResolvedMetadata>> => {
  const { animeId, themeId, characterId, artistName, slug } = props
  if (artistName) {
    return MetadataService.getArtistMetadata(artistName)
  }

  if (characterId) {
    const charId = resolveCharacterId(characterId, slug)
    return MetadataService.getCharacterMetadata(charId)
  }

  if (themeId) {
    return MetadataService.getMusicMetadata(Number(themeId))
  }

  if (animeId) {
    return MetadataService.getAnimeMetadata(animeId)
  }

  return {}
}

const resolveCharacterId = (characterId: string, slug?: string) => {
  if (!slug) return Number(characterId)

  const lastUnderscoreIndex = slug.lastIndexOf('_')

  if (lastUnderscoreIndex === -1) {
    return Number(characterId)
  }

  return Number(slug.slice(lastUnderscoreIndex + 1))
}
