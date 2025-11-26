import { baseTitle, baseUrl } from '@shared/utils/base-url'

import { AnimeRepository } from '@anime/repositories'
import { ArtistRepository } from '@artist/repositories'
import { CharacterRepository } from '@character/repositories'
import { MusicRepository } from '@music/repositories'
import { createContextLogger } from '@libs/pino'
import type { MetadataResult } from '@shared/types'

const logger = createContextLogger('MetadataService')



type MetadataType = 'anime' | 'music' | 'character' | 'artist'

interface MetadataParams {
  type: MetadataType
  value: string | number
}

/**
 * Metadata Service
 *
 * @description
 * Service responsible for fetching and formatting metadata for different content types
 * (anime, music, character, artist). Uses domain-specific repositories to fetch data
 * and formats it appropriately for SEO purposes.
 *
 * This service abstracts the metadata extraction logic and provides a unified interface
 * for all content types, implementing proper error handling and fallback mechanisms.
 *
 * @features
 * - Unified metadata fetching across different content types
 * - Domain-driven architecture using repositories
 * - Proper error handling with fallback to defaults
 * - SEO-optimized formatting
 * - Type-safe implementation
 */
export const MetadataService = {
  /**
   * Fetches metadata for anime content
   */
  async getAnimeMetadata(animeId: number): Promise<MetadataResult> {
    try {
      const data = await AnimeRepository.getMetadata(animeId)

      return {
        title: `${data.title} - ${baseTitle}`,
        description: data.description || this.getDefaultDescription(),
        image: data.image || this.getDefaultImage(),
      }
    } catch (error) {
      logger.error('[MetadataService.getAnimeMetadata] Error:', error)
      return this.getDefaultMetadata()
    }
  },

  /**
   * Fetches metadata for music content
   */
  async getMusicMetadata(themeId: number): Promise<MetadataResult> {
    try {
      const musicData = await MusicRepository.getMetadata(themeId)

      return {
        title: `${musicData.title} - ${baseTitle}`,
        description: musicData.description || this.getDefaultDescription(),
        image: musicData.image || this.getDefaultImage(),
      }
    } catch (error) {
      logger.error('[MetadataService.getMusicMetadata] Error:', error)
      return this.getDefaultMetadata()
    }
  },

  /**
   * Fetches metadata for character content
   */
  async getCharacterMetadata(characterId: number): Promise<MetadataResult> {
    try {
      const data = await CharacterRepository.getMetadata(characterId)

      return {
        title: `${data.name} - ${baseTitle}`,
        description: data.description || this.getDefaultDescription(),
        image: data.image || this.getDefaultImage(),
      }
    } catch (error) {
      logger.error('[MetadataService.getCharacterMetadata] Error:', error)
      return this.getDefaultMetadata()
    }
  },

  /**
   * Fetches metadata for artist content
   */
  async getArtistMetadata(artistName: string): Promise<MetadataResult> {
    try {
      const data = await ArtistRepository.getMetadata(artistName)

      return {
        title: `${data.name} - ${baseTitle}`,
        description: data.description || this.getDefaultDescription(),
        image: data.image || this.getDefaultImage(),
      }
    } catch (error) {
      logger.error('[MetadataService.getArtistMetadata] Error:', error)
      return this.getDefaultMetadata()
    }
  },

  /**
   * Generic method to fetch metadata based on type
   */
  async getMetadata(params: MetadataParams): Promise<MetadataResult> {
    switch (params.type) {
      case 'anime':
        return this.getAnimeMetadata(Number(params.value))
      case 'music':
        return this.getMusicMetadata(Number(params.value))
      case 'character':
        return this.getCharacterMetadata(Number(params.value))
      case 'artist':
        return this.getArtistMetadata(String(params.value))
      default:
        return this.getDefaultMetadata()
    }
  },

  /**
   * Returns default metadata when content is not found or error occurs
   */
  getDefaultMetadata(): MetadataResult {
    return {
      title: baseTitle,
      description: this.getDefaultDescription(),
      image: this.getDefaultImage(),
    }
  },

  /**
   * Returns default description
   */
  getDefaultDescription(): string {
    return 'AniDev is a modern anime streaming and exploration platform. It offers dynamic experiences for discovering, searching, and enjoying top animes.'
  },

  /**
   * Returns default image URL
   */
  getDefaultImage(): string {
    return `${baseUrl}/og-image.png`
  },
}
