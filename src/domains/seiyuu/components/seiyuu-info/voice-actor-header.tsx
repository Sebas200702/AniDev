interface Props {
  name: string
}

export const SeiyuuHeader = ({ name }: Props) => {
  return (
    <div className="z-20 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-white">{name}</h1>
    </div>
  )
}
