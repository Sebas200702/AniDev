import { create } from 'zustand'

/**
 * UploadImageStore provides state management for image upload functionality.
 *
 * @description This store manages the state for image upload operations, including the
 * currently uploaded image URL and a method to update it. It uses Zustand for efficient
 * state management with minimal re-renders.
 *
 * The store maintains a simple state with:
 * - image: The URL of the currently uploaded image or null if no image is uploaded
 * - setImage: A method to update the image URL
 *
 * This store is typically used in components that handle image uploads, such as
 * profile picture updates or anime cover image uploads.
 *
 * @interface UploadImageStore
 * @property {string|null} image - The URL of the currently uploaded image
 * @property {Function} setImage - Method to update the image URL
 *
 * @example
 * const { image, setImage } = useUploadImageStore();
 * setImage('https://example.com/image.jpg');
 */
interface UploadImageStore {
  image: string | null
  setImage: (image: string) => void
}

export const useUploadImageStore = create<UploadImageStore>((set) => ({
  image: null,
  setImage: (image) => set({ image }),
}))
