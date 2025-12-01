import type { FilterOption } from '@search/types'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthStep {
  id: number
  title: string
  description: string
  fields: Field[]
}
type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'image'
  | 'button'
  | 'google'

export interface Field {
  name: string
  type: FieldType
  placeholder: string
  options?: FilterOption[]
}

export interface AuthResult {
  user: User
  session: Session
}

export type AuthMode = 'signIn' | 'signUp'
