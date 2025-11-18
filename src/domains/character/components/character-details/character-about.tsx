import { MainInfo } from '@shared/components/layout/base/MainInfo'
import type { PersonAbout } from '@user/types'

interface Props {
  about: PersonAbout | null
}
export const CharacterAbout = ({ about }: Props) => {
  return (
    <MainInfo>
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 backdrop-blur-md md:p-6">
        <h2 className="text-lxx">About</h2>
      </div>
      <div className="p-4 md:p-6">
        {!about && (
          <p className="text-m mb-6 leading-relaxed">
            No additional information available.
          </p>
        )}
        {about?.description && (
          <p className="text-m mb-6 line-clamp-6 leading-relaxed">
            {about.description}
          </p>
        )}

        {about?.details && Object.keys(about.details).length > 0 && (
          <>
            <h3 className="text-lx mb-4 font-semibold text-white">Details</h3>
            <ul className="text-s text-Primary-200 mb-6 grid grid-cols-2 gap-2">
              {Object.entries(about.details).map(([key, value]) =>
                value ? (
                  <li key={key}>
                    <span className="text-white capitalize">
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

        {about?.favorites && Object.keys(about.favorites).length > 0 && (
          <>
            <h3 className="text-lx mb-4 font-semibold text-white">Favorites</h3>
            <div className="grid grid-cols-2 space-y-2">
              {Object.entries(about.favorites).map(([category, values]) =>
                values.length > 0 ? (
                  <div key={category}>
                    <p className="text-Primary-100 text-sm font-semibold capitalize">
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
    </MainInfo>
  )
}
