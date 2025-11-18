import { HomeGeneratorService } from '@shared/services/home-generator-service'
import type { HomeSection } from '@shared/types/home-types'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEffect, useState } from 'react'

/**
 * useHomeSections Hook
 *
 * @description
 * Hook para cargar y gestionar las secciones del home.
 * Integra con el store global de usuario y maneja el cache.
 *
 * @returns {Object} Estado de las secciones y funciones de control
 */
export const useHomeSections = () => {
  const { userInfo } = useGlobalUserPreferences()
  const [sections, setSections] = useState<HomeSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSections()
  }, [userInfo?.id])

  const loadSections = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const homeSections = await HomeGeneratorService.buildHomeSections(
        userInfo?.id ?? null
      )

      setSections(homeSections)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error loading sections'
      console.error('Failed to load home sections:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const regenerate = async () => {
    if (userInfo?.id) {
      await HomeGeneratorService.invalidateCache(userInfo.id)
    }
    await loadSections()
  }

  return { sections, isLoading, error, regenerate }
}
