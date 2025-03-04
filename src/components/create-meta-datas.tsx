import { useEffect } from 'react'

interface Props {
  title: string
  description: string
  image: string
}
export const CreateMetaDatas = ({ title, description, image }: Props) => {
  const channgeMetaData = () => {
    const domTitle = document.querySelector('title') as HTMLTitleElement
    const domDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement
    const domImage = document.querySelector(
      'meta[property="og:image"]'
    ) as HTMLMetaElement
    const domTitleOg = document.querySelector(
      'meta[property="og:title"]'
    ) as HTMLMetaElement
    const domDescriptionOg = document.querySelector(
      'meta[property="og:description"]'
    ) as HTMLMetaElement
    const domType = document.querySelector(
      'meta[property="og:type"]'
    ) as HTMLMetaElement
    const domCard = document.querySelector(
      'meta[name="twitter:card"]'
    ) as HTMLMetaElement
    const domDescriptionTwitter = document.querySelector(
      'meta[name="twitter:description"]'
    ) as HTMLMetaElement
    const domTitleTwitter = document.querySelector(
      'meta[name="twitter:title"]'
    ) as HTMLMetaElement
    const domImageTwitter = document.querySelector(
      'meta[name="twitter:image"]'
    ) as HTMLMetaElement

    if (domTitle) domTitle.innerHTML = title
    if (domDescription) domDescription.content = description
    if (domImage) domImage.content = image

    if (domTitleOg) domTitleOg.content = title
    if (domDescriptionOg) domDescriptionOg.content = description
    if (domType) domType.content = 'website'

    if (domCard) domCard.content = 'summary_large_image'
    if (domDescriptionTwitter) domDescriptionTwitter.content = description
    if (domTitleTwitter) domTitleTwitter.content = title
    if (domImageTwitter) domImageTwitter.content = image
  }

  useEffect(() => {
    channgeMetaData()
  }, [])

  return null
}
