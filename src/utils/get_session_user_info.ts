import { getSession } from 'auth-astro/server'

export const getSessionUserInfo = async ({
  request,
}: {
  request: Request | undefined
}) => {
  if (!request) return null
  const session = await getSession(request)

  const userInfo = {
    name: session?.user?.name ?? null,
    avatar: session?.user?.image ?? null,
  }

  return userInfo
}
