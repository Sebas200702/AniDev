import { describe, expect, it } from 'vitest'

import { baseUrl } from '@utils/base-url'
import type { Anime } from 'types'

describe('Endpoint test get animes with params', () => {
  it('should return a list of animes', async () => {
    const animes = await fetch(`${baseUrl}/api/animes/full`)
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
  })
  it('should return a list of animes with limit_count', async () => {
    const animes = await fetch(`${baseUrl}/api/animes/full?limit_count=10`)
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBe(10)
  })
  it('should return a list of animes with genre_filter', async () => {
    const animes = await fetch(`${baseUrl}/api/animes/full?genre_filter=action`)
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBeGreaterThan(0)
    animes.forEach((anime: Anime) => {
      expect(anime.genres).toContain('Action')
    })
  })
  it('should return a list of animes with type_filter', async () => {
    const animes = await fetch(`${baseUrl}/api/animes/full?type_filter=tv`)
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBeGreaterThan(0)
    animes.forEach((anime: Anime) => {
      expect(anime.type).toBe('TV')
    })
  })
  it('should return a list of animes with status_filter', async () => {
    const animes = await fetch(
      `${baseUrl}/api/animes/full?status_filter=Currently Airing`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBeGreaterThan(0)
    animes.forEach((anime: Anime) => {
      expect(anime.status).toBe('Currently Airing')
    })
  })
  it('should return a list of animes with studio_filter', async () => {
    const animes = await fetch(
      `${baseUrl}/api/animes/full?studio_filter=wit studio`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBeGreaterThan(0)
    animes.forEach((anime: Anime) => {
      expect(anime.studios).toContain('Wit Studio')
    })
  })
  it('two filters', async () => {
    const animes = await fetch(
      `${baseUrl}/api/animes/full?limit_count=10&genre_filter=action`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBe(10)
    animes.forEach((anime: Anime) => {
      expect(anime.genres).toContain('Action')
    })
  })
  it('three filters', async () => {
    const animes = await fetch(
      `${baseUrl}/api/animes/full?limit_count=10&genre_filter=action&type_filter=tv`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBe(10)
    animes.forEach((anime: Anime) => {
      expect(anime.genres).toContain('Action')
      expect(anime.type).toBe('TV')
    })
  })
  it('all filters', async () => {
    const animes = await fetch(
      `${baseUrl}/api/animes/full?limit_count=10&genre_filter=action&type_filter=tv&studio_filter=mappa`
    )
      .then((res) => res.json())
      .then((data) => data.anime)
    expect(animes).toBeDefined()
    expect(animes.length).toBe(10)
    animes.forEach((anime: Anime) => {
      expect(anime.genres).toContain('Action')
      expect(anime.type).toBe('TV')
      expect(anime.studios).toContain('MAPPA')
    })
  })
})
