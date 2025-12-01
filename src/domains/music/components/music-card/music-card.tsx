import { navigate } from 'astro:transitions/client'
import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSong } from '@music/types'
import { AddToPlayListButton } from '@shared/components/buttons/add-to-playlist-button'
import { DownloadButton } from '@shared/components/buttons/download-button'
import { ShareButton } from '@shared/components/buttons/share-button'
import { PauseIcon } from '@shared/components/icons/watch/pause-icon'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { Picture } from '@shared/components/media/picture'
import { MoreOptions } from '@shared/components/ui/more-options'
import { normalizeString } from '@utils/normalize-string'

export const MusicCard = ({
  song,
  isMini = false,
}: {
  song: AnimeSong
  isMini?: boolean
}) => {
  const { currentSong, setCurrentSong, playerRef, isPlaying, list } =
    useMusicPlayerStore()

  const isInPlaylist = list.some(
    (songList) => songList.theme_id === song.theme_id
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentSong?.theme_id !== song.theme_id) {
      setCurrentSong(song)
    }

    isPlaying ? playerRef.current?.pause() : playerRef.current?.play()
  }

  if (isMini) {
    return (
      <article
        className={`group bg-Complementary hover:border-enfasisColor/40 border-enfasisColor/5 relative flex min-h-[56px] w-full items-center gap-3 rounded-md border-1 p-2 transition-all duration-300 hover:cursor-pointer hover:bg-zinc-800 hover:shadow-xl md:min-h-[64px]`}
        onClick={() =>
          navigate(
            `/music/${normalizeString(song.song_title ?? 'Unknown')}_${song.theme_id}`
          )
        }
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md shadow-md md:h-16 md:w-16">
          <Picture
            placeholder={song.anime?.image ?? ''}
            image={song.anime?.image ?? ''}
            styles="h-full w-full rounded-md object-cover relative transition-transform duration-300 group-hover:scale-[1.01]"
            alt={song.song_title ?? 'Unknown Song'}
          />

          <div className="absolute right-1 bottom-1 z-20 translate-y-1 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              className="bg-enfasisColor text-Primary-50 cursor-pointer rounded-full p-1.5 shadow-2xl transition-all duration-200 hover:scale-105"
              onClick={(e) => handleClick(e)}
            >
              {isPlaying && currentSong?.theme_id === song.theme_id ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-enfasisColor line-clamp-1 text-sm font-semibold group-hover:underline md:text-base">
            {song.song_title}
          </h3>
          <p className="line-clamp-1 text-[10px] text-white md:text-xs">
            {song.artist_name || 'Unknown Artist'}
          </p>
        </div>

        <div className="relative h-8 w-8 flex-none md:h-9 md:w-9">
          <MoreOptions className="absolute top-1/2 right-0 -translate-y-1/2">
            <AddToPlayListButton
              song={song}
              isInPlayList={isInPlaylist}
              className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <DownloadButton
              styles="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              url={song.versions[0]?.resolutions[0]?.audio_url ?? ''}
              title={song.song_title ?? 'Unknown Song'}
              themeId={song.theme_id ?? 0}
              showLabel={false}
            />
            <ShareButton
              className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              url={`/music/${normalizeString(song.song_title ?? 'Unknown Song')}_${song.theme_id}`}
              title={song.song_title ?? 'Unknown Song'}
              text={`Listen to ${song.song_title ?? 'Unknown Song'} by ${song.artist_name ?? 'Unknown Artist'}`}
            />
          </MoreOptions>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`group bg-Complementary hover:border-enfasisColor/40 border-enfasisColor/5 relative aspect-[225/330] rounded-lg border-1 p-3 transition-all duration-300 hover:cursor-pointer hover:bg-zinc-800 hover:shadow-xl md:p-4`}
      onClick={() =>
        navigate(
          `/music/${normalizeString(song.song_title ?? 'Unknown Song')}_${song.theme_id}`
        )
      }
    >
      <div className={`relative mb-4 overflow-hidden`}>
        <Picture
          placeholder={song.anime?.image || ''}
          image={song.anime?.image || ''}
          styles="relative aspect-square h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-102"
          alt={song.song_title ?? 'Unknown Song'}
        />

        <div
          className={`absolute right-2 bottom-2 z-20 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100`}
        >
          <button
            className={`bg-enfasisColor text-Primary-50 cursor-pointer rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-105`}
            onClick={(e) => handleClick(e)}
          >
            {isPlaying && currentSong?.theme_id === song.theme_id ? (
              <PauseIcon className={`h-5 w-5`} />
            ) : (
              <PlayIcon className={`h-5 w-5`} />
            )}
          </button>
        </div>
      </div>

      <footer className={`mt-2 flex w-full flex-col space-y-2`}>
        <h3
          className={`md:text-md text-enfasisColor line-clamp-1 font-semibold group-hover:underline`}
        >
          {song.song_title}
        </h3>
        <p className={`line-clamp-1 text-xs text-white md:text-sm`}>
          {song.artist_name || 'Unknown Artist'}
        </p>
        <MoreOptions className="self-end">
          <AddToPlayListButton
            song={song}
            isInPlayList={isInPlaylist}
            className={`hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`}
          />

          <DownloadButton
            styles={`hover:text-enfasisColor group cursor-pointer rounded-md transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 p-1 text-sm`}
            url={song.versions[0]?.resolutions[0]?.audio_url ?? ''}
            title={song.song_title ?? 'Unknown Song'}
            themeId={song.theme_id ?? 0}
            showLabel={false}
          />
          <ShareButton
            className={`hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-sm transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`}
            url={`/music/${normalizeString(song.song_title ?? 'Unknown Song')}_${song.theme_id}`}
            title={song.song_title ?? 'Unknown Song'}
            text={`Listen to ${song.song_title ?? 'Unknown Song'} by ${song.artist_name ?? 'Unknown Artist'}`}
          />
        </MoreOptions>
      </footer>
    </article>
  )
}
