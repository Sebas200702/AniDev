import { AuthRepository } from '@auth/repositories'
import { signInSchema } from '@auth/schemas/sigin'
import { signUpSchema } from '@auth/schemas/signup'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('AuthService')

/**
 * Auth Service
 *
 * @description
 * Service layer for authentication operations. Handles business logic
 * for user sign-in and sign-up with validation.
 *
 * @features
 * - Sign in with validation
 * - Sign up with validation
 * - Error handling and logging
 */
export const AuthService = {
  /**
   * Authenticate user with email and password
   */
  async signIn(email: string, password: string) {
    try {
      // Validate input
      const validated = signInSchema.parse({ email, password })

      return await AuthRepository.signIn(validated.email, validated.password)
    } catch (error) {
      logger.error('[AuthService.signIn] Error:', { error })

      if (isAppError(error)) {
        throw error
      }

      // Zod validation errors or unexpected
      throw AppError.validation('Invalid sign-in data', {
        originalError: error,
      })
    }
  },

  /**
   * Register new user
   */
  async signUp(email: string, password: string, userName: string) {
    try {
      // Validate input
      const validated = signUpSchema.parse({
        email,
        password,
        user_name: userName,
      })

      return await AuthRepository.signUp(
        validated.email,
        validated.password,
        validated.user_name
      )
    } catch (error) {
      logger.error('[AuthService.signUp] Error:', { error })

      if (isAppError(error)) {
        throw error
      }

      throw AppError.validation('Invalid sign-up data', {
        originalError: error,
      })
    }
  },
}
