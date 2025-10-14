export const AnimeMusicLoader = () => {
  return Array.from({ length: 8 }, (_, i) => (
    <div
      key={i + 1}
      className="mx-auto flex aspect-[100/30] h-full w-full animate-pulse flex-row rounded-lg bg-zinc-800 md:max-h-36"
    >
      <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
    </div>
  ))
}
