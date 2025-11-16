import { baseTitle, baseUrl } from '@shared/utils/base-url'

import { MetadataService } from '@shared/services/metadata-service'

interface MetadataResult {
  title: string
  description: string
  image: string
}

interface MetadataConfig {
  endpoint: string
  param: string
  value: string
  titleFormatter?: (data: any) => string | undefined
  descriptionFormatter?: (data: any) => string | undefined
  imageExtractor?: (data: any) => string | undefined
}

/**
 * Fetches and formats metadata for different content types using the metadata service.
 *
 * @description This utility function has been refactored to use the MetadataService,
 * which leverages domain-specific repositories for data fetching. This provides better
 * separation of concerns and follows the domain-driven design pattern of the application.
 *
 * @deprecated Consider using MetadataService directly for new implementations
 *
 * @param {MetadataConfig} config - Configuration for metadata extraction
 * @param {string} defaultTitle - Default title if extraction fails
 * @param {string} defaultDescription - Default description if extraction fails
 * @param {string} defaultImage - Default image if extraction fails
 * @returns {Promise<MetadataResult>} The extracted and formatted metadata
 */
export const extractMetadata = async (
  config: MetadataConfig,
  defaultTitle: string = baseTitle,
  defaultDescription: string = 'AniDev is a modern anime streaming and exploration platform. It offers dynamic experiences for discovering, searching, and enjoying top animes.',
  defaultImage: string = `${baseUrl}/og-image.png`
): Promise<MetadataResult> => {
  try {
    // Determine the type based on endpoint
    if (config.endpoint.includes('getAnimeMetadatas')) {
      return await MetadataService.getAnimeMetadata(Number(config.value))
    }

    if (config.endpoint.includes('getMusicInfo')) {
      return await MetadataService.getMusicMetadata(Number(config.value))
    }

    if (config.endpoint.includes('getCharacter')) {
      // Extract character ID from slug (format: name_id)
      const lastUnderscoreIndex = config.value.lastIndexOf('_')
      const characterId =
        lastUnderscoreIndex === -1
          ? Number(config.value)
          : Number(config.value.slice(lastUnderscoreIndex + 1))

      return await MetadataService.getCharacterMetadata(characterId)
    }

    if (config.endpoint.includes('getArtistInfo')) {
      return await MetadataService.getArtistMetadata(config.value)
    }

    // Fallback to default metadata
    return {
      title: defaultTitle,
      description: defaultDescription,
      image: defaultImage,
    }
  } catch (error) {
    console.error(`Error extracting metadata from ${config.endpoint}:`, error)
    return {
      title: defaultTitle,
      description: defaultDescription,
      image: defaultImage,
    }
  }
}

/**
 * Predefined metadata configurations for different content types
 */
export const METADATA_CONFIGS = {
  anime: {
    endpoint: '/api/getAnimeMetadatas',
    param: 'id',
    titleFormatter: (data: any) => data.title,
    descriptionFormatter: (data: any) => data.description,
    imageExtractor: (data: any) => data.image,
  },
  music: {
    endpoint: '/api/music/getMusicInfo',
    param: 'themeId',
    titleFormatter: (data: any) => `${data[0]?.song_title} - ${baseTitle}`,
    descriptionFormatter: (data: any) => {
      const track = data[0]
      if (!track) return undefined
      return `${track.song_title} performed by ${track.artist_name}${
        track.anime_title ? ` for the anime ${track.anime_title}` : ''
      }. Listen now on AniDev!`
    },
    imageExtractor: (data: any) => data[0]?.image,
  },
  character: {
    endpoint: '/api/characters/getCharacter',
    param: 'slug',
    titleFormatter: (data: any) =>
      `${data.character?.character_name} - ${baseTitle}`,
    descriptionFormatter: (data: any) => {
      const char = data.character
      if (!char) return undefined
      const about = char.character_about
        ? ` ${char.character_about.slice(0, 150)}...`
        : ''
      const kanjiPart = char.character_name_kanji
        ? ` (${char.character_name_kanji})`
        : ''
      return `Learn about ${char.character_name}${kanjiPart}.${about}`
    },
    imageExtractor: (data: any) => data.character?.character_image_url,
  },
  artist: {
    endpoint: '/api/getArtistInfo',
    param: 'artistName',
    titleFormatter: (data: any) =>
      data.data?.name ? `${data.data.name} - ${baseTitle}` : undefined,
    descriptionFormatter: (data: any) => {
      const about: string | undefined = data.data?.about
      if (!about) return undefined
      const trimmed = about.slice(0, 150)
      return `${trimmed}${about.length > 150 ? '...' : ''}`
    },
    imageExtractor: (data: any) => data.data?.image_url,
  },
} as const
