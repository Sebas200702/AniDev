import { Overlay } from 'domains/shared/components/layout/overlay'
import type { ReactNode } from 'react'

interface Props {
  banner: ReactNode
  children: ReactNode
}

export const InfoPageLayout = ({ banner, children }: Props) => {
  return (
    <>
      {banner}
      <article className="z-10 grid grid-cols-1 pt-26 md:mb-20 md:grid-cols-3 md:gap-10 md:px-20 md:pt-[35dvh] xl:grid-cols-5">
        {children}
      </article>
      <Overlay className="md:to-Primary-950 md:via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
      <Overlay className="to-Primary-950/100 via-Primary-950 z-0 h-full w-full bg-gradient-to-b via-[38dvh] md:via-[55dvh]" />
    </>
  )
}
