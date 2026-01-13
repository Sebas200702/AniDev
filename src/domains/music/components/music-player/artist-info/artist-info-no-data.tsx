export const ArtistInfoNoData = () => {
  return (
    <div className="group relative row-start-2 flex flex-col gap-6 overflow-hidden p-4 md:rounded-xl md:p-6">
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden object-cover object-center md:rounded-xl bg-Complementary"></div>

      <h3 className="text-lx z-20">About the artist </h3>

      <div className="relative z-20 flex w-full max-w-80 flex-row items-center gap-6 rounded-full p-2 md:max-w-100">
        <p>No artist information available.</p>
      </div>
    </div>
  )
}
