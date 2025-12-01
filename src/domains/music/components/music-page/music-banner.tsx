import { navigate } from 'astro:transitions/client'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { type AnimeSong } from '@music/types'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { DinamicBanner } from '@shared/components/ui/dinamic-banner'
import { useFetch } from '@shared/hooks/useFetch'
import { Overlay } from 'domains/shared/components/layout/overlay'

export const MusicBanner = () => {
  const { setCurrentSong, setList } = useMusicPlayerStore()
  const { data: songs, loading } = useFetch<AnimeSong[]>({
    url: '/music?anime_status=Currently Airing&order_by=score desc&type_music=op',
  })

  if (!songs || loading) {
    return (
      <>
        <Overlay className="to-Primary-950 via-Primary-950 absolute inset-0 z-10 bg-gradient-to-b via-[38dvh] md:via-[48dvh]" />
        <div className="bg-Primary-900 absolute flex aspect-[1080/600] h-[40dvh] w-full animate-pulse flex-col items-center justify-center gap-6 overflow-hidden text-left duration-300 md:h-[60dvh] md:px-20"></div>
      </>
    )
  }

  const banners = songs.map(
    (song) => song.anime?.banner_image ?? song.anime?.image ?? ''
  )

  const handleClick = () => {
    const newCurrentSong = songs[0]
    setCurrentSong(newCurrentSong)
    setList(songs)
    navigate(`/music/${newCurrentSong.song_title}_${newCurrentSong.theme_id}`)
  }
  return (
    <>
      <DinamicBanner banners={banners} />
      <Overlay className="to-Primary-950 via-Primary-950 absolute inset-0 bg-gradient-to-b via-[38dvh] md:via-[48dvh]" />
      <header className="absolute z-20 flex aspect-[1080/600] h-[45vh] w-full flex-col justify-center gap-6 overflow-hidden p-4 text-left md:h-[60vh] md:px-20">
        <h1 className="title">Openings that are playing now</h1>

        <ul className="flex gap-4">
          <button
            className="button-primary flex gap-2 px-4"
            onClick={handleClick}
          >
            <PlayIcon className="h-4 w-4" />
            Play Now
          </button>
        </ul>
      </header>

      <Overlay className="to-Primary-950 via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
    </>
  )
}
