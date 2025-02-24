export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://ani-dev-rust.vercel.app'
    : 'http://localhost:4321'
