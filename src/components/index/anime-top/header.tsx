/**
 * AnimeTopHeader component displays the title for the top anime section.
 *
 * @description This component renders a header for the top anime section with a styled title.
 * It provides visual context for the anime ranking list that follows. The component uses a
 * consistent styling approach with a colored accent bar and bold text to maintain the site's
 * visual hierarchy.
 *
 * The component is fully responsive, adjusting its padding based on screen size. On mobile
 * devices, it uses minimal padding, while on medium and larger screens it increases horizontal
 * padding for better visual balance. The header maintains a consistent appearance across
 * all viewport sizes while adapting to the available space.
 *
 * The UI displays a vertical accent bar followed by the "Top Anime" title text. The styling
 * is consistent with other section headers throughout the application to provide a cohesive
 * user experience.
 *
 * @returns {JSX.Element} The rendered header for the top anime section
 *
 * @example
 * <AnimeTopHeader />
 */
export const AnimeTopHeader = (): JSX.Element => {
  return (
    <header className="relative mx-auto flex w-[100dvw] flex-row items-center gap-4 px-4 py-4 md:px-20">
      <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
      <h4 className="text-lx text-center font-bold">Top Anime</h4>
    </header>
  )
}
