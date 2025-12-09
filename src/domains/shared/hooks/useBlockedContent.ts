import { useEffect, useRef } from 'react'

import { navigate } from 'astro:transitions/client'
import { BlockedContent } from '@shared/components/ui/blocked-content'
import { useModal } from '@shared/hooks/useModal'

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
  const { openModal, closeModal, onClose } = useModal()
  const actionTaken = useRef(false)

  useEffect(() => {
    // Check if the error is a permission error (blocked content)
    // We access 'type' which is added by AppError factory
    if (error && (error as any).type === 'permission') {
      actionTaken.current = false
      openModal(BlockedContent, {
        message: error.message,
        onGoBack: handleGoBack,
        onDisableParentalControl: handleDisableParentalControl,
        showSettings: true,
      })

      onClose(() => {
        if (!actionTaken.current) {
          navigate('/')
        }
      })
    }
  }, [error])

  const handleGoBack = () => {
    actionTaken.current = true
    navigate('/')
    closeModal()
  }

  const handleDisableParentalControl = () => {
    actionTaken.current = true
    navigate('/profile/settings')
    closeModal()
  }
}
