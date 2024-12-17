import { describe, expect, it } from 'vitest'
import type { Anime } from '../../types'
import { baseUrl } from '../../utils'

describe('Endpoint test get anime with slug', () => {
  it('should return a anime', async () => {
    const anime: Anime | undefined = await fetch(
      `${baseUrl}/api/getAnime?slug=Kaguya-sama%20wa%20Kokurasetai?%20Tensai-tachi%20no%20Renai%20Zunousen`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(anime).toBeDefined()
    console.log(anime)
    expect(anime?.title).toBe(
      'Kaguya-sama wa Kokurasetai? Tensai-tachi no Renai Zunousen'
    )
  })
})
