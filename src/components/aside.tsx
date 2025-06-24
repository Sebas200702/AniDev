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
      <aside className="bg-Primary-950 fixed top-0 left-0 z-50 hidden h-full w-20 flex-col border-r border-white/10 md:flex">
        <nav className="mx-auto mt-10 flex h-full w-full flex-col items-center">
          <Logo />
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`hover:text-enfasisColor group flex w-full flex-col items-center gap-3 p-2 transition-all duration-200 ${
                activeItem === item.id
                  ? 'text-enfasisColor   border-enfasisColor border-r-2'
                  : 'text-Primary-100 border-transparent'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-center text-sm font-medium">
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </aside>

      <nav className="bg-Primary-950 fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`hover:text-enfasisColor group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-all duration-200 ${
                activeItem === item.id
                  ? 'text-enfasisColor'
                  : 'text-Primary-100'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="w-full truncate text-center text-xs font-medium ">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
