import { useEffect } from "react"
import { useIndexStore } from '@store/index-store'

interface Props {
  title: string
}
export const PageColectionList = ({ title }: Props) => {
    const { collections } = useIndexStore()
    useEffect(() => {

        const colection = collections.find((collection) => collection.title === title)
        console.log(colection)




    }, [])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <h2 className="max-w-96 text-3xl font-bold text-white">{title}</h2>
    </div>
  )
}
