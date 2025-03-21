export {}; // Esto asegura que el archivo sea tratado como un módulo

declare module '@auth-astro/client' {
  // Se "fusiona" con la definición original de AstroSignInOptions
  interface AstroSignInOptions {
    callbackUrl?: string;
  }
}
