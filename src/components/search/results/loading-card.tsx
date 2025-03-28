/**
 * LoadingCard component displays a placeholder card while loading anime results.
 *
 * @returns {JSX.Element} A skeleton loading card with animated gradient
 */
export const LoadingCard = () => {
  return (
    <div className="flex aspect-[225/330] h-full w-full animate-pulse flex-col rounded-lg bg-zinc-700 p-4 duration-200"></div>
  )
}
