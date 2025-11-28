import { UseAuthOpenForm } from "@auth/hooks/use-auth-open-form"
export const SignInUp = () => {
  const { handleSignIn, handleSignUp } = UseAuthOpenForm()

  return (
    <div className="flex-row flex w-full ">
      <button
        className="button-primary w-full py-2 text-sm"
        onClick={handleSignIn}
      >
        Login
      </button>
      <button
        className="button-secondary ml-2 w-full   py-2 text-sm"
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </div>
  )
}
