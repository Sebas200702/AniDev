interface StatusPoinProps {
    class: string
    status?: string
  }
export const StatusPoin = ({ class: className, status }: StatusPoinProps) => {
    return (
      <div title={status}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className={className}
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z" />
        </svg>
      </div>
    )
  }
