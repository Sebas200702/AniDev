import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDragAndDropProps {
  onDrop?: (file: File) => void
  onDropDataUrl?: (dataUrl: string) => void
  enabled?: boolean
}

export const useDragAndDrop = ({
  onDrop,
  onDropDataUrl,
  enabled = true,
}: UseDragAndDropProps = {}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const dropTargetRef = useRef<HTMLDivElement | null>(null)

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      if (!enabled) return
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current++
      if (dragCounter.current === 1) {
        setIsDragging(true)
      }
    },
    [enabled]
  )

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      if (!enabled) return
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current--
      if (dragCounter.current === 0) {
        setIsDragging(false)
      }
    },
    [enabled]
  )

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      if (!enabled) return
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging && dragCounter.current > 0) {
        setIsDragging(true)
      }
    },
    [enabled, isDragging]
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (!enabled) return
      e.preventDefault()
      e.stopPropagation()
      // Reiniciamos contador y estado
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
    [enabled, onDrop, onDropDataUrl]
  )

  useEffect(() => {
    const dropTarget = dropTargetRef.current
    if (!dropTarget || !enabled) return

    // Se añaden los listeners directamente al elemento de drop
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
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, enabled])

  return {
    isDragging,
    // Solo se asigna el ref; si no está habilitado, no se aplican los eventos
    dragDropProps: {
      ref: dropTargetRef,
    },
    dropTargetRef,
  }
}
