import { create } from 'zustand'

/**
 * UploadImageStore provides state management for image upload functionality.
 *
 * @description This store manages the state for image upload operations, including the
 * currently uploaded image URL, its type, and the visibility state of the editor modal.
 * It uses Zustand for efficient state management with minimal re-renders.
 *
 * The store maintains state with:
 * - image: The URL of the currently uploaded image or null if no image is uploaded
 * - type: The MIME type of the uploaded image
 * - isEditorVisible: Controls the visibility of the editor modal
 * - setImage: Method to update the image URL
 * - setType: Method to update the image type
 * - showEditor: Method to show the editor modal
 * - hideEditor: Method to hide the editor modal
 *
 * This store is typically used in components that handle image uploads, such as
 * profile picture updates or anime cover image uploads.
 *
 * @interface UploadImageStore
 * @property {string|null} image - The URL of the currently uploaded image
 * @property {string|null} type - The MIME type of the uploaded image
 * @property {boolean} isEditorVisible - Controls the visibility of the editor modal
 * @property {Function} setImage - Method to update the image URL
 * @property {Function} setType - Method to update the image type
 * @property {Function} showEditor - Method to show the editor modal
 * @property {Function} hideEditor - Method to hide the editor modal
 *
 * @example
 * const { image, setImage, isEditorVisible, showEditor } = useUploadImageStore();
 * setImage('https://example.com/image.jpg');
 * showEditor();
 */
interface UpdateProfile {
  avatar: string | null
  userName: string | null
  avatarType: string | null
  bannerImage: string | null
  bannerType: string | null
  isSubmitDisable: boolean
  setAvatar: (image: string) => void
  setUsername: (userName: string) => void
  setAvatarType: (type: string) => void
  setBannerImage: (bannerImage: string) => void
  setBannerType: (type: string) => void
  setIsSubmitDisabled: (isSubmitDisable: boolean) => void
}

export const useUpdateProfile = create<UpdateProfile>((set) => ({
  avatar: null,
  userName: null,
  avatarType: null,
  bannerImage: null,
  bannerType: null,
  isSubmitDisable: true,
  setAvatar: (avatar) => set({ avatar }),
  setUsername: (userName) => set({ userName }),
  setAvatarType: (avatarType) => set({ avatarType }),
  setBannerImage: (bannerImage) => set({ bannerImage }),
  setBannerType: (bannerType) => set({ bannerType }),
  setIsSubmitDisabled: (isSubmitDisable) => set({ isSubmitDisable }),
}))
