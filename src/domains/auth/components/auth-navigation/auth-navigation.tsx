interface AuthNavigationProps {
  currentStep: number
  isFirstStep: boolean
  isLastStep: boolean
  isSignUp: boolean
  loading: boolean
  onPrev: () => void
}

export const AuthNavigation = ({
  currentStep,
  isFirstStep,
  isLastStep,
  isSignUp,
  loading,
  onPrev,
}: AuthNavigationProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Botón Anterior */}
      {isFirstStep ? (
        <div className="w-20" /> // Espaciador invisible
      ) : (
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-Primary-300 hover:text-enfasisColor transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
      )}

      {/* Indicador de progreso */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i + 1 <= currentStep ? 'bg-enfasisColor' : 'bg-Primary-600/30'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-Primary-400 font-medium">
          {currentStep} of 3
        </span>
      </div>

      {/* Botón Siguiente/Enviar */}
      {isLastStep ? (
        <button
          type="submit"
          disabled={loading}
          className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-enfasisColor to-enfasisColor/80 text-white text-sm font-medium rounded-lg hover:from-enfasisColor/90 hover:to-enfasisColor/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-enfasisColor/25"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {isSignUp ? 'Create account' : 'Sign in'}
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="group flex items-center gap-2 px-6 py-2 bg-enfasisColor/10 text-enfasisColor text-sm font-medium rounded-lg hover:bg-enfasisColor/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-enfasisColor/30 hover:border-enfasisColor/50"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            <>
              Next
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  )
}
