/**
 * NotResultsFound component displays a message when search results are empty.
 *
 * @description This component renders a visual indication to users when their search
 * query returns no results. It displays a centered message with appropriate styling
 * to clearly communicate the absence of matching content. The component is designed
 * with a responsive layout that maintains its centered position regardless of screen size.
 *
 * The component uses a simple, clean interface with a prominent heading that stands out
 * against the background. The text is styled with appropriate contrast and size to ensure
 * readability while maintaining visual harmony with the rest of the application.
 *
 * The responsive container adapts to different viewport sizes while keeping the content
 * centered both horizontally and vertically within the available space. This ensures
 * consistent presentation across devices and screen dimensions.
 *
 * @returns {JSX.Element} The rendered message indicating no search results were found
 *
 * @example
 * <NotResultsFound />
 */
export const NotResultsFound = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center p-4">
      <p className="text-center text-lg font-semibold text-gray-300">
        No results found. Please try a different search.
      </p>
    </div>
  )
}
