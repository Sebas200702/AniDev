import { GoogleIcon } from '@components/icons/google-icon'
import { signIn } from 'auth-astro/client'

export const GoogleBtn = () => {
  const handleGoogleClick = async () => {
    signIn('google', {
      redirectTo: '/'
    })
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
