import type { CachedAnimeResponse, HomeCache } from '@shared/types/cache-types'
import type { HomeSection } from '@shared/types/home-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HomeSectionsCache {
  sections: HomeSection[]
  timestamp: number
  userId: string | null
}

interface HomeCacheState {
  cache: HomeCache
  homeSections: HomeSectionsCache | null
  getCachedResponse: (
    sectionId: string,
    url: string
  ) => CachedAnimeResponse | null
  setCachedResponse: (sectionId: string, response: CachedAnimeResponse) => void
  getHomeSections: (
    userId: string | null,
    maxAge: number
  ) => HomeSection[] | null
  setHomeSections: (sections: HomeSection[], userId: string | null) => void
  invalidateSection: (sectionId: string) => void
  invalidateAll: () => void
  markAsError: (sectionId: string, url: string, error: string) => void
  shouldRetry: (sectionId: string, url: string, maxRetries: number) => boolean
}

export const useHomeCacheStore = create<HomeCacheState>()(
  persist(
    (set, get) => ({
      cache: {
        userId: null,
        sections: {},
        version: 1,
      },
      homeSections: null,

      getHomeSections: (userId: string | null, maxAge: number) => {
        const cached = get().homeSections
        if (!cached) return null

        const isSameUser = cached.userId === userId
        const isExpired = Date.now() - cached.timestamp > maxAge

        return isSameUser && !isExpired ? cached.sections : null
      },

      setHomeSections: (sections: HomeSection[], userId: string | null) => {
        set({
          homeSections: {
            sections,
            timestamp: Date.now(),
            userId,
          },
        })
      },

      getCachedResponse: (sectionId: string, url: string) => {
        const section = get().cache.sections[sectionId]
        if (!section) return null

        const cached = section.responses.find((r) => r.url === url)
        if (!cached) return null

        const isExpired = Date.now() - cached.timestamp > 3600000
        return isExpired ? null : cached
      },

      setCachedResponse: (sectionId: string, response: CachedAnimeResponse) => {
        set((state) => {
          const section = state.cache.sections[sectionId] || {
            sectionId,
            responses: [],
            lastUpdated: Date.now(),
          }

          const seen = new Set<number>()
          const deduplicated = response.data.filter((anime) => {
            if (seen.has(anime.mal_id)) return false
            seen.add(anime.mal_id)
            return true
          })

          const existingIndex = section.responses.findIndex(
            (r) => r.url === response.url
          )
          const newResponse = {
            ...response,
            data: deduplicated,
            timestamp: Date.now(),
          }

          if (existingIndex >= 0) {
            section.responses[existingIndex] = newResponse
          } else {
            section.responses.push(newResponse)
          }

          return {
            cache: {
              ...state.cache,
              sections: {
                ...state.cache.sections,
                [sectionId]: { ...section, lastUpdated: Date.now() },
              },
            },
          }
        })
      },

      invalidateSection: (sectionId: string) => {
        set((state) => {
          const { [sectionId]: _, ...rest } = state.cache.sections
          return { cache: { ...state.cache, sections: rest } }
        })
      },

      invalidateAll: () => {
        set((state) => ({ cache: { ...state.cache, sections: {} } }))
      },

      markAsError: (sectionId: string, url: string, error: string) => {
        set((state) => {
          const section = state.cache.sections[sectionId] || {
            sectionId,
            responses: [],
            lastUpdated: Date.now(),
          }

          const existingIndex = section.responses.findIndex(
            (r) => r.url === url
          )
          const errorResponse: CachedAnimeResponse = {
            url,
            data: [],
            timestamp: Date.now(),
            status: 'error',
            error,
            retryCount:
              existingIndex >= 0
                ? (section.responses[existingIndex].retryCount || 0) + 1
                : 1,
          }

          if (existingIndex >= 0) {
            section.responses[existingIndex] = errorResponse
          } else {
            section.responses.push(errorResponse)
          }

          return {
            cache: {
              ...state.cache,
              sections: { ...state.cache.sections, [sectionId]: section },
            },
          }
        })
      },

      shouldRetry: (sectionId: string, url: string, maxRetries: number) => {
        const cached = get().getCachedResponse(sectionId, url)
        if (!cached) return true
        if (cached.status !== 'error') return false
        return (cached.retryCount || 0) < maxRetries
      },
    }),
    {
      name: 'anidev-home-cache',
      version: 1,
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    }
  )
)
