interface Props {
  name: string
}

export const ArtistHeader = ({ name }: Props) => {
  return (
    <div className="flex flex-col gap-4 z-20">
      <h1 className="text-3xl font-bold text-white">{name}</h1>
    </div>
  )
}
