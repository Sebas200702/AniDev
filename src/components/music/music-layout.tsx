import { MusicCardLayout } from '@components/music/music-card-layout'
import { MusicItemsLayout } from '@components/music/music-items-layout'
import { MusicMiniCardLayout } from '@components/music/music-mini-card-layout'

export const MusicLayout = () => {
  return (
    <section className="flex flex-col gap-8 mt-[45vh] md:px-20 z-20 p-4">
      <MusicMiniCardLayout title="Latest releases" />
      <MusicCardLayout />
      <MusicItemsLayout />
    </section>
  )
}
