interface EmptyStateProps {
  message: string
  showButton?: boolean
}

export const EmptyState = ({
  message,
  showButton = false,
}: EmptyStateProps) => (
  <div className="col-span-6 mt-20 flex flex-col items-center justify-center gap-4">
    <p className="text-l">{message}</p>
    {showButton && (
      <a href="/signin" className="button-primary px-4 py-2">
        Sign in
      </a>
    )}
  </div>
)
