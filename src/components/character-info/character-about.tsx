import type { PersonAbout } from 'types'

interface Props {
  about: PersonAbout
}
export const CharacterAbout = ({ about }: Props) => {
  const { description, details, favorites } = about
  return (
    <section className="xl:col-span-3 col-span-1 md:col-span-2 border-Primary-800/30 from-Complementary via-Primary-950 to-Complementary/95  relative z-10 flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br shadow-2xl transition-all duration-500 ease-in-out hover:shadow-xl">
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 md:p-6 backdrop-blur-md">
        <h2 className="text-lxx">About</h2>
      </div>
      <div className="p-4 md:p-6">
        {description && (
          <p className="text-m leading-relaxed line-clamp-6 mb-6">
            {description}
          </p>
        )}

        {details && Object.keys(details).length > 0 && (
          <>
            <h3 className="mb-4 text-lx font-semibold text-white ">Details</h3>
            <ul className="grid grid-cols-2 gap-2 text-s text-Primary-200 mb-6">
              {Object.entries(details).map(([key, value]) =>
                value ? (
                  <li key={key}>
                    <span className="capitalize text-white">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    {'  '}
                    {value}
                  </li>
                ) : null
              )}
            </ul>
          </>
        )}

        {favorites && Object.keys(favorites).length > 0 && (
          <>
            <h3 className="mb-4 text-lx font-semibold text-white">Favorites</h3>
            <div className="space-y-2 grid grid-cols-2">
              {Object.entries(favorites).map(([category, values]) =>
                values.length > 0 ? (
                  <div key={category}>
                    <p className="capitalize text-sm font-semibold text-Primary-100">
                      {category}
                    </p>
                    <p className="text-s text-Primary-200">
                      {values.join(', ')}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
