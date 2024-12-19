import { create } from 'zustand'

interface DirectoryStore {
  genres: string[]
  tags: string[]
  years: string[]
  statuses: string[]
  formats: string[]
  isExpanded: boolean
  appliedFilters: Record<string, string[]>
  setGenres: (genres: string[] | ((prevState: string[]) => string[])) => void
  setTags: (tags: string[] | ((prevState: string[]) => string[])) => void
  setYears: (years: string[] | ((prevState: string[]) => string[])) => void
  setStatuses: (
    statuses: string[] | ((prevState: string[]) => string[])
  ) => void
  setFormats: (formats: string[] | ((prevState: string[]) => string[])) => void
  setIsExpanded: (isExpanded: boolean) => void
  setAppliedFilters: (
    appliedFilters:
      | Record<string, string[]>
      | ((prevState: Record<string, string[]>) => Record<string, string[]>)
  ) => void
}

export const useDirectoryStore = create<DirectoryStore>((set) => ({
  genres: [],
  tags: [],
  years: [],
  statuses: [],
  formats: [],
  isExpanded: false,
  appliedFilters: {},
  setGenres: (genres) =>
    set((state) => ({
      genres: typeof genres === 'function' ? genres(state.genres) : genres,
    })),
  setTags: (tags) =>
    set((state) => ({
      tags: typeof tags === 'function' ? tags(state.tags) : tags,
    })),
  setYears: (years) =>
    set((state) => ({
      years: typeof years === 'function' ? years(state.years) : years,
    })),
  setStatuses: (statuses) =>
    set((state) => ({
      statuses:
        typeof statuses === 'function' ? statuses(state.statuses) : statuses,
    })),
  setFormats: (formats) =>
    set((state) => ({
      formats: typeof formats === 'function' ? formats(state.formats) : formats,
    })),
  setIsExpanded: (isExpanded) => set(() => ({ isExpanded })),
  setAppliedFilters: (appliedFilters) =>
    set((state) => ({
      appliedFilters:
        typeof appliedFilters === 'function'
          ? appliedFilters(state.appliedFilters)
          : appliedFilters,
    })),
}))
