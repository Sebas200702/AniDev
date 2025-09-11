import { AiredDayIcon } from 'domains/shared/components/icons/aired-day-icon'
import { AiredToIcon } from 'domains/shared/components/icons/aired-to-icon'
import { AiredFromIcon } from 'domains/shared/components/icons/aried-from-icon'
import { CalendarIcon } from 'domains/shared/components/icons/calendar-icon'
import { ClockIcon } from 'domains/shared/components/icons/clock-icon'
import { EpisodeIcon } from 'domains/shared/components/icons/episode-icon'
import { IdIcon } from 'domains/shared/components/icons/id-icon'
import { OtherTitlesIcon } from 'domains/shared/components/icons/other-titles-icon'
import { ProducerIcon } from 'domains/shared/components/icons/producer-icon'
import { ScoredByIcon } from 'domains/shared/components/icons/scored-by-icon'
import { SeasonIcon } from 'domains/shared/components/icons/season-icon'
import { SourceIcon } from 'domains/shared/components/icons/source-icon'
import { StarIcon } from 'domains/shared/components/icons/star-icon'
import { StatusIcon } from 'domains/shared/components/icons/status-icon'
import { StudioIcon } from 'domains/shared/components/icons/studio-icon'
import { ThemesIcon } from 'domains/shared/components/icons/themes-icon'
import { TitleJapaneseIcon } from 'domains/shared/components/icons/title-japanese-icon'
import { TypeIcon } from 'domains/shared/components/icons/type-icon'
import { InfoSection } from 'domains/shared/components/layout/base/InfoSection'
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
    broadcast_day,
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
    { name: 'Studios', value: studios?.join(', '), icon: StudioIcon },
    { name: 'Themes', value: themes?.join(', '), icon: ThemesIcon },
    { name: 'Duration', value: duration, icon: ClockIcon },
    { name: 'Score', value: score, icon: StarIcon },
    { name: 'Year', value: year, icon: CalendarIcon },
    {
      name: 'Producers',
      value: producers?.slice(0, 3).join(', '),
      icon: ProducerIcon,
    },

    { name: 'Broadcast Day', value: broadcast_day, icon: AiredDayIcon },
    { name: 'Episodes', value: episodes, icon: EpisodeIcon },
    { name: 'Scored By', value: scored_by, icon: ScoredByIcon },
    { name: 'Aired To', value: aired_to, icon: AiredToIcon },
    { name: 'Aired From', value: aired_from, icon: AiredFromIcon },
    { name: 'Title Japanese', value: title_japanese, icon: TitleJapaneseIcon },
    {
      name: 'Title Synonyms',
      value: title_synonyms?.slice(0, 3).join(', '),
      icon: OtherTitlesIcon,
    },
    { name: 'Mal ID', value: mal_id, icon: IdIcon },
    { name: 'Source', value: source, icon: SourceIcon },
  ]

  return (
    <InfoSection title="Details">
      {animeDetails.map((detail) => (
        <li
          className="flex w-full flex-row items-center gap-4 py-2 capitalize"
          key={detail.name}
          title={detail.name}
        >
          {detail.icon && (
            <detail.icon
              className={`h-full max-h-5 w-full max-w-5 ${detail.name !== 'Status' && detail.name !== 'Type' && detail.name !== 'Season' ? 'text-enfasisColor' : ''}`}
              season={season ?? ''}
              status={status}
              type={type ?? 'unknown'}
            />
          )}
          <span className="text-s text-pretty capitalize">
            {!detail.value ? 'Unknown' : detail.value.toString()}
          </span>
        </li>
      ))}
    </InfoSection>
  )
}
