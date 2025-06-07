import { useStepsStore } from '@store/steps-store'
import { useEffect } from 'react'

const stepsSignUp: {
  id: number
  title: string
  description: string
  fields: {
    name: string
    type: string
    placeholder: string
    options?: { label: string; value: string }[]
  }[]
}[] = [
  {
    id: 1,
    title: 'Create your account',
    description: 'Create an account to continue',
    fields: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Email',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password',
      },
      {
        name: 'user_name',
        type: 'text',
        placeholder: 'Username',
      },
    ],
  },
  {
    id: 2,
    title: 'Complete your profile',
    description: 'Complete your profile to get started',
    fields: [
      {
        name: 'avatar',
        type: 'image',
        placeholder: 'Profile Picture',
      },
      {
        name: 'name',
        type: 'text',
        placeholder: 'Name',
      },
      {
        name: 'last_name',
        type: 'text',
        placeholder: 'Last Name',
      },
      {
        name: 'birthday',
        type: 'date',
        placeholder: 'Birthday',
      },
      {
        name: 'gender',
        type: 'select',
        placeholder: 'Gender',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Set your preferences',
    description: 'Tell us about your anime preferences',
    fields: [
      {
        name: 'favorite_animes',
        type: 'checkbox',
        placeholder: 'Favorite Animes',
        options: [
          { label: 'One Piece', value: 'one_piece' },
          { label: 'Naruto', value: 'naruto' },
          { label: 'Dragon Ball', value: 'dragon_ball' },
          { label: 'Attack on Titan', value: 'attack_on_titan' },
          { label: 'Death Note', value: 'death_note' },
          { label: 'Fullmetal Alchemist', value: 'fullmetal_alchemist' },
          { label: 'My Hero Academia', value: 'my_hero_academia' },
          { label: 'Demon Slayer', value: 'demon_slayer' },
          { label: 'Jujutsu Kaisen', value: 'jujutsu_kaisen' },
          { label: 'Tokyo Ghoul', value: 'tokyo_ghoul' },
          { label: 'Hunter x Hunter', value: 'hunter_x_hunter' },
          { label: 'Bleach', value: 'bleach' },
          { label: 'One Punch Man', value: 'one_punch_man' },
          { label: 'Mob Psycho 100', value: 'mob_psycho_100' },
          { label: 'Spirited Away', value: 'spirited_away' },
          { label: 'Your Name', value: 'your_name' },
          { label: 'Princess Mononoke', value: 'princess_mononoke' },
          { label: 'Akira', value: 'akira' },
          { label: 'Ghost in the Shell', value: 'ghost_in_the_shell' },
          { label: 'Cowboy Bebop', value: 'cowboy_bebop' },
          { label: 'Neon Genesis Evangelion', value: 'evangelion' },
          { label: 'Code Geass', value: 'code_geass' },
          { label: 'Steins;Gate', value: 'steins_gate' },
          {
            label: "JoJo's Bizarre Adventure",
            value: 'jojo_bizarre_adventure',
          },
          { label: 'Chainsaw Man', value: 'chainsaw_man' },
          { label: 'Spy x Family', value: 'spy_x_family' },
          { label: 'Violet Evergarden', value: 'violet_evergarden' },
          { label: 'Fairy Tail', value: 'fairy_tail' },
          { label: 'Tokyo Revengers', value: 'tokyo_revengers' },
          { label: 'Dr. Stone', value: 'dr_stone' },
          { label: 'Black Clover', value: 'black_clover' },
          { label: 'Fire Force', value: 'fire_force' },
          { label: 'Haikyuu!!', value: 'haikyuu' },
          { label: 'Kuroko no Basket', value: 'kuroko_no_basket' },
          { label: 'Slam Dunk', value: 'slam_dunk' },
        ],
      },
      {
        name: 'frequency',
        type: 'select',
        placeholder: 'How often do you watch anime?',
        options: [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
          { label: 'Occasionally', value: 'occasionally' },
          { label: 'Rarely', value: 'rarely' },
        ],
      },
      {
        name: 'fanatic_level',
        type: 'select',
        placeholder: 'Fanatic Level',
        options: [
          { label: 'Casual Viewer', value: 'casual' },
          { label: 'Regular Fan', value: 'regular' },
          { label: 'Dedicated Fan', value: 'dedicated' },
          { label: 'Otaku', value: 'otaku' },
          { label: 'Hardcore Otaku', value: 'hardcore_otaku' },
        ],
      },
      {
        name: 'preferred_format',
        type: 'select',
        placeholder: 'Preferred Format',
        options: [
          { label: 'TV Series', value: 'tv' },
          { label: 'Movies', value: 'movie' },
          { label: 'OVA', value: 'ova' },
          { label: 'ONA', value: 'ona' },
          { label: 'Specials', value: 'special' },
          { label: 'No preference', value: 'no_preference' },
        ],
      },
      {
        name: 'watched_animes',
        type: 'checkbox',
        placeholder: 'Animes you have already watched',
        options: [
          { label: 'One Piece', value: 'one_piece' },
          { label: 'Naruto', value: 'naruto' },
          { label: 'Dragon Ball', value: 'dragon_ball' },
          { label: 'Attack on Titan', value: 'attack_on_titan' },
          { label: 'Death Note', value: 'death_note' },
          { label: 'Fullmetal Alchemist', value: 'fullmetal_alchemist' },
          { label: 'My Hero Academia', value: 'my_hero_academia' },
          { label: 'Demon Slayer', value: 'demon_slayer' },
          { label: 'Jujutsu Kaisen', value: 'jujutsu_kaisen' },
          { label: 'Tokyo Ghoul', value: 'tokyo_ghoul' },
          { label: 'Hunter x Hunter', value: 'hunter_x_hunter' },
          { label: 'Bleach', value: 'bleach' },
          { label: 'One Punch Man', value: 'one_punch_man' },
          { label: 'Mob Psycho 100', value: 'mob_psycho_100' },
          { label: 'Spirited Away', value: 'spirited_away' },
          { label: 'Your Name', value: 'your_name' },
          { label: 'Princess Mononoke', value: 'princess_mononoke' },
          { label: 'Cowboy Bebop', value: 'cowboy_bebop' },
          { label: 'Neon Genesis Evangelion', value: 'evangelion' },
          { label: 'Code Geass', value: 'code_geass' },
          { label: 'Steins;Gate', value: 'steins_gate' },
          {
            label: "JoJo's Bizarre Adventure",
            value: 'jojo_bizarre_adventure',
          },
          { label: 'Chainsaw Man', value: 'chainsaw_man' },
          { label: 'Spy x Family', value: 'spy_x_family' },
          { label: 'Violet Evergarden', value: 'violet_evergarden' },
          { label: 'Fairy Tail', value: 'fairy_tail' },
          { label: 'Tokyo Revengers', value: 'tokyo_revengers' },
          { label: 'Dr. Stone', value: 'dr_stone' },
          { label: 'Black Clover', value: 'black_clover' },
          { label: 'Fire Force', value: 'fire_force' },
          { label: 'Haikyuu!!', value: 'haikyuu' },
          { label: 'Kuroko no Basket', value: 'kuroko_no_basket' },
          { label: 'Slam Dunk', value: 'slam_dunk' },
          { label: 'Akira', value: 'akira' },
          { label: 'Ghost in the Shell', value: 'ghost_in_the_shell' },
        ],
      },
      {
        name: 'favorite_studios',
        type: 'checkbox',
        placeholder: 'Favorite Studios',
        options: [
          { label: 'Studio Ghibli', value: 'studio_ghibli' },
          { label: 'Studio Pierrot', value: 'studio_pierrot' },
          { label: 'Studio Deen', value: 'studio_deen' },
          { label: 'Studio Bones', value: 'studio_bones' },
          { label: 'Studio Madhouse', value: 'studio_madhouse' },
          { label: 'Studio ufotable', value: 'studio_ufotable' },
          { label: 'Toei Animation', value: 'toei_animation' },
          { label: 'Mappa', value: 'mappa' },
          { label: 'Wit Studio', value: 'wit_studio' },
          { label: 'A-1 Pictures', value: 'a1_pictures' },
          { label: 'Trigger', value: 'trigger' },
          { label: 'Kyoto Animation', value: 'kyoto_animation' },
          { label: 'Production I.G', value: 'production_ig' },
          { label: 'Cloverworks', value: 'cloverworks' },
          { label: 'Gainax', value: 'gainax' },
          { label: 'Sunrise', value: 'sunrise' },
        ],
      },
      {
        name: 'favorite_genres',
        type: 'checkbox',
        placeholder: 'Favorite Genres',
        options: [
          { label: 'Action', value: 'action' },
          { label: 'Adventure', value: 'adventure' },
          { label: 'Comedy', value: 'comedy' },
          { label: 'Drama', value: 'drama' },
          { label: 'Fantasy', value: 'fantasy' },
          { label: 'Horror', value: 'horror' },
          { label: 'Mystery', value: 'mystery' },
          { label: 'Romance', value: 'romance' },
          { label: 'Sci-Fi', value: 'sci-fi' },
          { label: 'Slice of Life', value: 'slice_of_life' },
          { label: 'Sports', value: 'sports' },
          { label: 'Supernatural', value: 'supernatural' },
          { label: 'Thriller', value: 'thriller' },
          { label: 'Mecha', value: 'mecha' },
          { label: 'Psychological', value: 'psychological' },
          { label: 'Historical', value: 'historical' },
          { label: 'School', value: 'school' },
          { label: 'Military', value: 'military' },
          { label: 'Music', value: 'music' },
          { label: 'Ecchi', value: 'ecchi' },
          { label: 'Harem', value: 'harem' },
          { label: 'Isekai', value: 'isekai' },
          { label: 'Yaoi', value: 'yaoi' },
          { label: 'Yuri', value: 'yuri' },
        ],
      },
    ],
  },
]

const stepsSignIn: {
  id: number
  title: string
  description: string
  fields: { name: string; type: string; placeholder: string }[]
}[] = [
  {
    id: 1,
    title: 'Sign in to your account',
    description: 'Enter your email and password to sign in',
    fields: [
      {
        name: 'email',
        type: 'email',
        placeholder: 'Email',
      },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password',
      },
    ],
  },
]
export const StepsComponent = (isSignUp: boolean) => {
  const { currentStep, setCurrentStep, setSteps } = useStepsStore()
  const steps = isSignUp ? stepsSignUp : stepsSignIn
  useEffect(() => {
    setSteps(steps)
  }, [steps])
  return steps.map((step, index) => (
    <div
      key={step.id}
      className={`relative ${!isSignUp ? 'hidden' : ''} flex h-36 w-full flex-col justify-end rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 ${currentStep === step.id ? 'bg-enfasisColor/40' : 'bg-black/50'}`}
    >
      <span
        className={`text-Primary-50 bg-Primary-200/30 absolute top-4 left-4 z-10 flex h-6 w-6 items-center justify-center rounded-full p-2 text-sm backdrop-blur-2xl ${currentStep === step.id ? 'bg-enfasisColor' : ''}`}
      >
        {step.id}
      </span>
      <h5 className="w-full text-sm font-bold">{step.title}</h5>
    </div>
  ))
}
