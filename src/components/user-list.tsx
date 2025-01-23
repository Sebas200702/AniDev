const WatchingIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
      <path d="M21 12c-2.4 4-5.4 6-9 6-3.6 0-6.6-2-9-6 2.4-4 5.4-6 9-6 3.6 0 6.6 2 9 6" />
    </svg>
  )
}
const CompletedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}
const ToWatchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M18 7v14l-6-4-6 4V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4z" />
    </svg>
  )
}
const CollectionIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
    </svg>
  )
}
const sections = [
  {
    label: 'Watching',
    icon: WatchingIcon,
  },
  {
    label: 'To Watch',
    icon: ToWatchIcon,
  },
  {
    label: 'Watched',
    icon: CompletedIcon,
  },
  {
    label: 'Collections',
    icon: CollectionIcon,
  },
]
export const UserList = () => {
  return (
    <div>
      <nav className="mx-14 flex flex-row justify-between gap-4">
        <ul className="flex flex-row p-4">
          {sections.map((section) => (
            <li key={section.label}>
              <button className="flex items-center gap-3 border-b border-gray-100/20 px-6 py-3 text-sm text-gray-400 transition-all duration-300 hover:bg-zinc-800/50">
                <section.icon className="h-6 w-6" />
                <span className="text-lg">{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
