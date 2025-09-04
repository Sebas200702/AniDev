import { SeiyuuInfo } from '@components/character-info/seiyuu'
import type { VoiceActor } from 'types'
import { InfoSection } from '@components/shared/InfoSection'

interface Props {
  characters: VoiceActor[]
}

export const SeiyuuList = ({ characters }: Props) => {
  return (
    <InfoSection title="Characters" ulClassName='w-full'>
      {characters.map((character) => (
        <SeiyuuInfo key={character.voice_actor_id} seiyuu={character} />
      ))}
    </InfoSection>
  )
}
