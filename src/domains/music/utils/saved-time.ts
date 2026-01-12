const getSavedTime = (): number => {
  if (typeof sessionStorage === 'undefined') return 0
  const savedTime = sessionStorage.getItem('music-player-saved-time')
  return savedTime ? Number.parseFloat(savedTime) : 0
}

const setSavedTime = (time: number): void => {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem('music-player-saved-time', time.toString())
}

const clearSavedTime = (): void => {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem('music-player-saved-time')
}

export const savedTimeUtils = {
  getSavedTime,
  setSavedTime,
  clearSavedTime,
}
