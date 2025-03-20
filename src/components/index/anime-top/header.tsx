/**
 * AnimeTopHeader component displays the title for the top anime section.
 *
 * @param {Object} props - The props for the component.

 */
export const AnimeTopHeader = () => {
  return (
    <header className="relative mx-auto  flex w-[100dvw] flex-row items-center gap-4 py-4 px-4 md:px-20">
      <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
      <h4 className="text-lx text-center font-bold">Top Anime</h4>
    </header>
  )
}
