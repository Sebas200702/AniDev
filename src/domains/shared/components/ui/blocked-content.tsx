import { BlockedIcon } from '@shared/components/icons/common/blocked-icon'
import { ModalDefaultContainer } from '@shared/components/modal/modal-default-container'
interface BlockedContentProps {
  message?: string
  onGoBack?: () => void
  onDisableParentalControl?: () => void
  showSettings?: boolean
}

export const BlockedContent = ({
  message = 'This content is blocked by parental controls',
  onGoBack,
  onDisableParentalControl,
  showSettings = true,
}: BlockedContentProps) => {
  return (
    <ModalDefaultContainer>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="relative inline-flex items-center justify-center">
            <BlockedIcon className="absolute top-1/2 left-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-red-500" />

            <div className="absolute inset-0 scale-150 rounded-full bg-red-500/20 blur-xl"></div>

            <div className="relative h-16 w-16 rounded-full border border-gray-700 bg-gray-800/80 backdrop-blur-sm"></div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact your administrator or check the settings page.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Content Blocked</h1>
            <p className="text-lg text-gray-400">{message}</p>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-gray-300">
              This anime contains content that has been restricted by your
              current parental control settings. To access this content, you may
              need to adjust your settings or contact an administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onGoBack && (
              <button onClick={onGoBack} className="button-primary w-full">
                Go Back
              </button>
            )}

            {showSettings && onDisableParentalControl && (
              <button
                onClick={onDisableParentalControl}
                className="button-secondary w-full"
              >
                Adjust Parental Controls
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalDefaultContainer>
  )
}
