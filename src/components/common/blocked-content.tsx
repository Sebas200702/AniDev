import { BlockedIcon } from '@components/icons/blocked-incon'
import { ModalDefaultContainer } from '@components/modal/modal-default-container'
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
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            <BlockedIcon className="w-10 z-10 text-red-500  h-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />

            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-150"></div>

            <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full w-16 h-16"></div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Need help? Contact your administrator or check the settings page.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Content Blocked</h1>
            <p className="text-gray-400 text-lg">{message}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              This anime contains content that has been restricted by your
              current parental control settings. To access this content, you may
              need to adjust your settings or contact an administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onGoBack && (
              <button onClick={onGoBack} className="w-full button-primary">
                Go Back
              </button>
            )}

            {showSettings && onDisableParentalControl && (
              <button
                onClick={onDisableParentalControl}
                className="w-full button-secondary"
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
