/**
 * Picture component displays an image with a background.
 *
 * @param {Object} props - The props for the component.
 * @param {string} [props.styles] - Optional additional styles for the picture.
 * @param {string} props.image - The image URL to display as background.
 * @param {React.ReactNode} props.children - Optional children to render inside the picture.
 */
export const Picture = ({
  styles,
  image,
  children,
}: {
  styles?: string
  image: string
  children: React.ReactNode
}) => {
  return (
    <picture
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className={`${styles}`}
    >
      {children}
    </picture>
  )
}
