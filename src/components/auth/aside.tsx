import { createImageUrlProxy } from "@utils/create-imageurl-proxy"
import { StepsComponent } from "./steps"
import { Picture } from "@components/picture"
import { Favicon } from "@components/icons/favicon"
import { baseUrl } from "@utils/base-url"
import { Overlay } from "@components/overlay"

export const Aside = ({bgImage, isSignUp}: {bgImage: string, isSignUp: boolean}) => {
  return (
    <Picture
    image={
      createImageUrlProxy(`${baseUrl}${bgImage}`, '100', '0', 'webp') ??
      ''
    }
    styles="w-full relative overflow-hidden rounded-md"
  >
    <Favicon
      className={`text-enfasisColor absolute top-2 right-4 left-4 z-20 h-8 w-8 md:h-16 md:w-16`}
    />

    <Overlay
      className={`to-black/90 z-10 h-full w-full bg-gradient-to-b`}
    />
    <img
      src={bgImage}
      className="relative h-full w-full object-cover object-center"
      alt=""
    />
    <footer className="absolute bottom-0 left-0 right-0 z-10 flex  flex-col gap-10 p-4">
      <header className="flex flex-col gap-2">
        <span className=" text-sm bg-Primary-50/10 backdrop-blur-2xl rounded-full px-4 py-2 w-fit">
          {isSignUp ? 'Join to enjoy' : 'Great to see you again!'}
        </span>
        <h3 className="text-Primary-50 text-4xl font-bold text-pretty">
          {isSignUp
            ? 'Start your journey with us'
            : 'Welcome back again!'}
        </h3>
        <p className="text-Primary-100 text-sm">
          {isSignUp
            ? 'Follow the steps to create your account'
            : 'Enter your email and password to sign in'}
        </p>
      </header>

      <div className="flex flex-row gap-4">
        {StepsComponent(isSignUp)}
      </div>
    </footer>
  </Picture>
  )
}
