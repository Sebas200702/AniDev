import { useAuthFormStore } from '@store/auth-form-store'
import { useEffect } from 'react'

const stepsSignUp: {
  id: number
  title: string
  description: string
  fields: {
    name: string
    type: string
    placeholder: string
    options?: { label: string; value: string }[]
  }[]
}[] = [
  {
    id: 1,
    title: 'Create your account',
    description: 'Create an account to continue',
    fields: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Email',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password',
      },
      {
        name: 'user_name',
        type: 'text',
        placeholder: 'Username',
      },
    ],
  },
  {
    id: 2,
    title: 'Complete your profile',
    description: 'Complete your profile to get started',
    fields: [
      {
        name: 'name',
        type: 'text',
        placeholder: 'Name',
      },
      {
        name: 'last_name',
        type: 'text',
        placeholder: 'Last Name',
      },
      {
        name: 'birthday',
        type: 'date',
        placeholder: 'Birthday',
      },
      {
        name: 'gender',
        type: 'select',
        placeholder: 'Gender',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'favorite_animes',
        type: 'checkbox',
        placeholder: 'Favorite Animes',
        options: [
          { label: 'One Piece', value: 'one_piece' },
          { label: 'Naruto', value: 'naruto' },
          { label: 'Dragon Ball', value: 'dragon_ball' },
          { label: 'Attack on Titan', value: 'attack_on_titan' },
        ],
      },
      {
        name: 'frequency',
        type: 'select',
        placeholder: 'Frequency',
        options: [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
          { label: 'Yearly', value: 'yearly' },
        ],
      },
      {
        name: 'fanatic_level',
        type: 'select',
        placeholder: 'Fanatic Level',
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Otaku', value: 'otaku' },
        ],
      },
      {
        name: 'preferred_format',
        type: 'select',
        placeholder: 'Preferred Format',
        options: [
          { label: 'TV', value: 'tv' },
          { label: 'Movie', value: 'movie' },
          { label: 'OVA', value: 'ova' },
          { label: 'ONA', value: 'ona' },
          { label: 'Special', value: 'special' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'watched_animes',
        type: 'checkbox',
        placeholder: 'Watched Animes',
        options: [{ label: 'One Piece', value: 'one_piece' }],
      },
      {
        name: 'favorite_studios',
        type: 'checkbox',
        placeholder: 'Favorite Studios',
        options: [
          { label: 'Studio Ghibli', value: 'studio_ghibli' },
          { label: 'Studio Pierrot', value: 'studio_pierrot' },
          { label: 'Studio Deen', value: 'studio_deen' },
          { label: 'Studio Bones', value: 'studio_bones' },
          { label: 'Studio Madhouse', value: 'studio_madhouse' },
          { label: 'Studio ufotable', value: 'studio_ufotable' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Verify and setup',
    description: 'Verify your email to get started',
    fields: [],
  },
]

const stepsSignIn: {
  id: number
  title: string
  description: string
  fields: { name: string; type: string; placeholder: string }[]
}[] = [
  {
    id: 1,
    title: 'Sign in to your account',
    description: 'Enter your email and password to sign in',
    fields: [],
  },
]
export const StepsComponent = (isSignUp: boolean) => {
  const { currentStep, setCurrentStep, setSteps } = useAuthFormStore()
  const steps = isSignUp ? stepsSignUp : stepsSignIn
  useEffect(() => {
    setSteps(steps)
  }, [steps])
  return steps.map((step, index) => (
    <div
      key={step.id}
      onClick={() => setCurrentStep(step.id)}
      className={`relative hover:bg-Primary-200/10 cursor-pointer transition-all duration-300 flex rounded-2xl h-36 justify-end p-4 w-full flex-col backdrop-blur-2xl ${currentStep === step.id ? 'bg-enfasisColor/40' : ' bg-black/50'}`}
    >
      <span
        className={`absolute top-4 left-4 text-Primary-50  text-sm bg-Primary-200/30 rounded-full w-6 h-6 flex items-center justify-center p-2 backdrop-blur-2xl ${currentStep === step.id ? 'bg-enfasisColor' : ''}`}
      >
        {step.id}
      </span>
      <h5 className=" text-sm w-full  font-bold">{step.title}</h5>
    </div>
  ))
}
