import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

export const updatePreferences = async (
  userId: string,
  enfasisColor?: string,
  parentalControl?: boolean
) => {
  const updates: any = {}
  if (enfasisColor !== undefined) updates.enfasis_color = enfasisColor
  if (parentalControl !== undefined) updates.parental_control = parentalControl

  const { data, error } = await supabase
    .from('public_users')
    .update(updates)
    .eq('id', userId)

  if (error) {
    throw AppError.database('Failed to update preferences', {
      userId,
      updates,
      ...error,
    })
  }
  if (!data) {
    throw AppError.notFound('Preferences not found', { userId })
  }

  return data
}
