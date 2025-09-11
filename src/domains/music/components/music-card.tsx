import { navigate } from 'astro:transitions/client'
import { useMusicPlayerStore } from '@store/music-player-store'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import { AddToPlayListButton } from 'domains/shared/components/buttons/add-to-playlist-button'
import { DownloadButton } from 'domains/shared/components/buttons/download-button'
import { ShareButton } from 'domains/shared/components/buttons/share-button'
import { PauseIcon } from 'domains/shared/components/icons/pause-icon'
import { PlayIcon } from 'domains/shared/components/icons/play-icon'
import { Picture } from 'domains/shared/components/media/picture'
import { MoreOptions } from 'domains/shared/components/more-options'
import type { AnimeSongWithImage } from 'types'

export const MusicCard = ({
  song,
  isMini = false,
}: {
  song: AnimeSongWithImage
  isMini?: boolean
}) => {
  const { currentSong, setCurrentSong, playerRef, isPlaying, list } =
    useMusicPlayerStore()

  const isInPlaylist = list.some(
    (songList) => songList.song_id === song.song_id
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentSong?.song_id !== song.song_id) {
      setCurrentSong(song)
    }

    isPlaying ? playerRef.current?.pause() : playerRef.current?.play()
  }

  if (isMini) {
    return (
      <article
        className={`group bg-Complementary hover:border-enfasisColor/40 border-enfasisColor/5 relative border-1 rounded-md p-2  transition-all duration-300 hover:cursor-pointer hover:bg-zinc-800 hover:shadow-xl flex items-center gap-3 w-full min-h-[56px] md:min-h-[64px]`}
        onClick={() =>
          navigate(
            `/music/${normalizeString(song.song_title ?? 'Unknown')}_${song.theme_id}`
          )
        }
      >
        <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-md shadow-md">
          <Picture
            placeholder={song.placeholder}
            image={song.image}
            styles="h-full w-full rounded-md object-cover relative transition-transform duration-300 group-hover:scale-[1.01]"
            alt={song.song_title}
          />

          <div className="absolute right-1 bottom-1 z-20 translate-y-1 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              className="bg-enfasisColor text-Primary-50 cursor-pointer rounded-full p-1.5 shadow-2xl transition-all duration-200 hover:scale-105"
              onClick={(e) => handleClick(e)}
            >
              {isPlaying && currentSong?.song_id === song.song_id ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-enfasisColor line-clamp-1 font-semibold text-sm md:text-base group-hover:underline">
            {song.song_title}
          </h3>
          <p className="line-clamp-1 text-[10px] text-white md:text-xs">
            {song.artist_name || 'Unknown Artist'}
          </p>
        </div>

        <div className="relative flex-none w-8 h-8 md:w-9 md:h-9">
          <MoreOptions className="absolute right-0 top-1/2 -translate-y-1/2">
            <AddToPlayListButton
              song={song}
              isInPlayList={isInPlaylist}
              clasName="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <DownloadButton
              styles="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              url={song.audio_url}
              title={song.song_title}
              themeId={song.theme_id ?? 0}
              showLabel={false}
            />
            <ShareButton
              className="hover:text-enfasisColor group cursor-pointer rounded-md p-1 text-[10px] transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              url={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
              title={song.song_title}
              text={`Listen to ${song.song_title} by ${song.artist_name}`}
            />
          </MoreOptions>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`group bg-Complementary hover:border-enfasisColor/40 border-enfasisColor/5 relative aspect-[225/330] rounded-lg p-3 md:p-4 border-1 transition-all duration-300 hover:cursor-pointer hover:bg-zinc-800 hover:shadow-xl`}
      onClick={() =>
        navigate(`/music/${normalizeString(song.song_title)}_${song.theme_id}`)
      }
    >
      <div className={`relative overflow-hidden mb-4`}>
        <Picture
          placeholder={song.placeholder}
          image={song.image}
          styles="relative aspect-square h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-102"
          alt={song.song_title}
        />

        <div
          className={`absolute right-2 bottom-2 z-20 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100`}
        >
          <button
            className={`bg-enfasisColor text-Primary-50 cursor-pointer rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-105`}
            onClick={(e) => handleClick(e)}
          >
            {isPlaying && currentSong?.song_id === song.song_id ? (
              <PauseIcon className={`h-5 w-5`} />
            ) : (
              <PlayIcon className={`h-5 w-5`} />
            )}
          </button>
        </div>
      </div>

      <footer className={`flex w-full flex-col mt-2 space-y-2`}>
        <h3
          className={`md:text-md text-enfasisColor line-clamp-1 font-semibold group-hover:underline`}
        >
          {song.song_title}
        </h3>
        <p className={`line-clamp-1 text-white text-xs md:text-sm`}>
          {song.artist_name || 'Unknown Artist'}
        </p>
        <MoreOptions className="self-end">
          <AddToPlayListButton
            song={song}
            isInPlayList={isInPlaylist}
            clasName={`hover:text-enfasisColor group cursor-pointer rounded-md transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 p-1 text-sm`}
          />

          <DownloadButton
            styles={`hover:text-enfasisColor group cursor-pointer rounded-md transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 p-1 text-sm`}
            url={song.audio_url}
            title={song.song_title}
            themeId={song.theme_id ?? 0}
            showLabel={false}
          />
          <ShareButton
            className={`hover:text-enfasisColor group cursor-pointer rounded-md transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 p-1 text-sm`}
            url={`/music/${normalizeString(song.song_title)}_${song.theme_id}`}
            title={song.song_title}
            text={`Listen to ${song.song_title} by ${song.artist_name}`}
          />
        </MoreOptions>
      </footer>
    </article>
  )
}
