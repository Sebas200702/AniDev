import type { FilterOption } from '@search/types'

export interface AuthStep {
  id: number
  title: string
  description: string
  fields: Field[]
}
type FieldType = 'text' | 'email' | 'password' | 'date' | 'select' | 'checkbox' | 'image' | 'button'| 'google'

export interface Field {
  name: string
  type: FieldType
  placeholder: string
  options?: FilterOption[]
}
