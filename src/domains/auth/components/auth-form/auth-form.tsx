import { Aside } from '@auth/components/auth-layout/auth-layout-aside'
import { MainContainer } from '@auth/components/auth-layout/auth-layout-main-container'

interface Props {
  bgImage: string
  isSignUp: boolean
}

export const AuthFormulary = ({ bgImage, isSignUp }: Props) => {
  return (
    <article className="bg-Complementary border-enfasisColor/30 relative flex h-[80dvh] w-full max-w-7xl overflow-hidden rounded-lg border-1">
      <Aside bgImage={bgImage} isSignUp={isSignUp} />
      <MainContainer />
    </article>
  )
}
