import { useAsideStore } from '@store/aside-store'
import { Logo } from 'domains/shared/components/logo'
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
      <aside
        className={`fixed top-0 left-0 z-50 hidden h-full w-20 flex-col border-r border-white/5 text-white md:flex`}
      >
        <nav className="mt-10 flex h-full w-full flex-col items-center gap-6">
          <Logo />
          {menuItems.map((item) => (
            <div
              className="group relative flex flex-row items-center"
              key={item.id}
            >
              <a
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                title={'Navigate to ' + item.label}
                aria-label={item.label}
                className={`group group-hover flex flex-col items-center rounded-xl p-3 transition-all duration-200 ${activeItem === item.id ? 'bg-enfasisColor/50 hover:bg-enfasisColor/60' : 'hover:bg-Primary-900'}`}
              >
                <item.icon className="h-6.5 w-6.5" />
              </a>
              <span className="bg-enfasisColor/80 pointer-events-none absolute translate-x-1/2 rounded-md px-3 py-1.5 text-sm opacity-0 transition-all duration-200 group-hover:translate-x-15 group-hover:opacity-100">
                {item.label}
              </span>
            </div>
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
              <item.icon className="h-6 w-6 flex-shrink-0" />
              <span className="text-xs">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
