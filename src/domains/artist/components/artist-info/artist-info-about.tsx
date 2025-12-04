import type { PersonAbout } from '@user/types'
import { MainInfo } from 'domains/shared/components/layout/base/MainInfo'

interface Props {
  about: PersonAbout
}
export const ArtistAbout = ({ about }: Props) => {
  const { description, details, favorites, members, awards, links } = about
  return (
    <MainInfo>
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />
      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 backdrop-blur-md md:p-6">
        <h2 className="text-lxx">About</h2>
      </div>
      <div className="space-y-6 p-4 md:p-6">
        {description && (
          <p className="text-m line-clamp-6 leading-relaxed">{description}</p>
        )}

        {details && Object.keys(details).length > 0 && (
          <div>
            <h3 className="text-lx mb-4 font-semibold text-white">Details</h3>
            <ul className="text-s text-Primary-200 grid grid-cols-2 gap-2">
              {Object.entries(details).map(([key, value]) =>
                value ? (
                  <li key={key}>
                    <span className="text-white capitalize">
                      {key.replaceAll('_', ' ')}:
                    </span>
                    {'  '}
                    {value}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {members && members.length > 0 && (
          <div>
            <h3 className="mb-4 text-xl font-semibold text-white">Members</h3>
            <ul className="space-y-2">
              {members.map((member, i) => (
                <li
                  key={i}
                  className="bg-Primary-900/40 flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white shadow-sm"
                >
                  <span className="font-medium">{member.name}</span>
                  <span className="text-Primary-50 text-xs italic">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {favorites && Object.keys(favorites).length > 0 && (
          <div>
            <h3 className="text-lx mb-4 font-semibold text-white">Favorites</h3>
            <div className="grid grid-cols-2 space-y-2">
              {Object.entries(favorites).map(([category, values]) =>
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
          </div>
        )}

        {awards && awards.length > 0 && (
          <div>
            <h3 className="text-lx mb-4 font-semibold text-white">Awards</h3>
            <ul className="text-s text-Primary-200 list-inside list-disc">
              {awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        )}

        {links && Object.keys(links).length > 0 && (
          <div>
            <h3 className="text-lx mb-4 font-semibold text-white">Links</h3>
            <ul className="flex gap-4">
              {Object.entries(links).map(([name, url]) =>
                url ? (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-enfasisColor hover:underline"
                    >
                      {name}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>
    </MainInfo>
  )
}
