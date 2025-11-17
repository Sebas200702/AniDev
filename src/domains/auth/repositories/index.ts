import { supabase, supabaseAdmin } from '@libs/supabase'

export const AuthRepository = {
  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }

    if (!data.session) {
      throw new Error('No session returned from authentication')
    }

    return {
      session: data.session,
      user: data.user,
    }
  },

  /**
   * Create new user account
   */
  async signUp(email: string, password: string, userName: string) {
    // First verify with admin
    const { error: verifyError } = await supabaseAdmin.auth.admin.generateLink({
      email,
      type: 'signup',
      password,
    })

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`)
    }

    // Create user
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name: userName,
          avatar_url: '',
        },
      },
    })

    if (signUpError) {
      throw new Error(`Registration failed: ${signUpError.message}`)
    }

    // Auto sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    )

    if (signInError) {
      throw new Error(`Auto sign-in failed: ${signInError.message}`)
    }

    if (!data.session) {
      throw new Error('No session returned after registration')
    }

    return {
      session: data.session,
      user: data.user,
    }
  },
}
