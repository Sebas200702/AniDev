import type { UserInfo, WatchList } from '@user/types'
import { create } from 'zustand'

/**
 * GlobalUserPreferences store manages user interface preferences across the application.
 *
 * @description This store maintains user interface customization settings including the emphasis color.
 * It provides a centralized state management solution using Zustand to ensure consistent user preferences
 * are applied throughout the application. The store includes both the current state values and setter
 * functions to modify those values.
 *
 * The emphasis color affects various UI elements including accent bars, buttons, and highlighted text.
 * When the color is changed, all components subscribed to this store will automatically re-render with
 * the updated color value, providing immediate visual feedback to the user.
 *
 * The store implements a simple API with getter and setter functions, making it easy to integrate with
 * any component that needs to access or modify user preferences. The default emphasis color is set to
 * a blue shade (#0057E7) which serves as the application's primary color until changed by the user.
 *
 * @interface GlobalUserPreferences - The interface defining the store's state and actions
 * @property {string} enfasis - The current emphasis color in hexadecimal format
 * @property {function} setEnfasis - Function to update the emphasis color
 *
 * @example
 * const { enfasis, setEnfasis } = useGlobalUserPreferences();
 * setEnfasis('#FF5733'); // Changes the emphasis color to orange-red
 */
interface GlobalUserPreferences {
  enfasis: string
  userInfo: UserInfo | null
  watchList: WatchList[]
  setUserInfo: (user: UserInfo | null) => void
  parentalControl: boolean | null
  trackSearchHistory: boolean
  setParentalControl: (value: boolean) => void
  setTrackSearchHistory: (value: boolean) => void
  setEnfasis: (color: string) => void
  setWatchList: (watchList: WatchList[]) => void
}

export const useGlobalUserPreferences = create<GlobalUserPreferences>(
  (set) => ({
    enfasis: '#0057E7',
    watchList: [],
    setEnfasis: (color: string) => set({ enfasis: color }),
    trackSearchHistory: true,
    setTrackSearchHistory: (value: boolean) =>
      set({ trackSearchHistory: value }),
    userInfo: null,
    setUserInfo(user) {
      set({ userInfo: user })
    },
    parentalControl: null,
    setParentalControl(value) {
      set({ parentalControl: value })
    },
    setWatchList(watchList) {
      set({ watchList })
    },
  })
)
