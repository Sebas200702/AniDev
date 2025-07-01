import { AnimeCharacterCard } from '@components/characters/detail-character-card'
import { AnimeCharacterLoader } from '@components/anime-info/anime-character-loader'
import { NexPrevBtnSlideList } from '@components/index/slider/next-prev-btn-slider-list'
import { useCharacterStore } from '@store/character-store'
import { useWindowWidth } from '@store/window-width'
import { useEffect, useRef } from 'react'
import type { Character } from 'types'

export const AnimeCaterList = ({
  animeId,
  language,
}: {
  animeId: number
  language: string
}) => {
  const listRef = useRef<HTMLUListElement>(null)
  const { width: windowWidth } = useWindowWidth()
  const { setCharacters, setIsLoading, isLoading, characters } =
    useCharacterStore()

  const formatCharacters = (characters: Character[], language: string) => {
    const characterMap = new Map<string, Character>()
    characters.forEach((char) => {
      const existing = characterMap.get(char.character_id.toString())
      if (!existing) {
        characterMap.set(char.character_id.toString(), char)
      } else if (char.voice_actor_language === language) {
        characterMap.set(char.character_id.toString(), char)
      }
    })
    return Array.from(characterMap.values())
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchCharacters = async () => {
      const response = await fetch(
        `/api/getAnimeCharacters?animeId=${animeId}&language=${language}`
      )
      const data = await response.json()
      setCharacters(formatCharacters(data, language))
      setIsLoading(false)
    }
    fetchCharacters()
  }, [animeId, language])

  const groups = Array.from({ length: Math.ceil(characters.length / 4) }).map(
    (_, groupIndex) => {
      return characters.slice(groupIndex * 4, (groupIndex + 1) * 4)
    }
  )
  const totalGroups = groups.length

  type GroupWithClone = {
    items: Character[]
    originalIndex: number
    cloneBlock: 0 | 1 | 2
  }
  const extendedGroups: GroupWithClone[] = []
  for (let block: 0 | 1 | 2 = 0 as 0; block <= 2; block++) {
    groups.forEach((items, idx) => {
      extendedGroups.push({
        items,
        originalIndex: idx,
        cloneBlock: block as 0 | 1 | 2,
      })
    })
  }

  useEffect(() => {
    const ul = listRef.current
    if (!ul) return

    const clientW = ul.clientWidth
    const groupWidth = clientW - 48
    const realBlockWidth = groupWidth * totalGroups

    ul.scrollLeft = realBlockWidth

    const prevBtn = ul.querySelector('.prev-button') as HTMLButtonElement
    const nextBtn = ul.querySelector('.next-button') as HTMLButtonElement
    if (!prevBtn || !nextBtn) return

    const handleClick = (direction: 'next' | 'prev') => {
      if (!ul) return
      const delta = direction === 'next' ? groupWidth : -groupWidth
      ul.scrollTo({ left: ul.scrollLeft + delta, behavior: 'smooth' })
    }
    nextBtn.addEventListener('click', () => handleClick('next'))
    prevBtn.addEventListener('click', () => handleClick('prev'))

    const onScroll = () => {
      if (!ul) return
      const sl = ul.scrollLeft

      if (sl + 1 < groupWidth) {
        ul.scrollLeft = sl + realBlockWidth
      } else if (sl + clientW > realBlockWidth * 2 - 1 + clientW) {
        ul.scrollLeft = sl - realBlockWidth
      }
    }
    ul.addEventListener('scroll', onScroll)

    const updateButtonsVisibility = () => {
      if (windowWidth && windowWidth < 768) {
        prevBtn.style.display = 'none'
        nextBtn.style.display = 'none'
      } else {
        prevBtn.style.display = 'flex'
        nextBtn.style.display = 'flex'
      }
    }
    updateButtonsVisibility()

    return () => {
      nextBtn.removeEventListener('click', () => handleClick('next'))
      prevBtn.removeEventListener('click', () => handleClick('prev'))
      ul.removeEventListener('scroll', onScroll)
    }
  }, [windowWidth, totalGroups])

  if (isLoading) return <AnimeCharacterLoader />

  return (
    <ul
      ref={listRef}
      className="no-scrollbar flex gap-4 overflow-x-scroll px-4 py-4 md:px-8"
    >
      <NexPrevBtnSlideList
        label="prev-button"
        styles="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
      />

      {extendedGroups.map((grp, idx) => (
        <section
          key={`${grp.cloneBlock}-${grp.originalIndex}-${idx}`}
          className="grid min-w-full grid-cols-1 gap-4 xl:grid-cols-2"
        >
          {grp.items.map((character) => (
            <li key={character.id}>
              <AnimeCharacterCard character={character} />
            </li>
          ))}
        </section>
      ))}

      <NexPrevBtnSlideList
        label="next-button"
        styles="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 z-10"
      />
    </ul>
  )
}
