import { MusicCardLayout } from 'domains/music/components/music-card-layout'
import { MusicItemsLayout } from 'domains/music/components/music-items-layout'
import { MusicMiniCardLayout } from 'domains/music/components/music-mini-card-layout'

export const MusicLayout = () => {
  return (
    <section className="flex flex-col gap-8 mt-[45vh] md:px-20 z-20 p-4">
      <MusicMiniCardLayout title="Latest releases" />
      <MusicCardLayout />
      <MusicItemsLayout />
    </section>
  )
}
