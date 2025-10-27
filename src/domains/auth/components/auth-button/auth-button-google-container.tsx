import { AuthGoogleBtn } from '@auth/components/auth-button/auth-button-google'
import { DataWrapper } from '@shared/components/data-wrapper'
import { signIn } from 'auth-astro/client'
import { useState } from 'react'

export const GoogleBtnContainer = ({
  isSignUp = false,
}: {
  isSignUp?: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleClick = async () => {
    try {
      setLoading(true)
      await signIn('google', {
        callbackUrl: isSignUp ? '/signup?step=2&google=true' : '/',
      })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error al iniciar sesión')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <DataWrapper
      loading={loading}
      error={error}
      onRetry={handleClick}
      data={' '}
    >
      {() => <AuthGoogleBtn onClick={handleClick} />}
    </DataWrapper>
  )
}
