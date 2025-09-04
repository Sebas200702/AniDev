import { SeiyuuInfo } from '@components/character-info/seiyuu'
import type { VoiceActor } from 'types'

interface Props {
  Seiyuus: VoiceActor[]
}

export const SeiyuuList = ({ Seiyuus }: Props) => {
  return (
    <section className="w-full h-full items-center   relative z-10 flex flex-col overflow-hidden   row-span-2  ">
      <header
        className={`bg-enfasisColor w-[80%] items-center  rounded-t-xl justify-center transition-all delay-300 duration-300 ease-in-out flex flex-row gap-4 px-4 py-1.5`}
      >
        <h3 className="text-center text-lg text-pretty">Seiyuus</h3>
      </header>
      <ul className="w-full">
        {Seiyuus.map((seiyuu) => (
          <SeiyuuInfo key={seiyuu.voice_actor_id} seiyuu={seiyuu} />
        ))}
      </ul>
    </section>
  )
}
