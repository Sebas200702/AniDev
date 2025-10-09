export const ModalDefaultContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div
      className="bg-Complementary border-enfasisColor/30 relative flex max-w-[90vw] flex-col items-center justify-center gap-6 rounded-lg border p-6 shadow-2xl backdrop-blur-sm"
    >
      {children}
    </div>
  )
}
