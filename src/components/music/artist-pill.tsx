import { Picture } from '@components/media/picture'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  name: string
  image?: string
}

export const ArtistPill = ({ name, image }: Props) => {
  const href = `/artist/${normalizeString(name)}`

  return (
    <a
      href={href}
      className="group bg-Complementary/40 hover:bg-Complementary/60 border-enfasisColor/10 hover:border-enfasisColor/40 flex items-center gap-3 rounded-full border px-3 py-2 transition-all duration-200"
      title={`View ${name} profile`}
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-full">
        <Picture
          image={createImageUrlProxy(image || '', '0', '0', 'webp')}
          styles="relative h-full w-full"
        >
          <img
            src={createImageUrlProxy(image || '', '0', '70', 'webp')}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        </Picture>
      </div>
      <span className="text-Primary-100 text-sm font-medium group-hover:text-white">
        {name}
      </span>
    </a>
  )
}

