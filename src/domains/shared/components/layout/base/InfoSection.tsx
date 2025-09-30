import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  ulClassName?: string
}

export const InfoSection = ({ title, children, ulClassName = '' }: Props) => {
  return (
    <section className="border-Primary-800/30 from-Complementary via-Primary-950 to-Complementary/95 z-10 col-span-1 row-span-2 mt-10 flex h-min w-full flex-col items-center justify-center border bg-gradient-to-br shadow-2xl transition-all duration-300 ease-in-out md:mt-0 md:rounded-xl">
      <header className="bg-enfasisColor/5 flex w-full flex-row items-center justify-center gap-4 px-4 py-1.5 transition-all delay-300 duration-300 ease-in-out">
        <h2 className="text-center text-lg text-pretty">{title}</h2>
      </header>
      <ul className={`space-y-4 p-6 ${ulClassName} `}>{children}</ul>
    </section>
  )
}
