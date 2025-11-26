import type { Anime } from '@anime/types'
import { AiredDayIcon } from '@shared/components/icons/anime/aired-day-icon'
import { AiredToIcon } from '@shared/components/icons/anime/aired-to-icon'
import { AiredFromIcon } from '@shared/components/icons/anime/aried-from-icon'
import { EpisodeIcon } from '@shared/components/icons/anime/episode-icon'
import { IdIcon } from '@shared/components/icons/anime/id-icon'
import { OtherTitlesIcon } from '@shared/components/icons/anime/other-titles-icon'
import { ProducerIcon } from '@shared/components/icons/anime/producer-icon'
import { ScoredByIcon } from '@shared/components/icons/anime/scored-by-icon'
import { SeasonIcon } from '@shared/components/icons/anime/season-icon'
import { SourceIcon } from '@shared/components/icons/anime/source-icon'
import { StatusIcon } from '@shared/components/icons/anime/status-icon'
import { StudioIcon } from '@shared/components/icons/anime/studio-icon'
import { ThemesIcon } from '@shared/components/icons/anime/themes-icon'
import { TitleJapaneseIcon } from '@shared/components/icons/anime/title-japanese-icon'
import { TypeIcon } from '@shared/components/icons/anime/type-icon'
import { ClockIcon } from '@shared/components/icons/common/clock-icon'
import { StarIcon } from '@shared/components/icons/common/star-icon'
import { CalendarIcon } from '@shared/components/icons/schedule/calendar-icon'
import { InfoSection } from '@shared/components/layout/base/InfoSection'

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
            {detail.value ? detail.value.toString() : 'Unknown'}
          </span>
        </li>
      ))}
    </InfoSection>
  )
}
