import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A custom hook that creates an interactive dynamic border effect that follows mouse movement.
 *
 * @description
 * This hook provides functionality to create an animated border effect that responds to mouse
 * interactions. The border's appearance changes based on mouse position and hover state.
 *
 * Features:
 * - Dynamic border angle calculation based on mouse position
 * - Smooth transitions between normal and hover states
 * - Customizable border width and opacity
 * - Configurable initial angle
 * - TypeScript support with generic element type
 *
 * The hook handles:
 * - Mouse enter/leave events
 * - Mouse movement tracking
 * - Border style updates
 * - CSS custom property management
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { elementRef, handleMouseMove, handleMouseLeave, handleMouseEnter } = useDynamicBorder<HTMLDivElement>({
 *     borderWidth: 2,
 *     normalOpacity: 0.4,
 *     hoverOpacity: 0.9
 *   });
 *
 *   return (
 *     <div
 *       ref={elementRef}
 *       onMouseMove={handleMouseMove}
 *       onMouseLeave={handleMouseLeave}
 *       onMouseEnter={handleMouseEnter}
 *       className="dynamic-border"
 *     >
 *       Content
 *     </div>
 *   );
 * };
 * ```
 *
 * @template T - The type of HTML element that will receive the dynamic border effect
 */
interface UseDynamicBorderProps {
  /** Initial angle of the border gradient in degrees. Defaults to '0deg' */
  initialAngle?: string
  /** Opacity of the border in normal state. Value between 0 and 1. Defaults to 0.3 */
  normalOpacity?: number
  /** Opacity of the border in hover state. Value between 0 and 1. Defaults to 1 */
  hoverOpacity?: number
  /** Width of the border in pixels. Defaults to 1 */
  borderWidth?: number
}

/**
 * Creates a dynamic border effect that follows mouse movement.
 *
 * @template T - The type of HTML element that will receive the dynamic border effect
 * @param {UseDynamicBorderProps} props - Configuration options for the dynamic border
 * @returns {Object} An object containing:
 *   - elementRef: React ref to attach to the target element
 *   - handleMouseMove: Event handler for mouse movement
 *   - handleMouseLeave: Event handler for mouse leave
 *   - handleMouseEnter: Event handler for mouse enter
 *   - isHovered: Boolean indicating if the element is currently hovered
 */
export const useDynamicBorder = <T extends HTMLElement>({
  initialAngle = '0deg',
  normalOpacity = 0.3,
  hoverOpacity = 1,
  borderWidth = 1,
}: UseDynamicBorderProps = {}) => {
  const elementRef = useRef<T | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    const el = elementRef.current
    if (!el) return

    setIsHovered(true)
    el.style.setProperty('--angle', initialAngle)
    el.classList.add('border-dynamic')
  }, [initialAngle])

  const handleMouseLeave = useCallback(() => {
    const el = elementRef.current
    if (!el) return

    setIsHovered(false)
    el.style.setProperty('--angle', initialAngle)
    el.classList.remove('border-dynamic')
  }, [initialAngle])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = elementRef.current
      if (!el || !isHovered) return

      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      const angleDeg = (Math.atan2(y, x) * 180) / Math.PI
      el.style.setProperty('--angle', `${angleDeg}deg`)
    },
    [isHovered]
  )

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    el.style.setProperty('--border-width', `${borderWidth}px`)

    const computedStyle = window.getComputedStyle(el)
    const borderRadius = computedStyle.borderRadius || '0.75rem'
    el.style.setProperty('--border-radius', borderRadius)
  }, [normalOpacity, hoverOpacity, borderWidth])

  return {
    elementRef,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
    isHovered,
  }
}
