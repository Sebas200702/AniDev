import { updatePreferences } from './preferences'
import { updateUserImages, upsertProfile } from './profile'
import {
  deleteSearchHistory,
  getSearchHistory,
  saveSearchHistory,
} from './search-history'
import {
  getWatchList,
  removeFromWatchList,
  upsertWatchListItem,
} from './watch-list'

export const UserRepository = {
  upsertWatchListItem,
  removeFromWatchList,
  getWatchList,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  updatePreferences,
  upsertProfile,
  updateUserImages,
}
