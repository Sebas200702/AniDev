import { MusicDetailCard } from '@music/components/music-card/music-detail-card'
import { useDragableList } from '@music/hooks/useDragableList'
import { usePlaylist } from '@music/hooks/usePlaylist'
import { useMusicPlayerStore } from '@music/stores/music-player-store'

export const MusicPlayList = () => {
  const { upComingList } = usePlaylist()
  const { currentSong } = useMusicPlayerStore()
  const { DragableList, DragableItem } = useDragableList()

  return (
    <section className="no-scrollbar bg-Complementary sticky top-30 h-full max-h-96 overflow-hidden overflow-y-scroll p-4 md:max-h-[700px] md:rounded-xl md:p-6">
      <header className="mb-10">
        <h2 className="text-lx font-semibold text-zinc-100">
          Currently Playing
        </h2>
      </header>
      {currentSong && (
        <div className="mb-8 w-full">
          <MusicDetailCard song={currentSong} />
        </div>
      )}

      {upComingList.length > 0 && (
        <section>
          <header className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-600/30"></div>
              <h3 className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Up Next
              </h3>
              <div className="flex-1 bg-gray-600/30"></div>
            </div>
          </header>
          <DragableList items={upComingList}>
            <ul className="flex w-full flex-col gap-3">
              {upComingList.map((song) => (
                <DragableItem key={song.theme_id} id={song.theme_id}>
                  <MusicDetailCard song={song} />
                </DragableItem>
              ))}
            </ul>
          </DragableList>
        </section>
      )}
    </section>
  )
}
