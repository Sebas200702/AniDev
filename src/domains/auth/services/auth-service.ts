import { type SignInSchema, signInSchema } from '@auth/schemas/sigin'
import {
  type SignUpSchema,
  signUpSchema,
} from '@auth/schemas/signup'
import { api } from '@libs/api'

export const authService = {
  async signUp(
    values:  SignUpSchema,
  ) {
    const schema =  signUpSchema
    const parsed = schema.parse(values)

    const res = await api.post('/auth/signup', parsed)
    if (res.status !== 200)
      throw new Error(res.error?.message || 'Error en el registro')

    return res.data
  },

  async signIn(values: SignInSchema) {
    const parsed = signInSchema.parse(values)

    const res = await api.post('/auth/signin', parsed)
    if (res.status !== 200)
      throw new Error(res.error?.message || 'Error al iniciar sesión')

    return res.data
  },
}
