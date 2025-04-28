import { CalendarIcon } from '@components/icons/calendar-icon'
import { ClockIcon } from '@components/icons/clock-icon'
import { ScoredByIcon } from '@components/icons/scored-by-icon'
import { SourceIcon } from '@components/icons/source-icon'
import { StarIcon } from '@components/icons/star-icon'
import { AiredDayIcon } from '@icons/aired-day-icon'
import { AiredToIcon } from '@icons/aired-to-icon'
import { AiredFromIcon } from '@icons/aried-from-icon'
import { EpisodeIcon } from '@icons/episode-icon'
import { IdIcon } from '@icons/id-icon'
import { OtherTitlesIcon } from '@icons/other-titles-icon'
import { ProducerIcon } from '@icons/producer-icon'
import { SeasonIcon } from '@icons/season-icon'
import { StatusIcon } from '@icons/status-icon'
import { StudioIcon } from '@icons/studio-icon'
import { ThemesIcon } from '@icons/themes-icon'
import { TitleJapaneseIcon } from '@icons/title-japanese-icon'
import { TypeIcon } from '@icons/type-icon'
import type { Anime } from 'types'

interface Props {
  animeData: Anime
}

/**
 * AnimeDetails component displays detailed information about an anime in a structured format.
 *
 * @description This component organizes and presents comprehensive information about an anime
 * including its status, type, studios, themes, and other metadata. Each piece of information
 * is displayed with an appropriate icon for visual enhancement and better user experience.
 *
 * The component takes an anime data object and extracts various properties such as status,
 * type, studios, themes, producers, and more. It then creates a structured list of these
 * details, each accompanied by a relevant icon. The component handles missing data gracefully
 * by displaying "Unknown" for any undefined values.
 *
 * The UI presents the details in a styled section with a header and a scrollable list. Each
 * detail is rendered as a list item with an icon and formatted text. Special styling is applied
 * to certain categories like Status, Type, and Season to visually differentiate them.
 *
 * @param {Props} props - The component props
 * @param {Anime} props.animeData - The anime object containing all details to display
 * @returns {JSX.Element} The rendered section containing organized anime details
 *
 * @example
 * <AnimeDetails animeData={animeData} />
 */
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
    duration,
    score,
    year,
  } = animeData

  const animeDetails = [
    { name: 'Status', value: status, icon: StatusIcon },
    { name: 'Season', value: season, icon: SeasonIcon },
    { name: 'Type', value: type, icon: TypeIcon },
    { name: 'Studios', value: studios.join(', '), icon: StudioIcon },
    { name: 'Themes', value: themes?.join(', '), icon: ThemesIcon },
    { name: 'Duration', value: duration, icon: ClockIcon },
    { name: 'Score', value: score, icon: StarIcon },
    { name: 'Year', value: year, icon: CalendarIcon },
    {
      name: 'Producers',
      value: producers?.slice(0, 3).join(', '),
      icon: ProducerIcon,
    },

    { name: 'Aired Day', value: aired_day, icon: AiredDayIcon },
    { name: 'Episodes', value: episodes, icon: EpisodeIcon },
    { name: 'Scored By', value: scored_by, icon: ScoredByIcon },
    { name: 'Aired To', value: aired_to, icon: AiredToIcon },
    { name: 'Aired From', value: aired_from, icon: AiredFromIcon },
    { name: 'Title Japanese', value: title_japanese, icon: TitleJapaneseIcon },
    {
      name: 'Title Synonyms',
      value: title_synonyms.slice(0, 3).join(', '),
      icon: OtherTitlesIcon,
    },
    { name: 'Mal ID', value: mal_id, icon: IdIcon },
    { name: 'Source', value: source, icon: SourceIcon },
  ]

  return (
    <section className="flex h-min w-full flex-col items-center justify-center px-10 md:col-span-1 md:px-0">
      <header className="bg-enfasisColor w-[80%] items-center justify-center rounded-t-xl px-4 py-1 backdrop-blur-md">
        <h2 className="text-l text-center text-pretty">Details</h2>
      </header>
      <ul className="bg-Complementary flex w-full flex-col gap-5 rounded-md p-8">
        {animeDetails.map((detail) => (
          <li
            className="flex w-full flex-row items-center gap-4 capitalize"
            key={detail.name}
            title={detail.name}
          >
            {detail.icon && (
              <detail.icon
                className={`h-full max-h-5 w-full max-w-5 ${detail.name !== 'Status' && detail.name !== 'Type' && detail.name !== 'Season' ? 'text-enfasisColor' : ''}`}
                season={season ?? ''}
                status={status}
                type={type}
              />
            )}
            <span className="text-s text-pretty capitalize">
              {!detail.value ? 'Unknown' : detail.value.toString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
