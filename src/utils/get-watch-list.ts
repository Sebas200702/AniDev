export const getWatchList = async () => {
  const response = await fetch('/api/watchList', {
    credentials: 'include',
  })
  const data = await response.json()
  return data
}
