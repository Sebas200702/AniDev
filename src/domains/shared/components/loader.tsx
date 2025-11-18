import type { ReactNode } from 'react'

interface LoaderProps {
  children?: ReactNode
  className: string
}

export const Loader = ({ children, className }: LoaderProps) => {
  return (
    <div className={`animate-pulse rounded-md duration-300 ${className}`}>
      {children}
    </div>
  )
}
