import { Aside } from '@auth/components/auth-layout/auth-layout-aside'
import { MainContainer } from '@auth/components/auth-layout/auth-layout-main-container'

interface Props {
  bgImage: string
  isSignUp: boolean
}

export const AuthFormulary = ({
  bgImage,
  isSignUp,
}: Props) => {
  return (
    <section className="flex h-full max-h-[75vh] w-full items-center justify-center  text-white md:mt-20 md:px-20">
      <article className="bg-Complementary border-enfasisColor/30 relative flex h-full w-full max-w-7xl overflow-hidden rounded-lg border-1">
        <Aside bgImage={bgImage} isSignUp={isSignUp} />
        <MainContainer  />
      </article>
    </section>
  )
}
