import { updatePreferences } from './preferences'
import { saveProfile, updateUserImages } from './profile'
import {
  deleteSearchHistory,
  getSearchHistory,
  saveSearchHistory,
} from './search-history'
import { addToWatchList, getWatchList, removeFromWatchList } from './watch-list'

/**
 * User Service
 *
 * @description
 * Service layer for user-related operations. Handles business logic
 * for watch list management and user data.
 *
 * @features
 * - Watch list management (add, remove, get)
 * - Error handling and logging
 */
export const UserService = {
  addToWatchList,
  removeFromWatchList,
  getWatchList,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  updatePreferences,
  saveProfile,
  updateUserImages,
}
