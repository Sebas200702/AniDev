import { useFetch } from '@hooks/useFetch'
import { useEffect, useState } from 'react'
import { type AnimeSongWithImage } from 'types'
import { getLatestSongs } from '@utils/music'
import { DinamicBanner } from '@components/anime-info/dinamic-banner'
import { Overlay } from '@components/layout/overlay'
import { useMusicPlayerStore } from '@store/music-player-store'
import { navigate } from 'astro:transitions/client'
import { shuffleArray } from '@utils/shuffle-array'

export const MusicBanner = () => {
  const [songs, setSongs] = useState<AnimeSongWithImage[]>([])
  const [banners, setBanners] = useState<string[]>([])

  const { setCurrentSong, setList } = useMusicPlayerStore()
  const { data, loading } = useFetch<AnimeSongWithImage[]>({
    url: '/api/music?anime_status=Currently Airing&order_by=score desc',
  })

  useEffect(() => {
    if (!data) return
    const songs = shuffleArray(getLatestSongs(data) as AnimeSongWithImage[])
    const banners = shuffleArray(getLatestSongs(data, true) as string[])

    setSongs(songs)
    setBanners(banners)
  }, [data])

  if (!data || !songs || loading)
    return (
      <>
        <Overlay className="to-Primary-950 via-Primary-950 z-10 absolute inset-0 bg-gradient-to-b via-[38dvh] md:via-[48dvh]" />
        <div className="bg-Primary-900 absolute  flex aspect-[1080/600] h-[40vh] w-full flex-col justify-center gap-6 overflow-hidden text-left md:h-[60vh] md:px-20 animate-pulse items-center  duration-300"></div>
      </>
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
      <header className="absolute z-20 flex aspect-[1080/600] h-[40vh] w-full flex-col justify-center gap-6 overflow-hidden text-left md:h-[60vh] md:px-20">
        <h1 className="subtitle">Openings that are playing now</h1>

        <ul className="flex gap-4">
          <button className="button-primary" onClick={handleClick}>
            Play Now
          </button>
        </ul>
      </header>

      <Overlay className="to-Primary-950 via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
    </>
  )
}
