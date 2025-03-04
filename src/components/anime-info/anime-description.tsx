import { splitTextOnP } from '@utils/split-text-on-p'

interface Props {
  synopsis: string
}

export const AnimeDescription = ({ synopsis }: Props) => {
  return (
    <div className="bg-Complementary text-Primary-50/90 h-auto w-full   p-6 space-y-2 rounded-md  text-m">
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[0]}</p>
      <p className="max-w-full">{splitTextOnP(synopsis ?? '')[1]}</p>
    </div>
  )
}
