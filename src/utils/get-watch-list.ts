export const getWatchList = async () => {
  const response = await fetch('/api/user/watchList', {
    credentials: 'include',
  })
  const data = await response.json()
  return data
}
