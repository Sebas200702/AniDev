import { StepsContainer } from '@auth/components/auth-steps/auth-steps-container'
import { Favicon } from '@shared/components/icons/common/favicon'
import { Overlay } from '@shared/components/layout/overlay'
import { Picture } from '@shared/components/media/picture'
import { baseUrl } from '@shared/utils/base-url'

export const Aside = ({
  bgImage,
  isSignUp,
}: {
  bgImage: string
  isSignUp: boolean
}) => {
  return (
    <section className="absolute h-full w-full overflow-hidden md:relative">
      <div className="absolute inset-0 h-full w-full rounded-md md:static">
        <Picture
          image={`${baseUrl}${bgImage}`}
          placeholder={`${baseUrl}${bgImage}`}
          styles="w-full h-full "
          alt="background image"
        />
      </div>
      <Favicon
        className={`text-enfasisColor absolute top-2 right-4 left-4 z-20 h-8 w-8 md:h-16 md:w-16`}
      />

      <Overlay
        className={`z-10 h-full w-full bg-gradient-to-b via-black/60 via-20% to-black/90`}
      />

      <footer className="absolute right-0 bottom-0 left-0 z-10 hidden flex-col gap-10 p-4 md:flex">
        <header className="flex flex-col gap-2">
          <span className="bg-Primary-50/10 w-fit rounded-full px-4 py-2 text-sm backdrop-blur-2xl">
            {isSignUp ? 'Join to enjoy' : 'Great to see you again!'}
          </span>
          <h1 className="text-Primary-50 text-4xl font-bold text-pretty">
            {isSignUp ? 'Start your journey with us' : 'Welcome back again!'}
          </h1>
          <p className="text-Primary-100 text-sm">
            {isSignUp
              ? 'Follow the steps to create your account'
              : 'Enter your email and password to sign in'}
          </p>
        </header>
        <StepsContainer />
      </footer>
    </section>
  )
}
