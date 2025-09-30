import type { Seiyuu } from '@seiyuu/types'
import { SeiyuuCard } from 'domains/seiyuu/components/seiyuu-card/seiyuu-card'
import { InfoSection } from 'domains/shared/components/layout/base/InfoSection'

interface Props {
  seiyuus: Seiyuu[]
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
