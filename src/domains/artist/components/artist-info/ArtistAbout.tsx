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
      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-4 md:p-6 backdrop-blur-md">
        <h2 className="text-lxx">About</h2>
      </div>
      <div className="p-4 md:p-6 space-y-6">
        {description && (
          <p className="text-m leading-relaxed line-clamp-6">{description}</p>
        )}

        {details && Object.keys(details).length > 0 && (
          <div>
            <h3 className="mb-4 text-lx font-semibold text-white ">Details</h3>
            <ul className="grid grid-cols-2 gap-2 text-s text-Primary-200">
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
          </div>
        )}

        {members && members.length > 0 && (
          <div>
            <h3 className="mb-4 text-xl font-semibold text-white">Members</h3>
            <ul className="space-y-2">
              {members.map((member, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-Primary-900/40 px-3 py-2 text-sm text-white shadow-sm"
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
          </div>
        )}

        {awards && awards.length > 0 && (
          <div>
            <h3 className="mb-4 text-lx font-semibold text-white">Awards</h3>
            <ul className="list-disc list-inside text-s text-Primary-200">
              {awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        )}

        {links && Object.keys(links).length > 0 && (
          <div>
            <h3 className="mb-4 text-lx font-semibold text-white">Links</h3>
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
