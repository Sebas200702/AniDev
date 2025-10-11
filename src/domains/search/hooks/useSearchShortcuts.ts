import { navigate } from 'astro:transitions/client'
import { toast } from '@pheralb/toast'
import { SearchBar } from '@search/components/search-global/search-bar'
import { useShortcuts } from '@shared/hooks/useShortCuts'
import { ToastType, shortCuts } from '@shared/types'
import type { UserInfo } from '@user/types'
import { deleteSearchHistory } from '@utils/delete-search-history'
import { normalizeString } from '@utils/normalize-string'
import { useCallback, useMemo } from 'react'

export const useSearchShortcuts = (
  closeModal: () => void,
  openModal: (component: any) => void,
  setSearchHistoryIsOpen: (open: boolean) => void,
  clearSearchHistory: () => void,
  trackSearchHistory: boolean,
  userInfo: UserInfo | null,
  isSearchPage: boolean
) => {
  const handleRandomAnime = useCallback(async () => {
    try {
      const res = await fetch('/api/animes/random')
      const result = await res.json()
      navigate(`/anime/${normalizeString(result.title)}_${result.mal_id}`)
    } catch {
      toast[ToastType.Error]({ text: 'Error fetching random anime' })
    }
  }, [])

  const actionMap = useMemo(
    () => ({
      'close-search': () => closeModal(),
      'open-search': () => openModal(SearchBar),
      'navigate-profile': () => navigate('/profile'),
      'navigate-home': () => navigate('/'),
      'navigate-settings': () => navigate('/profile/settings'),
      'random-anime': handleRandomAnime,
      'open-search-history': async () => {
        if (!isSearchPage) await navigate('/search')
        setSearchHistoryIsOpen(true)
      },
      'clear-search-history': () => {
        clearSearchHistory()
        toast[ToastType.Success]({
          text: 'Search history cleared successfully',
        })
        if (trackSearchHistory) deleteSearchHistory(userInfo)
      },
    }),
    [
      closeModal,
      openModal,
      handleRandomAnime,
      setSearchHistoryIsOpen,
      clearSearchHistory,
      trackSearchHistory,
      userInfo,
      isSearchPage,
    ]
  )

  useShortcuts(shortCuts, actionMap)
}
