import { useFetch } from '@hooks/useFetch'
import { useEffect, useState } from 'react'
import type { AnimeSongWithImage, ArtistInfo, PersonAbout } from 'types'

export const ArtistComponent = ({
  name,
}: { artistId: string; name: string }) => {
  const [about, setAbout] = useState<PersonAbout>()
  const { data: artistInfo, loading } = useFetch<ArtistInfo>({
    url: `/api/getArtistInfo?artistName=${name}`,
  })
  const { data: songs, loading: songsLoading } = useFetch<AnimeSongWithImage>({
    url: `/api/music?artist_filter=${name}`,
  })

  useEffect(() => {
    if (loading || !artistInfo) return

    const fetchFormatAbout = async () => {
      const about = await fetch(
        `/api/about?about=${encodeURIComponent(artistInfo.about)}`
      ).then((data) => data.json())

      setAbout(about)
    }
    fetchFormatAbout()
  }, [loading, artistInfo])

  if (loading || !artistInfo || !about || !songs || songsLoading) return

  return (
    <section className="mt-20 md:px-20 p-4">
      <h1>{about.description}</h1>
    </section>
  )
}
