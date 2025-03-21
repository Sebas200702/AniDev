/**
 * SearchResultsLoader component displays a loading state for search results.
 *
 * @description This component provides visual feedback while search results are being fetched.
 * It displays a grid of pulsing placeholder elements that mimic the structure of the actual
 * search results. The component creates a responsive layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes a grid of anime item placeholders that adjust based on screen size.
 * On mobile devices, the grid displays 2 columns, on medium screens 4 columns, and on large
 * screens 6 columns. Each placeholder is styled with animation effects to signal to users
 * that content is loading.
 *
 * The animations use a consistent pulse effect across all placeholder elements to provide
 * a cohesive loading experience that aligns with the application's visual language.
 *
 * @returns {JSX.Element} The rendered loading animation for search results
 *
 * @example
 * <SearchResultsLoader />
 */
export const SearchResultsLoader = () => {
  return (
    <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 p-4 xl:grid-cols-6 xl:gap-10">
      {Array(30)
        .fill(0)
        .map((_, i) => (
          <div
            key={i + 1}
            className="flex aspect-[225/330] h-full w-full animate-pulse flex-col rounded-lg bg-zinc-700 p-4 duration-200"
          ></div>
        ))}
    </div>
  )
}
