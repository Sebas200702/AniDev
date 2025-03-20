import { splitTextOnP } from '@utils/split-text-on-p'

/**
 * AnimeDescription component displays the synopsis and other descriptive information about an anime.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.synopsis - The synopsis of the anime.
 */
interface Props {
  /**
   * The synopsis of the anime.
   */
  synopsis: string
}

export const AnimeDescription = ({ synopsis }: Props) => {
  return (
    <div className="bg-Complementary text-Primary-50/90 text-m h-auto w-full space-y-2 rounded-md p-6">
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[0]}</p>
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[1]}</p>
    </div>
  )
}
