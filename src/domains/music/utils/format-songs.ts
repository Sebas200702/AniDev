import type { AnimeSong } from '@music/types'

export const formatSongs = (songs: AnimeSong[]) => {
  const songMap = new Map<string, AnimeSong>()
  songs.forEach((song) => {
    const existing = songMap.get(`${song.song_title}_${song.theme_id}`)
    if (!existing) {
      songMap.set(`${song.song_title}_${song.theme_id}`, song)
    }
  })
  const uniqueSongs = Array.from(songMap.values())

  return uniqueSongs.sort((a, b) => {
    if (a.type.startsWith('OP') && !b.type.startsWith('OP')) {
      return -1
    }
    if (!a.type.startsWith('OP') && b.type.startsWith('OP')) {
      return 1
    }
    if (a.sequence && b.sequence) {
      return a.sequence - b.sequence
    }
    return 0
  })
}
