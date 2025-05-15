import { GoogleBtn } from '@components/auth/google-btn'
import { Input } from '@components/auth/input'
import { EmailIcon } from '@components/icons/email-icon'
import { PasswordIcon } from '@components/icons/password-icon'
import { UserIcon } from '@components/icons/user-icon'
import { useAuthFormStore } from '@store/auth-form-store'

interface Props {
  isLoading: boolean
  isSignUp: boolean
  title: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Main = ({ isLoading, isSignUp, title, onSubmit }: Props) => {
  const { currentStep, steps } = useAuthFormStore()
  return (
    <section className="flex w-full flex-col items-center justify-center px-20">
      {currentStep === 1 && (
        <>
          <h2 className="text-Primary-50 text-lx mb-6 font-bold">{title}</h2>

          <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
            {isSignUp && (
              <Input
                name="user_name"
                type="text"
                placeholder="Username"
                required
              >
                <UserIcon className="h-5 w-5" />
              </Input>
            )}

            <Input name="email" type="email" placeholder="Email" required>
              <EmailIcon className="h-5 w-5" />
            </Input>

            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            >
              <PasswordIcon className="h-5 w-5" />
            </Input>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : title}
            </button>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="mx-4 text-gray-200">or</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </form>

          <GoogleBtn />

          <footer className="text-Primary-200 mt-6 text-center text-sm">
            {title === 'Sign In' ? (
              <p>
                <span>Don&apos;t have an account?</span>{' '}
                <a href="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="/signin" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            )}
          </footer>
        </>
      )}
      {currentStep === 2 && (
        <div>
          <h2>{steps[currentStep - 1].title}</h2>
        </div>
      )}
    </section>
  )
}
