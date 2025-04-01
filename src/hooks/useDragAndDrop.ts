import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDragAndDropProps {
  onDrop?: (file: File) => void
  onDropDataUrl?: (dataUrl: string) => void
}

export const useDragAndDrop = ({
  onDrop,
  onDropDataUrl,
}: UseDragAndDropProps = {}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const dropTargetRef = useRef<HTMLDivElement | null>(null)

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current++
    if (dragCounter.current === 1) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isDragging && dragCounter.current > 0) {
        setIsDragging(true)
      }
    },
    [isDragging]
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current = 0
      setIsDragging(false)

      const droppedFile = e.dataTransfer?.files[0]
      if (!droppedFile) return
      if (onDrop) {
        onDrop(droppedFile)
      }
      if (onDropDataUrl) {
        const reader = new FileReader()
        reader.onload = () => {
          onDropDataUrl(reader.result as string)
        }
        reader.readAsDataURL(droppedFile)
      }
    },
    [onDrop, onDropDataUrl]
  )

  useEffect(() => {
    const dropTarget = dropTargetRef.current
    if (!dropTarget) return
    dropTarget.addEventListener('dragenter', handleDragEnter)
    dropTarget.addEventListener('dragleave', handleDragLeave)
    dropTarget.addEventListener('dragover', handleDragOver)
    dropTarget.addEventListener('drop', handleDrop)

    return () => {
      dropTarget.removeEventListener('dragenter', handleDragEnter)
      dropTarget.removeEventListener('dragleave', handleDragLeave)
      dropTarget.removeEventListener('dragover', handleDragOver)
      dropTarget.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return {
    isDragging,
    dragDropProps: {
      ref: dropTargetRef,
    },
    dropTargetRef,
  }
}
