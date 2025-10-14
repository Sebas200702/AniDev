import { Aside } from '@auth/components/auth-layout/aside'
import { Main } from '@auth/components/auth-layout/main'

interface Props {
  bgImage: string
  isLoading: boolean
  isSignUp: boolean
  title: string
}

export const AuthFormulary = ({
  bgImage,
  isLoading,
  title,
  isSignUp,
}: Props) => {
  return (
    <section className="flex h-full max-h-[75vh] w-full items-center justify-center px-4 text-white md:mt-20 md:px-20">
      <article className="bg-Complementary border-enfasisColor/30 relative flex h-full w-full max-w-7xl overflow-hidden rounded-lg border-1">
        <Aside bgImage={bgImage} isSignUp={isSignUp} />
        <Main isLoading={isLoading} isSignUp={isSignUp} title={title} />
      </article>
    </section>
  )
}
