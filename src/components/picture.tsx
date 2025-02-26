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
