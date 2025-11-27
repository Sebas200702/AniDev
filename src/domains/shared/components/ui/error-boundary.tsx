import { clientLogger } from '@libs/logger'
import { toast } from '@pheralb/toast'
import { ToastType } from '@shared/types'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
const logger = clientLogger.create('SearchResultsErrorBoundary')

/**
 * Props for the ErrorBoundary component.
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - The child components to be wrapped by the error boundary
 * @property {ReactNode} [fallback] - Optional custom fallback UI to display when an error occurs
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * State for the ErrorBoundary component.
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Indicates whether an error has been caught
 */
interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Error boundary component specifically for handling errors in search results.
 *
 * @description
 * This component implements React's error boundary pattern to catch and handle
 * JavaScript errors in the search results component tree. It provides a fallback UI
 * when errors occur and displays a toast notification to inform the user.
 *
 * The component maintains an internal state to track whether an error has been
 * caught and provides a default fallback UI if none is specified. It logs errors
 * to the console for debugging purposes and uses the toast system to notify users
 * of errors in a non-intrusive way.
 *
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 *
 * @example
 * <SearchResultsErrorBoundary fallback={<CustomErrorComponent />}>
 *   <SearchResults />
 * </SearchResultsErrorBoundary>
 */
export class SearchResultsErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Updates the component's state when an error is caught.
   * @param {Error} error - The error that was caught
   * @returns {ErrorBoundaryState} The new state indicating an error has occurred
   */
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  /**
   * Handles errors caught by the error boundary.
   * Logs the error details and displays a toast notification.
   * @param {Error} error - The error that was caught
   * @param {ErrorInfo} errorInfo - Additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo)

    toast[ToastType.Error]({
      text: 'An error occurred while loading search results',
    })
  }

  /**
   * Renders either the fallback UI or children based on error state.
   * @returns {JSX.Element} The rendered component tree
   */
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
