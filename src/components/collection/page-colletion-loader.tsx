/**
 * PageCollectionLoader component displays a loading state for the collection page.
 *
 * @description This component provides visual feedback while collection data is being fetched.
 * It displays a series of pulsing placeholder elements that mimic the structure of the actual
 * collection items. The component creates a responsive layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes a placeholder for the collection title at the top, followed by a grid of
 * anime item placeholders. Each item contains a pulsing element that represents the anime card.
 * These elements are styled with animation effects to signal to users that content is loading.
 *
 * The component adapts to different screen sizes, displaying a single column on mobile devices,
 * two columns on medium screens, and three columns on larger screens. It maintains consistent
 * padding and spacing to ensure a smooth transition when the actual content loads.
 *
 * The animations use a consistent pulse effect across all placeholder elements to provide
 * a cohesive loading experience that aligns with the application's visual language.
 *
 * @returns {JSX.Element} The rendered loading animation for the collection page
 *
 * @example
 * <PageCollectionLoader />
 */
export const PageCollectionLoader = () => {
  return (
    <div className="mb-20 flex h-full w-full flex-col gap-4 px-20 pt-[35dvh]">
      <div className="mb-6 h-24 w-full animate-pulse rounded-lg bg-zinc-800 duration-300 ease-in-out md:h-14 md:w-96"></div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="bg-Complementary mx-auto flex aspect-[100/28] h-full w-full animate-pulse flex-row rounded-lg"
            >
              <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-800 object-cover object-center transition-all ease-in-out"></div>
            </div>
          ))}
      </div>
    </div>
  )
}
