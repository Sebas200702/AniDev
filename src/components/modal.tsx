/**
 * Modal component displays a modal overlay that can contain children elements.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} [props.children] - Optional children to display inside the modal.
 */
interface Props {
  children?: React.ReactNode
}
export const Modal = ({ children }: Props) => {
  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    const modal = document.getElementById('popup-modal')

    if (!modal || modal !== e.target) return

    modal.classList.toggle('hidden')
  }

  return (
    <div
      id="popup-modal"
      className="fixed top-0 right-0 left-0 z-50 hidden h-screen w-screen items-center justify-center overflow-x-hidden overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={(e) => handleClose(e)}
    >
      {children}
    </div>
  )
}
