import Google from '@auth/core/providers/google'
import { supabase } from '@libs/supabase'
import { supabaseAdmin } from '@libs/supabase'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { data: pub, error: e1 } = await supabase
        .from('public_users')
        .select('id')
        .eq('name', user.name)
      if (e1) {
        console.error(e1)
        return false
      }

      const { data: listRes, error: listErr } =
        await supabaseAdmin.auth.admin.listUsers({
          filter: `email.eq.${user.email}`,
        })
      if (listErr) {
        console.error('Error listando usuarios admin:', listErr)
        return false
      }

      if (listRes.users.length === 0) {
        const { data: createRes, error: createErr } =
          await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            email_confirm: true,
            user_metadata: {
              user_name: user.name,
              avatar_url: user.image,
            },
          })
        if (createErr) {
          console.error('Error creando usuario admin:', createErr)
          return false
        }
        console.log('Usuario admin creado:', createRes.user.id)
      }

      return true
    },
  },
})
