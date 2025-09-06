import { MusicCardLayout } from '@components/music/music-card-layout'
import { MusicMiniCardLayout } from '@components/music/music-mini-card-layout'
import { MusicItemsLayout } from '@components/music/music-items-layout'


export const MusicLayout = () => {
  return (
    <section className="flex flex-col gap-8 mt-[45vh] px-20 z-20">
      <MusicMiniCardLayout title="Latest releases" />
      <MusicCardLayout />
      <MusicItemsLayout />
    </section>
  )
}
