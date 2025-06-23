import { baseTitle } from '@utils/base-url'

interface Props {
  url: string
  title: string
}
export const SyncronizePlayerMetadata = ({ url, title }: Props) => {
  window.history.replaceState(null, '', url)
  document.title = `${title} - ${baseTitle}`
}
