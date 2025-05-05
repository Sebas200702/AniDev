export {}

declare module '@auth-astro/client' {
  interface AstroSignInOptions {
    callbackUrl?: string
  }
}
