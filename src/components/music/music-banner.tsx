import { useFetch } from '@hooks/useFetch'
import { useEffect, useState } from 'react'
import { type AnimeSongWithImage } from 'types'
import { getRandomWeightedSong } from '@utils/music'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'

export const MusicBanner = () => {
  const [randomSong, setRandomSong] = useState<AnimeSongWithImage | null>(null)
  const { data, loading, error } = useFetch<AnimeSongWithImage[]>({
    url: '/api/music?anime_status=Currently Airing&order_by=score desc',
  })

  useEffect(() => {
    if (!data) return
    const song = getRandomWeightedSong(data)
    setRandomSong(song)
  }, [data])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading music</div>
  if (!randomSong) return null

  return (
    <div className="relative h-64 overflow-hidden rounded-lg">
      <img
        src={createImageUrlProxy(randomSong.image,'0','70','webp')}
        alt={randomSong.anime_title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h2 className="text-xl font-bold text-white">{randomSong.anime_title}</h2>
        <p className="text-gray-200">{randomSong.song_title}</p>
        {randomSong.banner_image && (
          <div className="absolute inset-0 -z-10">
            <img
              src={createImageUrlProxy( randomSong.banner_image, '0','70','webp')}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  )
}
