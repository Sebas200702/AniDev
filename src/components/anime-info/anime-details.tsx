import type { Anime } from 'types'
interface Props {
  animeData: Anime
}

export const AnimeDetails = ({ animeData }: Props) => {
  const {
    status,
    type,
    studios,
    themes,
    producers,
    season,
    aired_day,
    episodes,
    scored_by,
    aired_to,
    aired_from,
    title_japanese,
    title_synonyms,
    mal_id,
    source,
  } = animeData

  const animeDetails = [
    { name: 'Status', value: status },
    { name: 'Type', value: type },
    { name: 'Studios', value: studios.join(', ') },
    { name: 'Themes', value: themes?.join(', ') },
    { name: 'Producers', value: producers?.slice(0, 3).join(', ') },
    { name: 'Season', value: season },
    { name: 'Aired Day', value: aired_day },
    { name: 'Episodes', value: episodes },
    { name: 'Scored By', value: scored_by },
    { name: 'Aired To', value: aired_to },
    { name: 'Aired From', value: aired_from },
    { name: 'Title Japanese', value: title_japanese },
    { name: 'Title Synonyms', value: title_synonyms.slice(0, 3).join(', ') },
    { name: 'Mal ID', value: mal_id },
    { name: 'Source', value: source },
  ]

  return (
    <section className="flex h-min flex-col items-center   w-full md:col-span-1 justify-center">
      <header className="bg-enfasisColor w-[80%] items-center justify-center rounded-t-xl px-4 py-1 backdrop-blur-md">
        <h2 className="text-l text-center text-pretty">Details</h2>
      </header>
      <ul className="bg-Complementary xl text-m flex  w-full flex-col gap-5 rounded-md p-4">
        {animeDetails.map((detail) => (
          <li className="flex w-full flex-row gap-1" key={detail.name}>
            <span className="text-gray-50/70">{detail.name}: </span>
            {!detail.value ? 'Unknown' : detail.value}
          </li>
        ))}
      </ul>
    </section>
  )
}
