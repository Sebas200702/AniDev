import { create } from 'zustand'
import type { Anime } from 'types'
import { baseUrl } from '@utils'
interface IndexStore {
  banners: Anime[]
}

const response = await fetch(
 `${baseUrl}/api/animes?limit_count=10&type_filter=tv&search_query=drsto`
)
const data = await response.json().then((data) => data.anime)
export const useIndexStore = create<IndexStore>((set) => ({
  banners: data,
}))
