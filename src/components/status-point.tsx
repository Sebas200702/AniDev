/**
 * StatusPoint component displays a colored status indicator dot with an optional tooltip.
 *
 * @description This component renders a simple circular SVG that visually indicates status.
 * It accepts a class name for styling the indicator with different colors or sizes based on
 * the status it represents. The component includes an optional tooltip that appears on hover,
 * providing additional context about what the status indicator represents.
 *
 * The component uses an SVG circle that can be styled through the provided class name,
 * allowing for consistent status representation across the application. The tooltip
 * is implemented using the HTML title attribute for simplicity and accessibility.
 *
 * @param {StatusPointProps} props - The component props
 * @param {string} props.class - CSS class for styling the status indicator (color, size, etc.)
 * @param {string} [props.status] - Optional status text displayed as tooltip on hover
 * @returns {JSX.Element} The rendered status indicator with optional tooltip
 *
 * @example
 * <StatusPoint class="text-green-500 w-3 h-3" status="Currently Airing" />
 */
interface StatusPointProps {
  class: string
  status?: string
}
export const StatusPoint = ({ class: className, status }: StatusPointProps) => {
  return (
    <div
      title={status}
      className={`${className} ${status === 'Currently Airing' ? 'pulse' : ''}`}
    ></div>
  )
}
