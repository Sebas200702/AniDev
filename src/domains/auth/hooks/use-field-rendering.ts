import { useAuthFormStore } from '@auth/stores/auth-store'
import type { Field } from '@auth/types'

/**
 * Hook para manejar la lógica de renderizado de campos del formulario
 *
 * @description Este hook encapsula la lógica para determinar qué campos
 * deben mostrarse y cómo deben comportarse según el contexto (Google auth, tipo de campo, etc.)
 */
export const useFieldRendering = () => {
  const { values, setField, mode, isGoogleAuth } = useAuthFormStore()

  const shouldRenderField = (field: Field): boolean => {
    // Si viene de Google y es un campo del paso 1, no renderizar
    if (
      isGoogleAuth &&
      ['email', 'password', 'user_name'].includes(field.name)
    ) {
      return false
    }
    return true
  }

  const getFieldValue = (fieldName: string) => {
    return values[fieldName] || []
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setField(fieldName, value)
  }

  const isSingleSelectField = (fieldName: string): boolean => {
    return [
      'gender',
      'frequency',
      'fanatic_level',
      'preferred_format',
    ].includes(fieldName)
  }

  return {
    shouldRenderField,
    getFieldValue,
    handleFieldChange,
    isSingleSelectField,
    mode,
    isGoogleAuth,
  }
}




