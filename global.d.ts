import type { SignInOptions } from 'next-auth/react'

declare module '@auth-astro/client' {
  export interface AstroSignInOptions extends SignInOptions {
    callbackUrl?: string
    prefix?: string
  }
}
