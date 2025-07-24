import { ModalDefaultContainer } from './modal-default-container'

/**
 * Skeleton component for the download modal content
 */
export const DownloadModalSkeleton = () => {
  return (
    <ModalDefaultContainer>
      <div className="flex w-full animate-pulse flex-col gap-6 md:w-100">
        {/* Header skeleton */}
        <div className="flex flex-col gap-2">
          <div className="bg-Primary-700/50 h-6 w-40 rounded"></div>
          <div className="bg-Primary-800/50 h-5 w-80 rounded"></div>
        </div>

        {/* Music info card skeleton */}
        <div className="bg-Primary-900 relative flex flex-row rounded-lg">
          <div className="border-Primary-900 relative aspect-square h-full w-full max-w-20 overflow-hidden rounded-lg border-l-4"></div>
        </div>

        {/* Resolution and version controls skeleton */}
        <div className="flex gap-4 md:flex-row">
          <div className="flex w-2/3 flex-col gap-2">
            <div className="bg-Primary-900 h-4 w-28 rounded"></div>
            <div className="bg-Primary-900 flex h-10 w-full -skew-x-8 transform flex-row overflow-hidden rounded-sm">
              <div className="bg-Primary-900 flex h-10 w-full items-center justify-center"></div>
            </div>
          </div>
          <div className="flex w-1/3 flex-col gap-2">
            <div className="bg-Primary-900 h-4 w-16 rounded"></div>
            <div className="bg-Primary-900 h-10 w-full rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-row overflow-hidden rounded-md">
          <div className="bg-Primary-900 flex h-12 w-full"></div>
          <div className="bg-Primary-900 flex h-12 w-full"></div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex h-full w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="bg-Primary-900 h-10 w-full rounded"></div>
          <div className="bg-Primary-900 h-10 w-full rounded"></div>
        </div>
      </div>
    </ModalDefaultContainer>
  )
}
