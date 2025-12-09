import { GENRE_BANK } from '@shared/constants/home-constants'
import { shuffleArray } from '@utils/shuffle-array'

export interface HomeSlot {
  type: string
  value: string
  filters: any
  defaultTitle?: string
  aiContext?: string
  values?: string[]
}

export class GenrePicker {
  private readonly availableGenres: string[]

  constructor(userGenres: string[]) {
    this.availableGenres = shuffleArray([...GENRE_BANK]) as string[]
  }

  pick(userGenres: string[], preferred: boolean = true): string {
    const source = preferred
      ? userGenres.filter((g) => this.availableGenres.includes(g))
      : this.availableGenres

    const pool = source.length > 0 ? source : this.availableGenres
    const picked =
      pool.find((g) => this.availableGenres.includes(g)) ||
      this.availableGenres[0]

    const index = this.availableGenres.indexOf(picked)
    if (index > -1) this.availableGenres.splice(index, 1)

    return picked
  }

  pickMultiple(
    userGenres: string[],
    count: number,
    preferred: boolean = false
  ): string[] {
    return Array.from({ length: count }, () => this.pick(userGenres, preferred))
  }
}

export const SlotBuilder = {
  slider: (
    value: string,
    filters: any,
    defaultTitle: string,
    aiContext?: string
  ): HomeSlot => ({
    type: 'slider',
    value,
    filters,
    defaultTitle,
    aiContext,
  }),

  banner: (value: string, filters: any): HomeSlot => ({
    type: 'banner',
    value,
    filters: { ...filters, withBanner: true },
  }),

  collection: (
    value: string,
    values: string[],
    defaultTitle: string,
    aiContext: string
  ): HomeSlot => ({
    type: 'collection',
    value,
    filters: { genre: value },
    values,
    defaultTitle,
    aiContext,
  }),
}
