export const ErrorFallback = ({
  error,
  resetError,
}: {
  error?: Error
  resetError?: () => void
}) => {
  return (
    <div className="border-Primary-800 bg-Primary-950 flex flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center text-white shadow-lg">
      <h2 className="text-xl font-bold text-red-400">
        Something went wrong 😢
      </h2>
      {error?.message && (
        <p className="max-w-md text-sm text-gray-300">{error.message}</p>
      )}
      {resetError && (
        <button onClick={resetError} className="button-primary">
          Retry
        </button>
      )}
    </div>
  )
}
