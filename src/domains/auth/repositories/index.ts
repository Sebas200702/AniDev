import type { AuthResult } from '@auth/types'
import { supabase, supabaseAdmin } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const AuthRepository = {
  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw AppError.unauthorized('Authentication failed', { ...error })
    }

    if (!data.session) {
      throw AppError.unauthorized('No session returned from authentication')
    }

    return {
      session: data.session,
      user: data.user,
    }
  },

  /**
   * Create new user account
   */
  async signUp(
    email: string,
    password: string,
    userName: string
  ): Promise<AuthResult> {
    const { error: verifyError } = await supabaseAdmin.auth.admin.generateLink({
      email,
      type: 'signup',
      password,
    })

    if (verifyError) {
      throw AppError.externalApi('Verification failed', { ...verifyError })
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
      throw AppError.database('Registration failed', { ...signUpError })
    }

    // Auto sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    )

    if (signInError) {
      throw AppError.unauthorized('Auto sign-in failed', { ...signInError })
    }

    if (!data.session) {
      throw AppError.unauthorized('No session returned after registration')
    }

    return {
      session: data.session,
      user: data.user,
    }
  },
}
