import { SeiyuuCard } from 'domains/seiyuu/components/seiyuu-card/seiyuu-card'
import { InfoSection } from 'domains/shared/components/layout/base/InfoSection'
import type { VoiceActor } from 'types'

interface Props {
  seiyuus: VoiceActor[]
}

export const SeiyuuList = ({ seiyuus }: Props) => {
  return (
    <InfoSection title="Voice Actors" ulClassName="w-full">
      {seiyuus.map((seiyuu) => (
        <SeiyuuCard key={seiyuu.voice_actor_id} seiyuu={seiyuu} />
      ))}
    </InfoSection>
  )
}
