import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'
import { normalizeString } from '@utils/normalize-string'

export const ArtistRepository = {
  async getArtistInfo(artistName: string) {
    const normalizedName = normalizeString(artistName, false, true, true)

    const { data, error } = await supabase.rpc('get_artist_info', {
      artist_name: normalizedName,
    })

    if (error) {
      throw AppError.database('Failed to fetch artist info', {
        artistName: normalizedName,
        ...error,
      })
    }

    if (!data || data.length === 0) {
      throw AppError.notFound('Artist not found', {
        artistName: normalizedName,
      })
    }

    return data[0]
  },

  async getMetadata(artistName: string) {
    const artistData = await this.getArtistInfo(artistName)

    if (!artistData) {
      throw AppError.notFound('Artist data not found', { artistName })
    }

    const about: string | undefined = artistData.about
    const trimmedAbout = about ? about.slice(0, 150) : ''
    const ellipsis = about && about.length > 150 ? '...' : ''
    const description = trimmedAbout ? `${trimmedAbout}${ellipsis}` : undefined

    return {
      name: artistData.name,
      description,
      image: artistData.image_url,
      about: artistData.about,
    }
  },
}
