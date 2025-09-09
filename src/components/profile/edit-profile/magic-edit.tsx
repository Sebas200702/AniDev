import { ModalDefaultContainer } from '@components/modal/modal-default-container'
import { useUpdateProfile } from '@store/update-profile'
export const MagicEdit = () => {
  const { bannerImage, avatar } = useUpdateProfile()
  return (
    <ModalDefaultContainer>
      <h2 className="text-lx">Magic Edit</h2>
    </ModalDefaultContainer>
  )
}
