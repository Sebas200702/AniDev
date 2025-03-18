import Google from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'
import { supabase } from '@libs/supabase'

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const result = await supabase
        .from('public_users')
        .select('*')
        .eq('name', user.name)
      if (result.data && result.data.length > 0) {
        return true
      }
      const { error } = await supabase.from('public_users').upsert({
        name: user.name,
        avatar_url: user.image,
      })
      if (error) {
        console.log(error)
        return false
      }
      return true
    },
  },
})
