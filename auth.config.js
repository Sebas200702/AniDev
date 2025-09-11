import Google from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'
import { supabaseAdmin } from './src/libs/supabase'

export default defineConfig({
  secret: import.meta.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()
        if (error) throw error

        let supabaseUser = data.users.find(
          (u) => u.email?.toLowerCase() === user.email?.toLowerCase()
        )

        if (!supabaseUser) {
          const { data: created, error: createErr } =
            await supabaseAdmin.auth.admin.createUser({
              email: user.email,
              email_confirm: true,
              user_metadata: {
                user_name: user.name,
                avatar_url: user.image,
              },
            })

          if (createErr) {
            console.error('❌ Error creando usuario en Supabase:', createErr)
            throw createErr
          }

          supabaseUser = created.user

          const { error: insertErr } = await supabaseAdmin
            .from('public_users')
            .insert({
              id: supabaseUser.id,
              name: user.name,
              avatar_url: user.image,
            })

          if (insertErr) {
            console.error('❌ Error insertando en public_users:', insertErr)
          }
        }

        token.supabaseUserId = supabaseUser.id

        const { data: link, error: linkErr } =
          await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: supabaseUser.email,
          })

        if (linkErr) {
          console.error('❌ Error generando token Supabase:', linkErr)
        } else {
          const url = new URL(link.properties.action_link)
          const accessToken = url.searchParams.get('token')
          token.supabaseAccessToken = accessToken
        }
      }

      return token
    },

    async session({ session, token }) {
      const { data: profile, error } = await supabaseAdmin
        .from('public_users')
        .select('id, name, avatar_url')
        .eq('id', token.supabaseUserId)
        .single()

      if (error) {
        console.error('❌ Error obteniendo perfil desde public_users:', error)
      }

      session.user.id = token.supabaseUserId
      session.supabaseAccessToken = token.supabaseAccessToken
      session.user.name = profile?.name ?? session.user.name
      session.user.image = profile?.avatar_url ?? session.user.image

      return session
    },
  },
})
