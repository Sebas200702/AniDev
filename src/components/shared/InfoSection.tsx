import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  ulClassName?: string
}

export const InfoSection = ({ title, children, ulClassName = '' }: Props) => {
  return (
    <section className="z-10 flex h-min border-Primary-800/30 from-Complementary  via-Primary-950 to-Complementary/95 border bg-gradient-to-br shadow-2xl w-full ease-in-out md:rounded-xl flex-col items-center justify-center row-span-2 transition-all duration-300 col-span-1 md:mt-0 mt-10">
      <header className="bg-enfasisColor/5 w-full items-center justify-center  transition-all delay-300 duration-300 ease-in-out  flex flex-row gap-4 px-4 py-1.5">
        <h2 className="text-center text-lg text-pretty">{title}</h2>
      </header>
      <ul className={`p-6 space-y-4 ${ulClassName} `}>
        {children}
      </ul>
    </section>
  )
}
