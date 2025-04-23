import { useEffect, useRef } from 'react'

import { useGlobalUserPreferences } from '@store/global-user'
import { signOut } from 'auth-astro/client'

/**
 * Profile component renders the user's profile information and a dropdown menu.
 *
 * @description This component displays the user's avatar and name in the navigation bar,
 * providing access to a dropdown menu with navigation options and authentication actions.
 * The dropdown menu contains links to the user's profile page, settings, and a logout button
 * or sign up link depending on authentication status.
 *
 * The component is fully responsive, adapting to different screen sizes by showing or hiding
 * the username based on available space. The dropdown menu is toggled by clicking on the user's
 * avatar, providing a clean and intuitive user interface. The menu appears below the avatar with
 * a subtle animation and contains easily recognizable icons for each action.
 *
 * For authenticated users, the component displays the user's avatar and name, with options to
 * navigate to profile settings, view their profile page, or sign out. For guests, it shows a
 * default avatar and provides a sign-up option. The component handles the authentication state
 * transition by calling the appropriate sign-out function when requested.
 *
 * @param {Props} props - The component props
 * @param {Session | null} props.userInfo - The user session information, or null if not logged in
 * @returns {JSX.Element} The rendered profile component with dropdown menu
 *
 * @example
 * <Profile userInfo={session} />
 */
export const Profile = () => {
  const { userInfo } = useGlobalUserPreferences()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleClick = () => {
    dropdownRef.current?.classList.toggle('hidden')
  }
  const handleLogout = async () => {
    await signOut()
  }
  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        dropdownRef.current.classList.add('hidden')
      }
    })
  }, [dropdownRef, buttonRef])
  return (
    <>
      <article className="flex items-center justify-end gap-4">
        <span className="text-s hidden text-end md:block dark:text-white">
          {userInfo?.name ?? 'Guest'}
        </span>
        <button
          className="cursor-pointer"
          title="Options"
          onClick={handleClick}
          ref={buttonRef}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={userInfo?.avatar ?? '/placeholder.webp'}
            alt="Profile"
            loading="lazy"
            decoding="async"
          />
        </button>
      </article>
      <div
        ref={dropdownRef}
        className="bg-Primary-950/60 absolute top-16 right-0 z-50 hidden w-48 rounded-b-md p-4 text-base text-white shadow-lg backdrop-blur-sm md:right-20"
      >
        <ul className="space-y-6">
          <li>
            <a
              href="/profile/settings"
              className="text-Primary-50 md:hover:text-enfasisColor flex items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
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
              className="text-Primary-50 md:hover:text-enfasisColor flex items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
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
                className="text-Primary-50 md:hover:text-enfasisColor flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
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
                className="text-Primary-50 md:hover:text-enfasisColor flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50"
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
