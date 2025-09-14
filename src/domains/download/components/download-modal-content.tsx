import { toast } from '@pheralb/toast'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { MusicIcon } from '@shared/components/icons/music/music-icon'
import { VideoIcon } from '@shared/components/icons/watch/video-icon'
import { Picture } from '@shared/components/media/picture'
import { getTypeMusicColor } from '@utils/get-type-music-color'
import { DownloadModalSkeleton } from 'domains/download/components/download-modal-skeleton'
import { ModalDefaultContainer } from 'domains/shared/components/modal/modal-default-container'
import { useEffect, useState } from 'react'
import { ToastType } from '@shared/types'

interface MusicInfo {
  song_title: string
  artist_name: string
  type: string
  video_url: string
  audio_url: string
  version: number
  resolution: string
  song_id: number
  theme_id: number
  anime_id: number
  episodes: string
  sequence: number
  anime_title: string
  image: string
  banner_image: string
  version_id: number
}

export interface DownloadModalContentProps {
  title: string
  themeId: number
  onClose: () => void
}

/**
 * Dynamic component for the download modal content
 */
export const DownloadModalContent = ({
  title,
  themeId,
  onClose,
}: DownloadModalContentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [musicData, setMusicData] = useState<MusicInfo[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string[]>([])
  const [selectedMediaType, setSelectedMediaType] = useState<string[]>([
    'video',
  ])
  const [selectedResolution, setSelectedResolution] = useState<string[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const dataForVersion = musicData.filter(
    (item) => item.version.toString() === selectedVersion[0]
  )

  const processedData =
    musicData.length > 0
      ? {
          versions: [
            ...new Set(musicData.map((item) => item.version.toString())),
          ].map((v) => ({
            label: v,
            value: v,
          })),
          mediaTypes: [
            { label: 'Video', value: 'video' },
            { label: 'Audio', value: 'audio' },
          ],
          resolutions: [
            ...new Set(musicData.map((item) => item.resolution)),
          ].map((r) => ({
            label: `${r}p`,
            value: r,
          })),
        }
      : { versions: [], mediaTypes: [], resolutions: [] }

  useEffect(() => {
    if (musicData.length > 0) {
      if (selectedVersion.length === 0 && processedData.versions.length > 0) {
        setSelectedVersion([processedData.versions[0].value])
      }

      if (
        selectedResolution.length === 0 &&
        processedData.resolutions.length > 0
      ) {
        setSelectedResolution([processedData.resolutions[0].value])
      }
    }
  }, [
    musicData.length,
    processedData.versions,
    processedData.resolutions,
    selectedVersion.length,
    selectedResolution.length,
  ])

  // Actualizar resolución cuando cambia la versión
  useEffect(() => {
    if (musicData.length > 0 && selectedVersion.length > 0) {
      const resolutionsForVersion = [
        ...new Set(dataForVersion.map((item) => item.resolution)),
      ]

      if (resolutionsForVersion.length === 0) {
        setSelectedResolution([])
        return
      }

      const isCurrentResolutionValid =
        selectedResolution.length > 0 &&
        resolutionsForVersion.includes(selectedResolution[0])

      if (!isCurrentResolutionValid) {
        setSelectedResolution([resolutionsForVersion[0]])
      }
    }
  }, [musicData, selectedVersion])

  useEffect(() => {
    fetchMusicData()
  }, [themeId])

  const fetchMusicData = async () => {
    if (!themeId) return
    setIsLoadingData(true)
    try {
      const response = await fetch(`/api/getMusicInfo?themeId=${themeId}`)
      if (!response.ok) throw new Error('Failed to fetch music data')
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setMusicData(data)
      }
    } catch (error) {
      console.error('Error fetching music data:', error)
      toast[ToastType.Error]({
        text: 'Failed to load download options',
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const generateFilename = (
    title: string,
    version?: string,
    type?: string,
    resolution?: string
  ): string => {
    let filename = title.replace(/[<>:"/\\|?*]/g, '_')
    if (version && type && resolution) {
      filename += `_v${version}_${type}_${resolution}p`
    }
    return filename
  }

  const getSelectedDownloadUrl = (): string | null => {
    if (musicData.length === 0) return null

    const filteredByVersionAndResolution = musicData.filter(
      (item) =>
        item.version.toString() === selectedVersion[0] &&
        item.resolution === selectedResolution[0]
    )

    const selectedItem =
      filteredByVersionAndResolution.find(
        (item) =>
          (selectedMediaType[0] === 'audio' && item.audio_url) ||
          (selectedMediaType[0] === 'video' && item.video_url)
      ) || filteredByVersionAndResolution[0]

    if (!selectedItem) return null

    return selectedMediaType[0] === 'audio'
      ? selectedItem.audio_url
      : selectedItem.video_url
  }

  const performDownload = async (downloadUrl: string, filename: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&download=true&filename=${encodeURIComponent(filename)}`
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { Accept: '*/*' },
      redirect: 'follow',
    })
    if (!response.ok) {
      let errorMessage = 'Failed to download file'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }
    const blob = await response.blob()
    if (!blob || blob.size === 0) {
      throw new Error('Empty file received')
    }
    const downloadUrl2 = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = downloadUrl2
    link.download = filename
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl2)
    }, 100)
  }

  const handleAdvancedDownload = async () => {
    if (isLoading) return
    const downloadUrl = getSelectedDownloadUrl()
    if (!downloadUrl) {
      toast[ToastType.Error]({
        text: 'Invalid download selection or URL not found.',
      })
      return
    }
    setIsLoading(true)
    try {
      const filename = generateFilename(
        title,
        selectedVersion[0],
        selectedMediaType[0],
        selectedResolution[0]
      )
      await toast[ToastType.Loading]({
        text: 'Downloading',
        options: {
          promise: performDownload(downloadUrl, filename),
          success: 'Download completed!',
          error: 'Download failed',
          autoDismiss: true,
        },
      })
      onClose() // Cerrar el modal después de una descarga exitosa
    } catch (error) {
      console.error('Error downloading file:', error)
      toast[ToastType.Error]({
        text: `Download error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show skeleton while loading data
  if (isLoadingData || !dataForVersion[0]) {
    return <DownloadModalSkeleton />
  }

  return (
    <ModalDefaultContainer>
      <div className="flex w-full flex-col gap-6 md:w-100">
        <div className="flex flex-col gap-2">
          <h2 className="text-Primary-50 text-lx font-bold">
            Download Options
          </h2>
          <p className="text-Primary-200 text-m">
            Choose your preferred version, type, and quality
          </p>
        </div>
        {musicData.length > 0 && (
          <div className="bg-enfasisColor/10 relative flex flex-row rounded-lg">
            <div className="border-enfasisColor relative aspect-square h-full w-full max-w-20 overflow-hidden rounded-lg border-l-4">
              <Picture
                image={dataForVersion[0].image}
                placeholder={dataForVersion[0].image}
                styles="w-full h-full aspect-square object-cover object-center relative"
                alt={dataForVersion[0].song_title}
              />
            </div>
            <div className="flex min-h-full w-full flex-col justify-between p-4">
              <h3 className="text-Primary-50 text-m line-clamp-1 font-bold">
                {dataForVersion[0].song_title}
              </h3>
              <p className="text-Primary-300 text-sx line-clamp-1">
                {dataForVersion[0].artist_name
                  ? dataForVersion[0].artist_name
                  : 'Unknown Artist'}
              </p>
            </div>
            {dataForVersion[0].type && (
              <span
                className={`absolute top-2 right-2 flex-shrink-0 rounded-full border p-1 text-xs font-medium md:px-2 md:py-1 ${getTypeMusicColor(dataForVersion[0].type)}`}
              >
                {dataForVersion[0].type.toUpperCase()}
              </span>
            )}
          </div>
        )}
        <div className="flex gap-4 md:flex-row">
          <div className="flex w-2/3 flex-col gap-2">
            <span className="text-Primary-200 text-s">Select Resolution</span>
            <div className="flex w-full -skew-x-8 transform flex-row overflow-hidden rounded-sm">
              {processedData.resolutions.map((resOption) => (
                <button
                  key={resOption.value}
                  title={`Select ${resOption.label} Resolution`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedResolution([resOption.value])
                  }}
                  className={`text-Primary-100 text-m flex w-full cursor-pointer items-center justify-center py-1.5 transition-colors ${
                    selectedResolution[0] === resOption.value
                      ? 'bg-enfasisColor/80'
                      : 'bg-enfasisColor/20 hover:bg-enfasisColor/40'
                  }`}
                >
                  <span className="flex skew-x-8">{resOption.label}</span>
                </button>
              ))}
            </div>
          </div>
          <FilterDropdown
            options={processedData.versions}
            label="Select Version"
            values={selectedVersion}
            onChange={(newValues) => {
              setSelectedVersion(newValues)
            }}
            onClear={() => setSelectedVersion([])}
            styles="w-1/3"
            singleSelect={true}
            InputText={false}
          />
        </div>
        <div className="flex flex-row overflow-hidden rounded-md">
          <button
            className={`bg-enfasisColor/10 hover:bg-enfasisColor/20 flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 py-2 transition-all duration-300 ${
              selectedMediaType[0] === 'video'
                ? 'border-enfasisColor'
                : 'border-enfasisColor/0'
            }`}
            title="Select Video"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMediaType(['video'])
            }}
            disabled={isLoading}
          >
            <VideoIcon className="h-4 w-4" />
            Video
          </button>
          <button
            className={`bg-enfasisColor/10 border-enfasisColor hover:bg-enfasisColor/20 flex w-full cursor-pointer items-center justify-center gap-2 border-b-2 py-2 transition-all duration-300 ${
              selectedMediaType[0] === 'audio'
                ? 'border-enfasisColor'
                : 'border-enfasisColor/0'
            }`}
            title="Select Audio"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMediaType(['audio'])
            }}
            disabled={isLoading}
          >
            <MusicIcon className="h-4 w-4" />
            Audio
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            title="Cancel Download"
            className="button-secondary flex-1 font-medium transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            title={`Download ${dataForVersion[0].song_title} `}
            className={`button-primary flex-1 font-medium transition-all duration-300 ${isLoading ? 'button-loading' : ''}`}
            onClick={handleAdvancedDownload}
            disabled={
              isLoading || !selectedVersion[0] || !selectedResolution[0]
            }
          >
            {isLoading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </ModalDefaultContainer>
  )
}
