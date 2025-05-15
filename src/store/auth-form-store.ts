import { z } from 'zod'
import { create } from 'zustand'

/**
 * Validation schema for sign-in form data.
 *
 * @description Defines validation rules for email and password fields during authentication.
 * The email must be in valid format, and the password must meet specific complexity requirements
 * including minimum/maximum length, lowercase/uppercase letters, numbers, and special characters.
 */
const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
        .string()
        .min(6, 'The password must be at least 6 characters long')
    .regex(
      /(?=.*[a-z])/,
      'The password must contain at least one lowercase letter'
    )
    .regex(
      /(?=.*[A-Z])/,
      'The password must contain at least one uppercase letter'
    )
    .regex(/(?=.*\d)/, 'The password must contain at least one number')
    .regex(
      /(?=.*[!@#$%^&*])/,
      'The password must contain at least one symbol'
    )
    .max(20, 'The password cannot have more than 20 characters'),
})

/**
 * Validation schema for sign-up form data.
 *
 * @description Extends the sign-in schema to include username validation.
 * The username must be at least 3 characters long.
 */
const signUpSchema = signInSchema.extend({
  email: z.string().email('Invalid email format'),
  password: z.string(),
  user_name: z
    .string()
    .min(3, 'The username must be at least 3 characters long'),
})

export type FormValues = z.infer<typeof signUpSchema>
type FormErrors = Partial<Record<keyof FormValues, string | null>>

/**
 * Authentication form state and methods interface.
 *
 * @description Defines the structure for managing authentication form state including
 * form values, validation errors, loading state, and user feedback messages.
 * Provides methods for updating form values, handling validation, managing errors,
 * and controlling the form lifecycle.
 */
interface AuthFormState {
  values: FormValues
  errors: FormErrors
  isLoading: boolean
  errorMessage: string | null
  successMessage: string | null

  setValues: (values: Partial<FormValues>) => void
  setValue: <K extends keyof FormValues>(field: K, value: string) => void
  setErrors: (errors: FormErrors) => void
  setError: <K extends keyof FormValues>(field: K, error: string | null) => void
  validate: (isSignUp: boolean) => boolean
  clearMessages: () => void
  setIsLoading: (isLoading: boolean) => void
  setErrorMessage: (message: string | null) => void
  setSuccessMessage: (message: string | null) => void
  resetForm: () => void
}

/**
 * Authentication form state management store.
 *
 * @description Creates a global state store for managing authentication form data,
 * validation, and user feedback. The store handles form values, validation errors,
 * loading states, and system messages for both sign-in and sign-up processes.
 *
 * The store provides methods to:
 * - Update form values individually or in batch
 * - Set and clear validation errors
 * - Validate form data against appropriate schemas
 * - Manage loading states during form submission
 * - Handle success and error messages
 * - Reset the form to its initial state
 *
 * @returns {AuthFormState} The authentication form state and management methods
 *
 * @example
 * const { values, errors, validate, setValues } = useAuthFormStore()
 *
 * // Update a form field
 * setValues({ email: 'user@example.com' })
 *
 * // Validate the form
 * const isValid = validate(true) // true for sign-up, false for sign-in
 */
export const useAuthFormStore = create<AuthFormState>((set, get) => ({
  values: {
    email: '',
    password: '',
    user_name: '',
  },
  errors: {},
  isLoading: false,
  errorMessage: null,
  successMessage: null,

  setValues: (values) =>
    set((state) => ({
      values: { ...state.values, ...values },
    })),

  setValue: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
    })),

  setErrors: (errors) => set({ errors }),

  setError: (field, error) =>
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    })),

  validate: (isSignUp) => {
    const schema = isSignUp ? signUpSchema : signInSchema
    const result = schema.safeParse(get().values)

    if (!result.success) {
      const formattedErrors: FormErrors = {}

      result.error.errors.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.') as keyof FormValues
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
      values: { email: '', password: '', user_name: '' },
      errors: {},
      errorMessage: null,
      successMessage: null,
      isLoading: false,
    }),
}))
