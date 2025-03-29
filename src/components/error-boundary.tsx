import type { ErrorInfo, ReactNode } from 'react'

import { toast } from '@pheralb/toast'
import { Component } from 'react'
import { ToastType } from 'types'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class SearchResultsErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)

    toast[ToastType.Error]({
      text: 'An error occurred while loading search results',
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full p-4 text-center text-red-500">
            Ups, Something went wrong.
          </div>
        )
      )
    }

    return this.props.children
  }
}
