import { ProfileOptions } from '@shared/components/layout/nav-bar/options'
import { Profile } from '@shared/components/layout/nav-bar/profile'
import { RandomAnimeButton } from '@shared/components/layout/nav-bar/random-anime'
import { RestorePlayerButton } from '@shared/components/layout/nav-bar/retore-player-button'
import { SearchButton } from '@shared/components/layout/nav-bar/search-button'
import { Logo } from '@shared/components/ui/logo'
import { useProfileOptions } from '@shared/hooks/useProfileOptions'

export const NavBar = () => {
  const { isOpen, toggleOptions, optionRef, buttonRef } = useProfileOptions()
  return (
    <nav className="bg-Primary-950/80 fixed md:top-4 md:right-4 z-50 flex w-full md:w-min justify-between  flex-row items-center  gap-2 px-2 py-2 backdrop-blur-sm   md:px-4 md:rounded-2xl">
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="">
        <div className=" flex flex-row w-full gap-2  items-center justify-between">
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
