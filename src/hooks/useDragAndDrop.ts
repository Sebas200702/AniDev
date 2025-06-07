import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Interface defining the props for the useDragAndDrop hook.
 * @interface UseDragAndDropProps
 * @property {(file: File) => void} [onDrop] - Callback function called when a file is dropped, receiving the dropped File object
 * @property {(dataUrl: string) => void} [onDropDataUrl] - Callback function called when a file is dropped, receiving the file as a data URL string
 * @property {boolean} [enabled=true] - Whether the drag and drop functionality is enabled
 */
interface UseDragAndDropProps {
  onDrop?: (file: File) => void
  onDropDataUrl?: (dataUrl: string) => void
  enabled?: boolean
}

/**
 * Custom hook that implements drag and drop functionality for file uploads.
 *
 * @description
 * This hook provides a complete drag and drop implementation for file uploads, including:
 * - Visual feedback during drag operations
 * - Support for both File objects and data URLs
 * - Proper event handling and cleanup
 * - Counter to handle nested drag and drop scenarios
 *
 * The hook manages the drag state and handles all necessary drag and drop events.
 * It supports both direct file handling through the onDrop callback and data URL
 * conversion through the onDropDataUrl callback.
 *
 * @param {UseDragAndDropProps} props - Configuration options for the drag and drop functionality
 * @returns {Object} Object containing the drag state and ref for the drop target
 * @property {boolean} isDragging - Current drag state
 * @property {RefObject<HTMLDivElement>} dropTargetRef - Ref to attach to the drop target element
 *
 * @example
 * const { isDragging, dropTargetRef } = useDragAndDrop({
 *   onDrop: (file) => console.log('File dropped:', file),
 *   onDropDataUrl: (dataUrl) => console.log('File as data URL:', dataUrl)
 * });
 *
 * return (
 *   <div ref={dropTargetRef} className={isDragging ? 'dragging' : ''}>
 *     Drop files here
 *   </div>
 * );
 */
export const useDragAndDrop = ({
  onDrop,
  onDropDataUrl,
  enabled = true,
}: UseDragAndDropProps = {}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const dropTargetRef = useRef<HTMLDivElement | null>(null)

  /**
   * Handles the dragenter event, updating the drag counter and visual state.
   * @param {DragEvent} e - The dragenter event object
   */
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

  /**
   * Handles the dragleave event, updating the drag counter and visual state.
   * @param {DragEvent} e - The dragleave event object
   */
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

  /**
   * Handles the dragover event, preventing default behavior and updating visual state.
   * @param {DragEvent} e - The dragover event object
   */
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

  /**
   * Handles the drop event, processing the dropped file and calling appropriate callbacks.
   * @param {DragEvent} e - The drop event object
   */
  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (!enabled) return
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
    [enabled, onDrop, onDropDataUrl]
  )

  /**
   * Sets up and cleans up drag and drop event listeners on the drop target element.
   * This effect manages the lifecycle of event listeners, ensuring proper cleanup
   * when the component unmounts or when dependencies change.
   */
  useEffect(() => {
    const dropTarget = dropTargetRef.current
    if (!dropTarget || !enabled) return


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
  }, [enabled, handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return {
    isDragging,
    dragDropProps: {
      ref: dropTargetRef,
    },
    dropTargetRef,
  }
}
