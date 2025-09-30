import { navigate } from 'astro:transitions/client'
import { toast } from '@pheralb/toast'
import { BlockedContent } from '@shared/components/ui/blocked-content'
import { useModal } from '@shared/hooks/useModal'
import { ToastType } from '@shared/types'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEffect, useState } from 'react'

interface UseBlockedContentProps {
  id: string
  getAnimeData: (id: string, parentalControl: boolean | null) => Promise<any>
}

interface UseBlockedContentReturn {
  animeData: any | null
  isBlocked: boolean
  blockedMessage: string | undefined
  isLoading: boolean
  isMounted: boolean
}

/**
 * Custom hook para manejar la lógica de contenido bloqueado por control parental
 *
 * @description Este hook maneja:
 * - La carga de datos del anime
 * - La verificación de bloqueo por control parental
 * - La apertura del modal de contenido bloqueado
 * - La navegación cuando se cierra el modal
 * - La desactivación del control parental
 *
 * @param slug - El slug del anime
 * @param getAnimeData - Función para obtener los datos del anime
 * @returns Objeto con el estado y funciones relacionadas con el bloqueo
 */
export const useBlockedContent = ({
  id,
  getAnimeData,
}: UseBlockedContentProps): UseBlockedContentReturn => {
  const [animeData, setAnimeData] = useState<any | null>(null)
  const [isBlocked, setIsBlocked] = useState<boolean>(false)
  const [blockedMessage, setBlockedMessage] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const { parentalControl, setParentalControl } = useGlobalUserPreferences()
  const { openModal, closeModal, onClose } = useModal()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchData = async () => {
      setIsLoading(true)

      const response = await getAnimeData(id, parentalControl)

      if (!response) {
        setIsLoading(false)
        return
      }

      const { anime, blocked, message } = response

      if (blocked) {
        setIsBlocked(true)
        setBlockedMessage(message)
      } else if (anime) {
        setAnimeData(anime)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [id, parentalControl, isMounted, getAnimeData])

  useEffect(() => {
    if (isBlocked && blockedMessage) {
      openModal(BlockedContent, {
        message: blockedMessage,
        onGoBack: handleGoBack,
        onDisableParentalControl: handleDisableParentalControl,
        showSettings: true,
      })

      onClose(() => {
        navigate('/')
      })
    }
  }, [isBlocked, blockedMessage])

  const handleGoBack = () => {
    navigate('/')
    closeModal()
  }

  const handleDisableParentalControl = () => {
    setParentalControl(false)
    localStorage.setItem('parental_control', JSON.stringify(false))
    setIsBlocked(false)
    setBlockedMessage(undefined)
    onClose(null)

    toast[ToastType.Success]({
      text: 'Parental controls have been disabled',
      delayDuration: 3000,
    })
    closeModal()
  }

  return {
    animeData,
    isBlocked,
    blockedMessage,
    isLoading,
    isMounted,
  }
}
