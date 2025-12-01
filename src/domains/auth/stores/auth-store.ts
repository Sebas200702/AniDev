import { authApiClient } from '@auth/client/auth-client'
import type { AuthMode, AuthStep } from '@auth/types'
import { stepsSignIn, stepsSignUp } from '@auth/utils/steps'
import { userApiClient } from '@user/helpers/api-client'
import { z } from 'zod'
import { create } from 'zustand'

interface AuthFormState {
  mode: AuthMode | null
  currentStep: number
  steps: AuthStep[]
  values: Record<string, any>
  error: string | null
  loading: boolean
  isGoogleAuth: boolean
  setMode: (mode: AuthMode) => void
  setCurrentStep: (step: number) => void
  setField: (field: string, value: any) => void
  setGoogleAuth: (isGoogle: boolean) => void
  nextStep: () => void
  prevStep: () => void
  submit: () => Promise<{ success: boolean; message: string }>
  reset: () => void
}

export const useAuthFormStore = create<AuthFormState>((set, get) => ({
  mode: null,
  currentStep: 1,
  steps: stepsSignIn,
  values: {},
  error: null,
  loading: false,
  isGoogleAuth: false,

  setMode: (mode) => {
    set({
      mode,
      currentStep: 1,
      steps: mode === 'signUp' ? stepsSignUp : stepsSignIn,
      values: {},
      error: null,
    })
  },
  setCurrentStep(step) {
    set({
      currentStep: step,
    })
  },

  setField: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
    })),

  setGoogleAuth: (isGoogle) => set({ isGoogleAuth: isGoogle }),

  nextStep: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length) set({ currentStep: currentStep + 1 })
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) set({ currentStep: currentStep - 1 })
  },

  submit: async () => {
    const { mode, values, isGoogleAuth } = get()
    try {
      set({ loading: true, error: null })

      if (mode === 'signUp') {
        const { email, password, user_name, ...profileData } = values

        if (!isGoogleAuth) {
          await authApiClient.signUp({ email, password, user_name })
        }

        await userApiClient.createProfile(profileData)
        return { success: true, message: 'Account created successfully 🎉' }
      } else {
        const { email, password } = values
        await authApiClient.signIn({ email, password })
        return { success: true, message: 'Login successful 🎉' }
      }
    } catch (err: any) {
      const message =
        err instanceof z.ZodError ? err.errors[0]?.message : err.message
      set({ error: message })
      return { success: false, message }
    } finally {
      set({ loading: false })
    }
  },

  reset: () => set({ values: {}, currentStep: 1, error: null }),
}))
