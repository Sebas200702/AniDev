import { MusicRepository } from '@music/repositories'

interface SearchMusicParams {
  filters: Record<string, any>
  countFilters: Record<string, any>
  page: number
  limit: number
}

interface SearchMusicResult {
  data: any[]
  total_items: number
  current_page: number
  last_page: number
}

/**
 * Music Service
 *
 * @description
 * Service layer for music-related operations. Handles business logic
 * for music search, filtering, and pagination.
 *
 * @features
 * - Music list search with filters
 * - Pagination support
 * - Error handling and logging
 */
export const MusicService = {
  /**
   * Search music with filters and pagination
   */
  async searchMusic({
    filters,
    countFilters,
    page,
    limit,
  }: SearchMusicParams): Promise<SearchMusicResult> {
    try {
      const [data, totalCount] = await Promise.all([
        MusicRepository.getMusicList(filters),
        MusicRepository.getMusicCount(countFilters),
      ])

      return {
        data,
        total_items: totalCount,
        current_page: page,
        last_page: Math.ceil(totalCount / limit),
      }
    } catch (error) {
      console.error('[MusicService.searchMusic] Error:', error)
      throw error
    }
  },

  /**
   * Get music info by theme ID
   */
  async getMusicById(themeId: number) {
    try {
      return await MusicRepository.getMusicInfo(themeId)
    } catch (error) {
      console.error('[MusicService.getMusicById] Error:', error)
      throw error
    }
  },

  /**
   * Get all music for a specific anime
   */
  async getMusicByAnimeId(animeId: number) {
    try {
      return await MusicRepository.getMusicByAnimeId(animeId)
    } catch (error) {
      console.error('[MusicService.getMusicByAnimeId] Error:', error)
      throw error
    }
  },

  /**
   * Get music for sitemap generation with pagination
   */
  async getMusicForSitemap(offset: number, limit: number = 5000) {
    try {
      return await MusicRepository.getMusicForSitemap(offset, limit)
    } catch (error) {
      console.error('[MusicService.getMusicForSitemap] Error:', error)
      throw error
    }
  },
}
