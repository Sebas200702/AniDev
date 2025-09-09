import { SeiyuuInfo } from '@components/character-info/seiyuu'
import { InfoSection } from '@components/shared/InfoSection'
import type { VoiceActor } from 'types'

interface Props {
  seiyuus: VoiceActor[]
}

export const SeiyuuList = ({ seiyuus }: Props) => {
  return (
    <InfoSection title="Characters" ulClassName="w-full">
      {seiyuus.map((seiyuu) => (
        <SeiyuuInfo key={seiyuu.voice_actor_id} seiyuu={seiyuu} />
      ))}
    </InfoSection>
  )
}
