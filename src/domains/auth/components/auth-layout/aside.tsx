import { StepsComponent } from '@auth/components/auth-steps/steps'
import { Favicon } from '@shared/components/icons/common/favicon'
import { Picture } from '@shared/components/media/picture'
import { baseUrl } from '@utils/base-url'
import { Overlay } from 'domains/shared/components/layout/overlay'

/**
 * Aside component for authentication pages.
 *
 * @description This component creates a visually appealing sidebar for authentication
 * pages (sign up and sign in). It features a full-height background image with
 * overlay effects, branding elements, and contextual messaging that changes based
 * on the authentication mode.
 *
 * Key features:
 * - Responsive design (mobile and desktop layouts)
 * - Dynamic background image with optimized loading
 * - Gradient overlay for better text readability
 * - Contextual messaging based on auth mode
 * - Integration with steps indicator
 * - Branded elements (Favicon)
 *
 * Visual elements:
 * - Background image with gradient overlay
 * - Favicon in prominent position
 * - Welcome message and description
 * - Steps indicator (desktop only)
 *
 * The component uses several utility components:
 * - Picture: For optimized image loading
 * - Overlay: For gradient effects
 * - createImageUrlProxy: For image optimization
 *
 * @param {Props} props - The component props
 * @param {string} props.bgImage - URL of the background image to display
 * @param {boolean} props.isSignUp - Whether this is being used in signup (true) or signin (false) mode
 * @returns {JSX.Element} A sidebar component with background image and authentication context
 *
 * @example
 * <Aside
 *   bgImage="/images/auth-bg.webp"
 *   isSignUp={true}
 * />
 */

export const Aside = ({
  bgImage,
  isSignUp,
}: {
  bgImage: string
  isSignUp: boolean
}) => {
  return (
    <section className="absolute h-full w-full md:relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-md md:static">
        <Picture
          image={`${baseUrl}/${bgImage}`}
          placeholder={`${baseUrl}/${bgImage}`}
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

        <div className="flex flex-row gap-4">{StepsComponent(isSignUp)}</div>
      </footer>
    </section>
  )
}
