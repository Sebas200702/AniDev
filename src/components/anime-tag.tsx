import { getTagColor } from '@utils/get-tag-color'

interface Props {
  tag: string
  type?: string
  style?: string
}

export const AnimeTag = ({ tag, type, style }: Props) => {
  const tagColor = getTagColor(type ?? '')

  return (
    <a
      href=""
      className={`${style ?? 'w-min'} h-min rounded-2xl px-2 py-1 text-xs font-medium text-gray-800 transition-all duration-200 ease-in-out hover:${tagColor}`}
      aria-label={`Tag: ${tag}`}
    >
      {tag}
    </a>
  )
}
