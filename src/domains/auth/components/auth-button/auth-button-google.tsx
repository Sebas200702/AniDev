// google-btn.render.tsx

import { GoogleIcon } from '@shared/components/icons/auth/google-icon'

interface GoogleBtnRenderProps {
  onClick: () => void
}

export const AuthGoogleBtn = ({ onClick }: GoogleBtnRenderProps) => (
  <button
    type="button"
    className="button-secondary flex w-full items-center justify-center gap-3"
    onClick={onClick}
  >
    <GoogleIcon className="h-6 w-6" />
  </button>
)
