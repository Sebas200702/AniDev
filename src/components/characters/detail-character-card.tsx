import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { baseUrl } from '@utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import type { Character } from 'types'

export const AnimeCharacterCard = ({ character }: { character: Character }) => {
  return (
    <article className="group from-Primary-950/50 to-Primary-950/80 hover:border-enfasisColor/60 relative aspect-[100/32] min-h-20 transform overflow-hidden rounded-xl border border-gray-100/20 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 md:min-h-32">
      <div className="aspect absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/5 to-transparent opacity-50" />

      <a
        href={`/character/${character.character_name}-${character.character_id}`}
        className="group/character absolute top-0 bottom-0 left-0 flex w-1/2 hover:z-10"
        aria-label={`About ${character.character_name}`}
      >
        <div className="relative aspect-[225/330] h-full flex-shrink-0 overflow-hidden">
          <Picture
            image={
              character.character_small_image_url ??
              `${baseUrl}/placeholder.webp`
            }
            styles="h-full w-full relative"
          >
            <img
              src={
                character.character_image_url ?? `${baseUrl}/placeholder.webp`
              }
              alt={character.character_name}
              className="relative h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/character:scale-105"
              loading="lazy"
            />
            <Overlay className="to-Primary-950/60 h-full w-full bg-gradient-to-b from-transparent" />
          </Picture>

          <div className="from-enfasisColor/0 to-enfasisColor/20 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 ease-in-out group-hover/character:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-1.5">
          <span className="text-sxx text-enfasisColor tracking-wider uppercase">
            Character
          </span>

          <h2 className="text-s group-hover/character:text-enfasisColor line-clamp-1 leading-tight font-medium text-white transition-colors duration-300 ease-in-out">
            {character.character_name}
          </h2>
          <small className="text-xs text-gray-400">{character.role}</small>
        </div>
      </a>

      <a
        href={`/voice-actor/${normalizeString(character.voice_actor_name, true, false, true)}-${character.voice_actor_id}`}
        className="group/actor absolute top-0 right-0 bottom-0 flex w-1/2 flex-row-reverse hover:z-10"
        aria-label={`About ${character.voice_actor_name}`}
      >
        <div className="relative aspect-[225/330] h-full flex-shrink-0 overflow-hidden">
          <Picture
            image={
              character.voice_actor_image_url ?? `${baseUrl}/placeholder.webp`
            }
            styles="h-full w-full relative"
          >
            <img
              src={
                character.voice_actor_image_url ?? `${baseUrl}/placeholder.webp`
              }
              alt={character.voice_actor_name}
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
            {character.voice_actor_name}
          </h2>
          <small className="text-xs text-gray-400">
            {character.voice_actor_language}
          </small>
        </div>
      </a>

      <div className="absolute top-4 bottom-4 left-1/2 w-px -translate-x-0.5 transform bg-gradient-to-b from-transparent via-gray-600/40 to-transparent" />

      <div className="from-enfasisColor/0 via-enfasisColor/5 to-enfasisColor/0 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </article>
  )
}
