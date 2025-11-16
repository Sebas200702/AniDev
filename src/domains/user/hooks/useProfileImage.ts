import { useEffect, useState } from 'react'

import { buildProxiedImageSrc } from '@shared/utils/proxy-image'
import { useUpdateProfile } from '@user/stores/update-profile'

interface Params {
  type: 'avatar' | 'banner'
  baseUrl: string
  width?: string
  quality?: string
  format?: string
}

export const useProfileImage = ({
  type,
  baseUrl,
  width = '0',
  quality = '75',
  format = 'webp',
}: Params) => {
  const { avatar, bannerImage } = useUpdateProfile()
  const isAvatar = type === 'avatar'
  const [imgSrc, setImgSrc] = useState<string>()

  useEffect(() => {
    let active = true
    const resolve = async () => {
      const base = isAvatar ? (avatar ?? baseUrl) : (bannerImage ?? baseUrl)
      const resolved = await buildProxiedImageSrc(base, width, quality, format)
      if (active) setImgSrc(resolved || undefined)
    }
    resolve().catch(() => {
      if (active) setImgSrc(undefined)
    })
    return () => {
      active = false
    }
  }, [isAvatar, avatar, bannerImage, baseUrl, width, quality, format])

  return { imgSrc, isAvatar, avatar, bannerImage }
}
