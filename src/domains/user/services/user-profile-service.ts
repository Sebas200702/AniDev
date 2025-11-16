import { api } from '@libs/api'
import {
  type UserProfileSchema,
  userProfileSchema,
} from '@user/schemas/profile'

export const userProfileService = {
  async createProfile(values: any) {
    const parsed = userProfileSchema.parse(values)
    const res = await api.post('/user/profile', parsed)
    if (res.status !== 200)
      throw new Error(
        res.error?.message || 'Error al crear el perfil de usuario'
      )

    return res.data
  },

  async updateProfile(values: UserProfileSchema) {
    const parsed = userProfileSchema.parse(values)
    const res = await api.put('/user/profile', parsed)
    if (res.status !== 200)
      throw new Error(res.error?.message || 'Error al actualizar el perfil')

    return res.data
  },
}
