/**
 * ScheduleLoader component displays a loading state for the schedule section.
 *
 * @description This component provides visual feedback while schedule data is being fetched.
 * It displays a series of pulsing placeholder elements that mimic the structure of the actual
 * schedule content. The component creates a responsive layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes placeholder elements for the timeline, anime cards, and status indicators.
 * These elements are styled with animation effects to signal to users that content is loading.
 *
 * The component adapts to different screen sizes, with different layouts for mobile and desktop views.
 * It maintains consistent padding and spacing to ensure a smooth transition when the actual content loads.
 *
 * @returns {JSX.Element} The rendered loading animation for the schedule section
 *
 * @example
 * <ScheduleLoader />
 */
export const ScheduleLoader = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-3 h-10 w-64 animate-pulse rounded-lg bg-zinc-800" />
        <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-zinc-800/60" />
      </div>

      <div className="relative min-h-[400px]">
        <div className="via-Primary/20 absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent">
          <div className="bg-Primary-50/10 absolute inset-0 backdrop-blur-sm" />
        </div>

        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="bg-Primary/20 flex h-6 w-6 items-center justify-center rounded-full">
            <div className="bg-Primary/40 h-3 w-3 rounded-full" />
          </div>
        </div>

        <div className="space-y-16">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'mr-auto flex-row pr-8' : 'ml-auto flex-row-reverse pl-8'} `}
              >
                <div className="bg-Primary-800 absolute right-[calc(50%-0.5rem)] flex h-4 w-4 items-center justify-center rounded-full">
                  <div className="bg-Primary-700 h-2 w-2 animate-pulse rounded-full" />
                </div>

                <div className="bg-Complementary/90 flex aspect-[120/40] h-full w-[calc(50%-1rem)] -translate-y-2 animate-pulse items-center gap-6 rounded-lg">
                  <div className="aspect-[225/330] h-full max-w-32 rounded-l-lg bg-zinc-800" />

                  <div className="flex flex-1 flex-col gap-4 py-2">
                    <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
                    <div className="h-4 w-24 rounded-full bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Decorative bottom cap */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-Primary/20 flex h-6 w-6 items-center justify-center rounded-full">
            <div className="bg-Primary/40 h-3 w-3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
