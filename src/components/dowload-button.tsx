interface Props {
  imageUrl: string
  title: string
}
export const DownloadButton = ({ imageUrl, title }: Props) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al descargar la imagen:', error)
    }
  }
  return (
    <button className="button-primary" onClick={handleDownload}>
      Download
    </button>
  )
}
