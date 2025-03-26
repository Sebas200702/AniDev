import type { IconProps } from 'types'

/**
 * Favicon component renders the favicon icon for the application.
 *
 * @description This component displays the application's favicon, which consists of a stylized "A" letter
 * in white and a blue "D" letter. The SVG-based icon is designed to provide brand recognition and visual
 * identity for the application. The icon features a clean, modern design with two distinct paths that
 * create the complete favicon image.
 *
 * The component accepts an optional className parameter that allows for custom styling and positioning
 * of the icon throughout the application. This flexibility enables the favicon to be appropriately sized
 * and styled in different contexts, such as headers, footers, or loading screens.
 *
 * The SVG viewBox is set to "0 0 73 83" to maintain proper proportions regardless of the display size.
 * The icon uses a combination of white and blue (#0057E7) colors that represent the application's brand
 * identity.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name to apply to the favicon icon
 * @returns {JSX.Element} The rendered favicon SVG icon with proper styling and dimensions
 *
 * @example
 * <Favicon className="h-8 w-8" />
 */
export const Favicon = ({ className }: IconProps) => {
  return (
    <svg
      width="73"
      height="83"
      viewBox="0 0 73 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.12736 62.4883C4.15072 62.4883 3.3572 62.2645 2.7468 61.8169C2.17709 61.3693 1.8312 60.7792 1.70912 60.0467C1.58704 59.2735 1.72947 58.419 2.1364 57.483L18.251 21.7746C18.78 20.5945 19.4107 19.7603 20.1432 19.272C20.9164 18.743 21.7913 18.4785 22.7679 18.4785C23.7039 18.4785 24.5381 18.743 25.2706 19.272C26.0437 19.7603 26.6948 20.5945 27.2238 21.7746L43.3994 57.483C43.8471 58.419 44.0098 59.2735 43.8878 60.0467C43.7657 60.8199 43.4198 61.4303 42.8501 61.8779C42.2804 62.2849 41.5275 62.4883 40.5916 62.4883C39.4522 62.4883 38.5569 62.2238 37.9058 61.6948C37.2954 61.1251 36.7461 60.2705 36.2578 59.1311L32.2902 49.9141L35.5863 52.0505H9.82744L13.1236 49.9141L9.21704 59.1311C8.68803 60.3112 8.13867 61.1658 7.56896 61.6948C6.99925 62.2238 6.18539 62.4883 5.12736 62.4883ZM22.6458 27.4514L14.1002 47.7777L12.5132 45.8244H32.9006L31.3746 47.7777L22.7679 27.4514H22.6458Z"
        fill="white"
      />
      <path
        d="M34.8508 62C33.5079 62 32.4702 61.6541 31.7378 60.9623C31.046 60.2298 30.7001 59.1922 30.7001 57.8493V23.1175C30.7001 21.7746 31.046 20.7573 31.7378 20.0655C32.4702 19.333 33.5079 18.9668 34.8508 18.9668H46.6926C53.8953 18.9668 59.4499 20.8183 63.3565 24.5214C67.3037 28.2245 69.2774 33.535 69.2774 40.4529C69.2774 43.9118 68.7687 46.9842 67.7514 49.6699C66.7747 52.315 65.3098 54.5531 63.3565 56.3843C61.4439 58.2155 59.0837 59.6194 56.2758 60.5961C53.5087 61.532 50.3143 62 46.6926 62H34.8508ZM38.5132 55.5298H46.2042C48.7272 55.5298 50.9043 55.2246 52.7355 54.6142C54.6074 53.9631 56.1538 53.0271 57.3746 51.8063C58.6361 50.5448 59.572 48.9781 60.1824 47.1062C60.7928 45.1937 61.098 42.9759 61.098 40.4529C61.098 35.4069 59.8569 31.6428 57.3746 29.1605C54.8923 26.6782 51.1688 25.437 46.2042 25.437H38.5132V55.5298Z"
        fill="currentColor"
      />
    </svg>
  )
}
