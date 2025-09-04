import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { VoiceActor } from 'types'

interface Props {
  seiyuu: VoiceActor
}
export const SeiyuuInfo = ({ seiyuu }: Props) => {
  return (
    <a
        href={`/voice-actor/${normalizeString(seiyuu.name ?? 'Unknown', true, false, true)}_${seiyuu.voice_actor_id}`}
        className="group/actor flex aspect-[70/30] w-full from-Primary-950/50 border-2 border-Primary-800/30 hover:border-enfasisColor/50 to-Primary-950/80   relative  bg-gradient-to-br backdrop-blur-sm transition-all duration-300  rounded-md overflow-hidden "
        aria-label={`About ${seiyuu.name}`}
      >
        <div className="relative aspect-[225/330] h-full rounded-r-md flex-shrink-0 overflow-hidden">
          <Picture
            image={createImageUrlProxy(
                seiyuu.image_url ?? `${baseUrl}/placeholder.webp`,
              '0',
              '0',
              'webp'
            )}
            styles="h-full w-full relative"
          >
            <img
              src={createImageUrlProxy(
                seiyuu.image_url ??
                  `${baseUrl}/placeholder.webp`,
                '0',
                '70',
                'webp'
              )}
              alt={seiyuu.name}
              className="relative h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/actor:scale-105"
              loading="lazy"
            />
            <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
          </Picture>

          <div className="from-enfasisColor/0 to-enfasisColor/20 absolute inset-0 bg-gradient-to-l opacity-0 transition-opacity duration-300 ease-in-out group-hover/actor:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-1.5 text-right">
          <span className="text-sxx text-enfasisColor tracking-wider uppercase">
            Seiyuu
          </span>

          <h2 className="text-s group-hover/actor:text-enfasisColor line-clamp-1 leading-tight font-medium text-white transition-colors duration-300 ease-in-out">
            {seiyuu.name}
          </h2>
          <small className="text-xs text-gray-400">
            {seiyuu.language}
          </small>
        </div>
      </a>
  )
}
