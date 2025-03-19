import type { Session } from 'types'
import { signOut } from 'auth-astro/client'

interface Props {
  userInfo: Session | null
}
export const Profile = ({ userInfo }: Props) => {
  const handleClick = () => {
    document.getElementById('userDropdown')?.classList.toggle('hidden')
  }
  const handleLogout = async () => {
    await signOut()
  }
  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <div className="text-s hidden text-end md:block dark:text-white">
          <div>{userInfo?.name ?? 'Guest'}</div>
        </div>
        <button onClick={handleClick}>
          <img
            className="h-10 w-10 rounded-full"
            src={userInfo?.avatar ?? '/profile-picture-5.webp'}
            alt="Profile"
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>
      <div
        id="userDropdown"
        className="border-Primary-950/50 bg-Primary-950/50 absolute top-[70px] right-0 z-50 hidden w-48 rounded-md border p-4 text-base text-white shadow-lg"
      >
        <ul className="space-y-6 text-white">
          <li>
            <a
              href="/profile/settings"
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
              <span className="text-gray-400 dark:text-gray-500">
                {userInfo?.name}
              </span>
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
          </li>
          <li>
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
          </li>
          <li>
            {userInfo?.name && (
              <button
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
                onClick={handleLogout}
              >
                <span>Sign out</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" stroke="none" />
                  <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
                  <path d="M9 12h12l-3-3M18 15l3-3" />
                </svg>
              </button>
            )}
            {!userInfo?.name && (
              <a
                href="/signup"
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
              >
                <span>Sign up</span>
              </a>
            )}
          </li>
        </ul>
      </div>
    </>
  )
}
