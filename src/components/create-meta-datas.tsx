import { useEffect } from 'react'

/**
 * Props for the CreateMetaDatas component.
 */
interface Props {
  /**
   * The title to set in the document.
   */
  title: string
  /**
   * The description to set in the document.
   */
  description: string
  /**
   * The image URL to set in the document's metadata.
   */
  image: string
}

/**
 * CreateMetaDatas component updates the document's metadata including title, description, and image.
 *
 * @description This component dynamically updates the metadata of the document when it mounts.
 * It modifies various meta tags for search engine optimization (SEO) and social media sharing.
 * The component updates standard HTML meta tags as well as Open Graph and Twitter Card metadata
 * to ensure consistent representation across different platforms.
 *
 * When this component is mounted, it runs once to update all relevant meta tags with the provided
 * information. This includes the document title, description meta tag, Open Graph meta tags for
 * Facebook and other platforms, and Twitter Card meta tags for Twitter. The component does not
 * render any visible UI elements as it focuses solely on metadata management.
 *
 * The component ensures proper social media sharing previews by setting appropriate image URLs,
 * titles, and descriptions across all metadata formats. It also sets the content type as "website"
 * for Open Graph and the card type as "summary_large_image" for Twitter.
 *
 * @param {Props} props - The component props
 * @param {string} props.title - The title to set in the document and social media cards
 * @param {string} props.description - The description to set in meta tags for SEO and sharing
 * @param {string} props.image - The image URL to set in the document's metadata for social media previews
 * @returns {null} The component doesn't render any visible elements
 *
 * @example
 * <CreateMetaDatas
 *   title="Anime Title - AniDev"
 *   description="Watch and explore this amazing anime series"
 *   image="https://ani-dev.vercel.app/images/anime-cover.jpg"
 * />
 */
export const CreateMetaDatas = ({ title, description, image }: Props) => {
  const changeMetaData = () => {
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

    if (domCard) domCard.content = image
    if (domDescriptionTwitter) domDescriptionTwitter.content = description
    if (domTitleTwitter) domTitleTwitter.content = title
    if (domImageTwitter) domImageTwitter.content = image
  }

  useEffect(() => {
    changeMetaData()
  }, [])

  return null
}
