import { z } from 'zod'
import { create } from 'zustand'

/**
 * Validation schema for profile form data.
 *
 * @description Defines validation rules for profile fields including personal information.
 * All fields are required except avatar which is optional.
 */
const profileSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters long'),
  birthday: z.string().min(1, 'Birthday is required'),
  gender: z.string().min(1, 'Gender is required'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>

/**
 * Profile form state and methods interface.
 *
 * @description Defines the structure for managing profile form state including
 * form values, validation errors, loading state, and user feedback messages.
 */
interface ProfileFormState {
  values: Record<string, any>
  errors: Record<string, string>
  isLoading: boolean
  errorMessage: string | null
  successMessage: string | null

  setFieldValue: (field: string, value: any) => void
  setErrors: (errors: Record<string, string>) => void
  setError: (field: string, error: string | null) => void
  validate: () => boolean
  clearMessages: () => void
  setIsLoading: (isLoading: boolean) => void
  setErrorMessage: (message: string | null) => void
  setSuccessMessage: (message: string | null) => void
  resetForm: () => void
}

/**
 * Profile form state management store.
 *
 * @description Creates a global state store for managing profile form data,
 * validation, and user feedback for Step 2 of the registration process.
 */
export const useProfileFormStore = create<ProfileFormState>((set, get) => ({
  values: {
    avatar: '',
    name: '',
    last_name: '',
    birthday: '',
    gender: '',
  },
  errors: {},
  isLoading: false,
  errorMessage: null,
  successMessage: null,

  setFieldValue: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
    })),

  setErrors: (errors) => set({ errors }),

  setError: (field, error) =>
    set((state) => ({
      errors: { ...state.errors, [field]: error || '' },
    })),

  validate: () => {
    const result = profileSchema.safeParse(get().values)

    if (!result.success) {
      const formattedErrors: Record<string, string> = {}

      result.error.errors.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.')
        if (path) {
          formattedErrors[path] = err.message
        }
      })
      set({ errors: formattedErrors })
      return false
    }

    set({ errors: {} })
    return true
  },

  clearMessages: () =>
    set({
      errorMessage: null,
      successMessage: null,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setSuccessMessage: (successMessage) => set({ successMessage }),

  resetForm: () =>
    set({
      values: {
        avatar: '',
        name: '',
        last_name: '',
        birthday: '',
        gender: '',
      },
      errors: {},
      errorMessage: null,
      successMessage: null,
      isLoading: false,
    }),
}))
