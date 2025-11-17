import { type SignInSchema } from '@auth/schemas/sigin'
import { type SignUpSchema } from '@auth/schemas/signup'
import { api } from '@libs/api'

export const authApiClient = {
  async signUp(values: SignUpSchema) {
    const res = await api.post('/auth/signup', values)

    if (res.status !== 200) {
      throw new Error(res.error?.message || 'Error en el registro')
    }

    return res.data
  },

  async signIn(values: SignInSchema) {
    const res = await api.post('/auth/signin', values)

    if (res.status !== 200) {
      throw new Error(res.error?.message || 'Error al iniciar sesión')
    }

    return res.data
  },
}
