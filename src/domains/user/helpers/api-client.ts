import { api } from '@libs/api'

export const userApiClient = {
  async createProfile(profileData: Record<string, any>) {
    const res = await api.post('/user/profile', profileData)
    
    if (res.status !== 200) {
      throw new Error(res.error?.message || 'Error al crear el perfil')
    }

    return res.data
  },

  async updateProfile(profileData: Record<string, any>) {
    const res = await api.post('/user/updateProfile', profileData)
    
    if (res.status !== 200) {
      throw new Error(res.error?.message || 'Error al actualizar el perfil')
    }

    return res.data
  },
}
