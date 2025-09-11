import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}
export const MainInfo = ({ children }: Props) => {
  return (
    <section className="xl:col-span-3  col-span-1 md:col-span-2 border-Primary-800/30 from-Complementary via-Primary-950 to-Complementary/95  relative z-10 flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br shadow-2xl transition-all duration-500 ease-in-out hover:shadow-xl">
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />
      {children}
    </section>
  )
}
