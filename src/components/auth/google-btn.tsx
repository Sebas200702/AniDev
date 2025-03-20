import { GoogleIcon } from '@components/icons/google-icon'
import { signIn } from 'auth-astro/client'

/**
 * GoogleBtn component renders a button for Google authentication.
 *
 * This component does not take any props and is used as a visual representation.
 */
export const GoogleBtn = () => {
  const handleGoogleClick = async () => {
    signIn('google')
  }
  return (
    <button
      type="button"
      className="button-secondary flex w-full items-center justify-center gap-3"
      onClick={handleGoogleClick}
    >
      <GoogleIcon style="h-6 w-6" />
    </button>
  )
}
