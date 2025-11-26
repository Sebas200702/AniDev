import { useEffect } from 'react'

import { navigate } from 'astro:transitions/client'
import { toast } from '@pheralb/toast'
import { BlockedContent } from '@shared/components/ui/blocked-content'
import { useModal } from '@shared/hooks/useModal'
import { ToastType } from '@shared/types'
import { useGlobalUserPreferences } from '@user/stores/user-store'

interface UseBlockedContentProps {
  error: Error | null
}

/**
 * Custom hook to handle blocked content logic via Parental Control
 *
 * @description This hook listens for permission errors (typically 403) returned by useFetch
 * and triggers the BlockedContent modal. It handles:
 * - Detecting 'permission' type errors
 * - Opening the modal
 * - Navigation on close/back
 * - Disabling parental controls
 *
 * @param error - The error object returned from useFetch
 */
export const useBlockedContent = ({ error }: UseBlockedContentProps) => {
  const { setParentalControl } = useGlobalUserPreferences()
  const { openModal, closeModal, onClose } = useModal()

  useEffect(() => {
    // Check if the error is a permission error (blocked content)
    // We access 'type' which is added by AppError factory
    if (error && (error as any).type === 'permission') {
      openModal(BlockedContent, {
        message: error.message,
        onGoBack: handleGoBack,
        onDisableParentalControl: handleDisableParentalControl,
        showSettings: true,
      })

      onClose(() => {
        navigate('/')
      })
    }
  }, [error])

  const handleGoBack = () => {
    navigate('/')
    closeModal()
  }

  const handleDisableParentalControl = () => {
    setParentalControl(false)
    localStorage.setItem('parental_control', JSON.stringify(false))

    toast[ToastType.Success]({
      text: 'Parental controls have been disabled',
      delayDuration: 3000,
    })
    closeModal()
  }
}
