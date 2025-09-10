import { Picture } from '@components/media/picture'
import { normalizeString } from '@utils/normalize-string'
import type { VoiceActor } from 'types'

interface Props {
  seiyuu: VoiceActor
}
export const SeiyuuInfo = ({ seiyuu }: Props) => {
  return (
    <li className="w-full">
      <a
        href={`/voice-actor/${normalizeString(seiyuu.name ?? 'Unknown', true, false, true)}_${seiyuu.voice_actor_id}`}
        className="group/actor flex w-full flex-row items-center gap-4 rounded-md p-2 capitalize transition-colors hover:bg-white/5"
        aria-label={`About ${seiyuu.name}`}
      >
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
          <Picture
            image={seiyuu.image_url ?? ''}
            placeholder={seiyuu.image_url ?? ''}
            styles="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/actor:scale-105"
            alt={seiyuu.name}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="text-s group-hover/actor:text-enfasisColor font-medium text-white transition-colors duration-300 ease-in-out">
            {seiyuu.name}
          </h2>
          <small className="text-xs text-gray-400">{seiyuu.language}</small>
        </div>
      </a>
    </li>
  )
}
