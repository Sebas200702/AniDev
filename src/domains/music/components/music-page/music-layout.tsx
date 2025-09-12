import { MusicCardLayout } from '@music/components/music-page/music-card-list'
import { MusicItemsLayout } from '@music/components/music-page/music-items-list'
import { MusicMiniCardLayout } from '@music/components/music-page/music-mini-card-list'

export const MusicLayout = () => {
  return (
    <section className="flex flex-col gap-8 mt-[45vh] md:px-20 z-20 p-4">
      <MusicMiniCardLayout title="Latest releases" />
      <MusicCardLayout />
      <MusicItemsLayout />
    </section>
  )
}
