import { GoogleIcon } from '@components/icons/google-icon'
import { signIn } from 'auth-astro/client'

/**
 * GoogleBtn component renders a button for Google authentication.
 *
 * @description This component provides a Google sign-in button that triggers the authentication process.
 * It uses the auth-astro library to handle the sign-in flow with Google as the provider. When clicked,
 * the button initiates the OAuth flow, redirecting the user to Google's authentication page.
 *
 * The component is designed with a clean, recognizable interface featuring the Google icon for
 * immediate brand recognition. It maintains a consistent styling with other authentication options
 * while clearly indicating its purpose through the Google logo.
 *
 * The button is fully responsive and adapts to its container width, making it suitable for various
 * layout configurations. It follows accessibility best practices with proper button semantics and
 * visual indicators.
 *
 * @returns {JSX.Element} The rendered Google authentication button with icon
 *
 * @example
 * <GoogleBtn />
 */
export const GoogleBtn = ({
  isSignUp = false,
}: {
  isSignUp?: boolean
}): JSX.Element => {
  const handleGoogleClick = async () => {
    signIn('google', {
      callbackUrl: isSignUp ? '/signup?step=2' : '/',
    })
  }
  return (
    <button
      type="button"
      className="button-secondary flex w-full items-center justify-center gap-3"
      onClick={handleGoogleClick}
    >
      <GoogleIcon className="h-6 w-6" />
    </button>
  )
}
