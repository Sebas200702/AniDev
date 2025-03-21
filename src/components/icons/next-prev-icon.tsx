/**
 * NextPrevIcon component renders an icon representing navigation options.
 *
 * @description This component displays a chevron arrow icon that indicates navigation direction
 * for previous or next content. The SVG icon is styled with responsive sizing that adapts to
 * different screen sizes, appearing smaller on mobile devices and larger on desktop viewports.
 * The icon inherits the current text color through the "currentColor" setting, allowing it to
 * adapt to various UI color schemes seamlessly.
 *
 * The icon is designed with accessibility in mind, using the aria-hidden attribute to ensure
 * it's properly handled by screen readers. The SVG paths create a simple, recognizable
 * directional arrow that works well at different sizes while maintaining visual clarity.
 *
 * The component doesn't accept any props and is intended to be used as a visual element within
 * navigation controls such as pagination, carousels, or any interface requiring directional
 * indicators.
 *
 * @returns {JSX.Element} The rendered navigation arrow icon SVG
 *
 * @example
 * <NextPrevIcon />
 */
export const NextPrevIcon = () => (
  <svg
    className="mx-auto h-3 w-3 text-white md:h-4 md:w-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 1 1 5l4 4"
    />
  </svg>
)
