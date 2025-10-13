import type { ReactNode } from 'react'

interface LoaderProps {
  children?: ReactNode
  className: string
}

export const Loader = ({ children, className }: LoaderProps) => {
  return (
    <div className={`animate-pulse duration-300 rounded-md  ${className}`}>
      {children}
    </div>
  )
}
