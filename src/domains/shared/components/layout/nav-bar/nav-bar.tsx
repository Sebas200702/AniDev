import { ProfileOptions } from '@shared/components/layout/nav-bar/options'
import { Profile } from '@shared/components/layout/nav-bar/profile'
import { useProfileOptions } from '@shared/hooks/useProfileOptions'
import { RandomAnimeButton } from '@shared/components/layout/nav-bar/random-anime'
import { RestorePlayerButton } from '@shared/components/layout/nav-bar/retore-player-button'
import { SearchButton } from '@shared/components/layout/nav-bar/search-button'
import { Logo } from '@shared/components/ui/logo'

export const NavBar = () => {
  const { isOpen, toggleOptions, optionRef, buttonRef } = useProfileOptions()
  return (
    <nav className="bg-Primary-950/80 fixed md:top-3 right-0 z-50 flex w-full md:w-min justify-between  flex-row items-center  gap-2 px-4 py-2 backdrop-blur-sm   md:px-4 md:pr-10 md:rounded-l-2xl">
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="flex-col items-center gap-2">
        <div className=" flex flex-row items-center gap-4">
          <SearchButton />
          <RestorePlayerButton />
          <RandomAnimeButton />
          <div className="bg-Primary-100/30 h-6 w-0.5 rounded-full"></div>

          <Profile toggleOptions={toggleOptions} buttonRef={buttonRef} />
        </div>
        <ProfileOptions isOpen={isOpen} optionRef={optionRef} />
      </div>
    </nav>
  )
}
