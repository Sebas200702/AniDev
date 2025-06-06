import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { baseUrl } from '@utils/base-url'
import type { Character } from 'types'

export const AnimeCharacterCard = ({ character }: { character: Character }) => {
  return (
    <article className="group relative md:h-28 h-20 rounded-xl overflow-hidden border border-gray-100/20 bg-gradient-to-br from-Primary-950/50 to-Primary-950/80 transform backdrop-blur-sm hover:border-enfasisColor/60  transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/5 to-transparent opacity-50" />

      <a
        href={`/character/${character.character_name}-${character.character_id}`}
        className="absolute left-0 top-0 bottom-0 w-1/2 flex group/character hover:z-10"
        aria-label={`About ${character.character_name}`}
      >
        <div className="relative h-full aspect-[225/330] flex-shrink-0 overflow-hidden">
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
              className="h-full w-full object-cover relative transition-transform ease-in-out duration-300 group-hover/character:scale-105"
              loading="lazy"
            />
            <Overlay className="bg-gradient-to-b from-transparent to-Primary-950/60 h-full w-full" />
          </Picture>

          <div className="absolute inset-0 bg-gradient-to-r from-enfasisColor/0  ease-in-out  to-enfasisColor/20 opacity-0 group-hover/character:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-1.5">
          <span className="text-sxx text-enfasisColor uppercase tracking-wider">
            Character
          </span>

          <h2 className="text-white text-s font-medium leading-tight line-clamp-1 ease-in-out group-hover/character:text-enfasisColor transition-colors duration-300">
            {character.character_name}
          </h2>
          <small className="text-xs text-gray-400">{character.role}</small>
        </div>
      </a>

      <a
        href={`/voice-actor/${character.voice_actor_name}-${character.voice_actor_id}`}
        className="absolute  right-0 top-0 bottom-0 w-1/2 flex flex-row-reverse group/actor hover:z-10"
        aria-label={`About ${character.voice_actor_name}`}
      >
        <div className="relative h-full aspect-[225/330] flex-shrink-0 overflow-hidden">
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
              className="h-full w-full object-cover transition-transform relative ease-in-out duration-300 group-hover/actor:scale-105"
              loading="lazy"
            />
            <Overlay className="bg-gradient-to-b from-transparent to-Primary-950/60 h-full w-full" />
          </Picture>

          <div className="absolute inset-0 bg-gradient-to-l from-enfasisColor/0 to-enfasisColor/20 opacity-0 group-hover/actor:opacity-100 transition-opacity ease-in-out duration-300" />
        </div>

        <div className="flex flex-1 flex-col justify-center px-3 gap-1 py-1.5 text-right">
          <span className="text-sxx text-enfasisColor uppercase tracking-wider">
            Seiyuu
          </span>

          <h2 className="text-white text-s font-medium leading-tight line-clamp-1 ease-in-out group-hover/actor:text-enfasisColor transition-colors duration-300">
            {character.voice_actor_name}
          </h2>
          <small className="text-xs text-gray-400">
            {character.voice_actor_language}
          </small>
        </div>
      </a>

      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-600/40 to-transparent transform -translate-x-0.5" />

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-enfasisColor/0 via-enfasisColor/5 to-enfasisColor/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </article>
  )
}
