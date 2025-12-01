import { useMusicPlayerStore } from '@music/stores/music-player-store'
import type { AnimeSongResolution, AnimeSongVersion } from '@music/types'
import { useEffect } from 'react'

export const useMediaChange = () => {
  const {
    type,
    selectedResolutionId,
    selectedVersion,
    currentSong,
    setSelectedResolutionId,
    setSelectedVersion,
    setType,
    setSrc,
    setVersions,
    setResolutions,
    resolutions,
    versions,
  } = useMusicPlayerStore()



  const applyType = (
    mediaType: 'audio' | 'video',
    resolution?: AnimeSongResolution
  ) => {
    if (!resolution) return
    const url =
      mediaType === 'audio' ? resolution.audio_url : resolution.video_url
    setSrc(url ?? '')
  }

  useEffect(() => {
    if (!currentSong) return

    const songVersions = currentSong.versions
    if (!songVersions?.length) return

    setVersions(songVersions)
    const firstVersion = songVersions[0]
    setResolutions(firstVersion.resolutions)

    if (!firstVersion) return
    changeMediaVersion(firstVersion.version, songVersions)
  }, [currentSong])

  const changeMediaVersion = (
    version: number,
    versionsOverride?: AnimeSongVersion[]
  ) => {
    const baseVersions = versionsOverride ?? versions

    const newVersion = baseVersions.find((v) => v.version === version)
    if (!newVersion) return

    const firstRes = newVersion.resolutions?.[0]
    if (!firstRes) return
    setResolutions(newVersion.resolutions)

    setSelectedVersion(version)


    changeMediaResolution(firstRes.song_id!, newVersion)
  }

  const changeMediaResolution = (
    resolutionId: number,
    versionOverride?: AnimeSongVersion
  ) => {
    const baseVersion = versionOverride ?? versions[0]

    if (!baseVersion) return

    const newRes = baseVersion.resolutions.find(
      (r) => r.song_id === resolutionId
    )
    if (!newRes) return

    setSelectedResolutionId(resolutionId)
    changeMediaType(type, newRes)
  }
  useEffect(() => {
    console.log('Resolutions changed:', resolutions)
  }, [resolutions])

  const changeMediaType = (
    newType: 'audio' | 'video',
    resolution?: AnimeSongResolution
  ) => {
    setType(newType)
    applyType(newType, resolution ?? versions[0]?.resolutions[0])
  }

  return {
    changeMediaType,
    changeMediaResolution,
    changeMediaVersion,
    type,
    versions,
    resolutions,
    selectedResolutionId,
    selectedVersion,
  }
}
