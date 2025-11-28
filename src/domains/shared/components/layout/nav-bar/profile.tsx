import { ProfileLoader } from '@shared/components/layout/nav-bar/profil-loader'
import { Picture } from '@shared/components/media/picture'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEffect, useState, type RefObject } from 'react'

interface Props {
  toggleOptions: () => void
  buttonRef: RefObject<HTMLButtonElement | null>
}

export const Profile = ({ toggleOptions, buttonRef }: Props) => {
  const { userInfo } = useGlobalUserPreferences()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!globalThis.document) return
    setIsLoading(false)
  }, [globalThis.document])

  if (isLoading) return <ProfileLoader />
  return (
    <article className="flex h-10 w-10 items-center justify-end">
      <button
        className="flex cursor-pointer flex-row items-center gap-2"
        title="Options"
        onClick={toggleOptions}
        ref={buttonRef}
      >
        <Picture
          styles="object-cover relative rounded-full w-full h-full object-center aspect-square"
          image={userInfo?.avatar || ''}
          placeholder={userInfo?.avatar || ''}
          alt={`Avatar of  ${userInfo?.name}`}
        />
      </button>
    </article>
  )
}
