import type {AnimeSong} from 'types'
import { useFetch } from '@hooks/useFetch'

export const Artist = ({ name, id }: { name: string; id: string }) => {
  const {
    data: dataArtistMusic,
    loading,
    error,
  } = useFetch<AnimeSong[]>({
    url: `/api/music?artist_filter=${name}`,
  })

  const {
    data: dataArtist,
    loading: loadingArtist,
    error: errorArtist,
  } = useFetch({
    url: `/api/artist?artistName=${name}`,
  })

  if (loading || !dataArtistMusic) return <p>Loading...</p>

  return (
    <section>
      <ul>
        {dataArtistMusic.map((song) => (
          <li key={song.song_id}>{song.song_title}</li>
        ))}
      </ul>
      
    </section>
  )


}
