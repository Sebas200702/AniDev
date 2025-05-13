import { splitTextOnP } from '@utils/split-text-on-p'

/**
 * AnimeDescription component displays the synopsis and other descriptive information about an anime.
 *
 * @description This component renders the synopsis of an anime in a formatted container.
 * It splits the provided synopsis text into paragraphs for better readability and visual
 * organization. The component handles empty or undefined synopsis by providing fallback
 * empty strings to prevent rendering errors.
 *
 * The component uses the splitTextOnP utility to divide longer text into separate paragraphs,
 * improving the reading experience for users. Each paragraph is styled consistently and
 * contained within a rounded, colored container that matches the application's design system.
 *
 * The UI presents the synopsis text in a clean, readable format with appropriate spacing
 * between paragraphs and padding around the content. The text color and background are
 * designed to provide sufficient contrast for comfortable reading.
 *
 * @param {Props} props - The component props
 * @param {string} props.synopsis - The synopsis text of the anime to be displayed
 * @returns {JSX.Element} The rendered synopsis with formatted paragraphs in a styled container
 *
 * @example
 * <AnimeDescription synopsis="This is the anime synopsis text." />
 */
interface Props {
  /**
   * The synopsis of the anime.
   */
  synopsis: string
}

export const AnimeDescription = ({ synopsis }: Props) => {
  return (
    <div className="bg-Complementary text-Primary-50/90 text-m z-10 h-auto w-full space-y-2 rounded-md p-6">
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[0]}</p>
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[1]}</p>
    </div>
  )
}
