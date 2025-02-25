import { supabase } from '@libs/supabase'

export const getSessionUserInfo = async () => {
  const { data } = await supabase.auth.getSession()
  const userInfo = {
    name: (data?.session?.user?.user_metadata?.name as string) ?? null,
    avatar: (data?.session?.user?.user_metadata?.avatar_url as string) ?? null,
  }
  return userInfo
}
