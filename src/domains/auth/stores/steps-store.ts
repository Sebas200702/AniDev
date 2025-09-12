import { create } from 'zustand'

interface Step {
  id: number
  title: string
  description: string
  fields: {
    name: string
    type: string
    placeholder: string
    options?: { label: string; value: string }[]
  }[]
}

interface StepsState {
  steps: Step[]
  currentStep: number
  subStep: number
  setSteps: (steps: Step[]) => void
  setCurrentStep: (step: number) => void
  setSubStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  nextSubStep: () => void
  previousSubStep: () => void
  resetSteps: () => void
}

const initialSteps: Step[] = []

export const useStepsStore = create<StepsState>((set, get) => ({
  steps: initialSteps,
  currentStep: 1,
  subStep: 1,

  setSteps: (steps) => set({ steps }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setSubStep: (step) => set({ subStep: step }),

  nextStep: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length) {
      set({ currentStep: currentStep + 1, subStep: 1 })
    }
  },

  previousStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1, subStep: 1 })
    }
  },

  nextSubStep: () => {
    const { subStep } = get()
    set({ subStep: subStep + 1 })
  },

  previousSubStep: () => {
    const { subStep } = get()
    if (subStep > 1) {
      set({ subStep: subStep - 1 })
    }
  },

  resetSteps: () => set({ currentStep: 1, subStep: 1 }),
}))
