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
    <div className="relative flex flex-col w-full max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="h-10 w-64 mx-auto animate-pulse rounded-lg bg-zinc-800 mb-3" />
        <div className="h-6 w-96 mx-auto animate-pulse rounded-lg bg-zinc-800/60" />
      </div>

      <div className="relative min-h-[400px]">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-r from-transparent via-Primary/20 to-transparent">
          <div className="absolute inset-0 bg-Primary-50/10 backdrop-blur-sm" />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <div className="w-6 h-6 rounded-full bg-Primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-Primary/40" />
          </div>
        </div>

        <div className="space-y-16">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row mr-auto pr-8' : 'flex-row-reverse ml-auto pl-8'}
              `}
              >
                <div className="absolute right-[calc(50%-0.5rem)] w-4 h-4 rounded-full bg-Primary-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-Primary-700 animate-pulse" />
                </div>

                <div className=" w-[calc(50%-1rem)] aspect-[120/40] h-full flex items-center gap-6 rounded-lg bg-Complementary/90 -translate-y-2 animate-pulse">
                  <div className=" aspect-[225/330]  max-w-32 h-full rounded-l-lg bg-zinc-800" />

                  <div className="flex flex-col gap-4 py-2 flex-1">
                    <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
                    <div className="h-4 w-24 rounded-full bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Decorative bottom cap */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
          <div className="w-6 h-6 rounded-full bg-Primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-Primary/40" />
          </div>
        </div>
      </div>
    </div>
  )
}
