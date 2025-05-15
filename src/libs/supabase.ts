import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client instance for database and authentication operations.
 *
 * @description This module initializes and exports a Supabase client instance configured
 * with environment variables for project URL and anonymous key. The client is used
 * throughout the application for database operations and authentication.
 *
 * The client is configured with:
 * - Project URL (from SUPABASE_URL environment variable)
 * - Anonymous key for public access (from SUPABASE_ANON_KEY environment variable)
 * - PKCE (Proof Key for Code Exchange) authentication flow for enhanced security
 *
 * This instance provides methods for:
 * - Database queries and mutations
 * - User authentication and authorization
 * - Real-time subscriptions
 * - Storage operations
 *
 * @example
 * // Query data
 * const { data, error } = await supabase
 *   .from('animes')
 *   .select('*')
 *   .limit(10);
 *
 * // Authenticate user
 * const { user, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 */
export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,

  {
    auth: {
      flowType: 'pkce',
    },
  }
)

export const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)
