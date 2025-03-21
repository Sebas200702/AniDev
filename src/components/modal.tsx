/**
 * Modal component displays a modal overlay that can contain children elements.
 *
 * @description This component provides a reusable modal dialog that appears as an overlay on the page.
 * It creates a semi-transparent backdrop with blur effect and centers its children content.
 * The modal can be closed by clicking on the backdrop outside the modal content area.
 *
 * The component implements a click handler that detects clicks on the backdrop and toggles
 * the modal's visibility by adding or removing a 'hidden' class. Event propagation is stopped
 * to prevent unintended side effects. The modal is initially hidden and can be shown by
 * removing the 'hidden' class from the element with JavaScript.
 *
 * The UI displays a full-screen overlay with a semi-transparent black background and blur effect.
 * The modal content (passed as children) is centered both horizontally and vertically within
 * the viewport with appropriate z-index to appear above other page content.
 *
 * @param {Props} props - The component props
 * @param {React.ReactNode} [props.children] - Optional children to display inside the modal
 * @returns {JSX.Element} The rendered modal overlay with centered content
 *
 * @example
 * <Modal>
 *   <div className="bg-white p-4 rounded">Modal content here</div>
 * </Modal>
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
