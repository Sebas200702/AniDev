import { z } from 'zod'
import { create } from 'zustand'

/**
 * Validation schema for preferences form data.
 *
 * @description Defines validation rules for user preferences including anime preferences,
 * watching habits, and favorite content. Most fields are optional to allow gradual completion.
 */
const preferencesSchema = z.object({
  favorite_animes: z.array(z.string()).optional(),
  frequency: z.string().optional(),
  fanatic_level: z.string().optional(),
  preferred_format: z.string().optional(),
  watched_animes: z.array(z.string()).optional(),
  favorite_studios: z.array(z.string()).optional(),
  favorite_genres: z.array(z.string()).optional(),
})

export type PreferencesFormValues = z.infer<typeof preferencesSchema>
type PreferencesFormErrors = Partial<
  Record<keyof PreferencesFormValues, string>
>

/**
 * Preferences form state and methods interface.
 *
 * @description Defines the structure for managing preferences form state including
 * form values, validation errors, loading state, and user feedback messages.
 */
interface PreferencesFormState {
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
 * Preferences form state management store.
 *
 * @description Creates a global state store for managing preferences form data,
 * validation, and user feedback for Step 3 of the registration process.
 */
export const usePreferencesFormStore = create<PreferencesFormState>(
  (set, get) => ({
    values: {
      favorite_animes: [],
      frequency: '',
      fanatic_level: '',
      preferred_format: '',
      watched_animes: [],
      favorite_studios: [],
      favorite_genres: [],
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
      const result = preferencesSchema.safeParse(get().values)

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
          favorite_animes: [],
          frequency: '',
          fanatic_level: '',
          preferred_format: '',
          watched_animes: [],
          favorite_studios: [],
          favorite_genres: [],
        },
        errors: {},
        errorMessage: null,
        successMessage: null,
        isLoading: false,
      }),
  })
)
