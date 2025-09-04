import type { ReactNode } from 'react'

interface Props {
  title: string
  children?: ReactNode
}

export const Header = ({ title, children }: Props) => {
  return (
    <header className="anime-header md:px-0 relative z-10 my-4 flex w-full flex-col justify-center gap-6 px-4 md:col-span-2 md:gap-8 xl:col-span-4 xl:mt-0">
      <h1 className="title mx-auto max-w-[30ch] text-center text-pretty md:mx-0 md:text-left md:text-wrap">
        {title}
      </h1>
      {children && (
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-3 md:justify-start"
          aria-label="Categorías y géneros"
        >
          {children}
        </div>
      )}
    </header>
  )
}
