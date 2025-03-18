import { create } from 'zustand'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(
      /(?=.*[a-z])/,
      'La contraseña debe contener al menos una letra minúscula'
    )
    .regex(
      /(?=.*[A-Z])/,
      'La contraseña debe contener al menos una letra mayúscula'
    )
    .regex(/(?=.*\d)/, 'La contraseña debe contener al menos un número')
    .regex(
      /(?=.*[!@#$%^&*])/,
      'La contraseña debe contener al menos un símbolo'
    )
    .max(20, 'La contraseña no puede tener más de 20 caracteres'),
})

const signUpSchema = signInSchema.extend({
  email: z.string().email('Formato de email inválido'),
  password: z.string(),
  user_name: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
})

export type FormValues = z.infer<typeof signUpSchema>
type FormErrors = Partial<Record<keyof FormValues, string | null>>

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
