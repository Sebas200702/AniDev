import { Logo } from '@components/logo'
import { useAsideStore } from '@store/aside-store'
import { useEffect } from 'react'

export const AsideNav = () => {
  const { setActiveItem, activeItem, items: menuItems } = useAsideStore()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const pathname = window.location.pathname
    const item = menuItems.find((item) => item.href === pathname)
    if (item) {
      setActiveItem(item.id)
      return
    }

    setActiveItem('')
  }, [menuItems])

  return (
    <>

      <aside className="hidden md:flex fixed top-0 left-0 z-50 w-20 h-full bg-Primary-950 flex-col border-r border-white/10">
        <nav className="flex flex-col mt-10 h-full w-full items-center mx-auto">
          <Logo />
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center flex-col gap-3 p-2 w-full transition-all duration-200 hover:text-enfasisColor group ${
                activeItem === item.id
                  ? 'text-enfasisColor bg-enfasisColor/10 border-r-2 border-enfasisColor'
                  : 'text-Primary-100 border-transparent'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-sm font-medium text-center">
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </aside>


      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-Primary-950 border-t border-white/10">
        <div className="flex justify-around items-center h-16 px-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-all duration-200 hover:text-enfasisColor group min-w-0 flex-1 ${
                activeItem === item.id
                  ? 'text-enfasisColor bg-enfasisColor/10'
                  : 'text-Primary-100'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium text-center truncate w-full">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
