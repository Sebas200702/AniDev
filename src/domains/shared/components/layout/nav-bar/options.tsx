import { SettingsIcon } from '@shared/components/icons/common/settings-icon'
import { UserIcon } from '@shared/components/icons/user/user-icon'
import { SignInUp } from '@shared/components/layout/nav-bar/sign-in-up'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import type { RefObject } from 'react'

interface Props {
  isOpen: boolean
  optionRef: RefObject<HTMLUListElement | null>
}

export const ProfileOptions = ({ isOpen, optionRef }: Props) => {
  const { userInfo } = useGlobalUserPreferences()
  return (
    <ul
      ref={optionRef}
      className={`space-y-6 z-50 md:static absolute top-16 bg-Primary-950/95 md:bg-transparent  w-48 rounded-b-md  text-base text-white md:right-4 md:rounded-lg ${isOpen ? 'p-4' : ' h-0 opacity-0 pointer-events-none p-0'}`}
    >
      <li>
        <a
          href="/profile/settings"
          className="text-Primary-50 md:hover:text-enfasisColor flex items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 "
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
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
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
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
        {!userInfo?.name && <SignInUp />}
        {userInfo?.name && (
          <button className="text-Primary-50 md:hover:text-enfasisColor flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-3 text-sm transition-all duration-300 hover:bg-zinc-800/50">
            <span>Sign out</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.75"
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
      </li>
    </ul>
  )
}
