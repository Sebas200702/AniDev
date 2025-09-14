export interface Seiyuu {
  id: string
  voice_actor_id: number
  name: string
  alternative_names: string[] | null
  family_name: string | null
  given_name: string | null
  birthday: string | null
  image_url: string | null
  language: string
}
