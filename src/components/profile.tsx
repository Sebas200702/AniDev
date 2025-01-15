export const Profile = () => {
  const handleClick = () => {
    document.getElementById('userDropdown')?.classList.toggle('hidden')
  }
  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <div className="hidden text-end font-medium md:block dark:text-white">
          <div>Guest</div>
        </div>
        <button onClick={handleClick}>
          <img
            className="h-10 w-10 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="Profile"
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>
      <div
        id="userDropdown"
        className="absolute right-0 top-[70px] z-50 hidden w-48 rounded-md border border-secondary/50 bg-base/50 p-4 text-base text-white shadow-lg"
      >
        <ul className="space-y-6 text-white">
          <a
            href="profile/settings"
            className="flex items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>Settings</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a
            href="/profile"
            className="flex items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </ul>
      </div>
    </>
  )
}
