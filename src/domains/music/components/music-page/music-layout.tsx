import { MusicCardLayout } from '@music/components/music-page/music-card-list'
import { MusicItemsLayout } from '@music/components/music-page/music-items-list'
import { MusicMiniCardLayout } from '@music/components/music-page/music-mini-card-list'

export const MusicLayout = () => {
  return (
    <section className="z-20 mt-[45vh] flex flex-col gap-8 p-4 md:px-20">
      <MusicMiniCardLayout title="Latest releases" />
      <MusicCardLayout />
      <MusicItemsLayout />
    </section>
  )
}
