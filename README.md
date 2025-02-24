# 🌸 AniDev

AniDev is a modern anime streaming and exploration platform built with AstroJS and powered by Supabase. It offers dynamic experiences for discovering, searching, and enjoying top animes, all with smooth transitions and responsive design.

## 🚀 Key Features

- 🎨 **Modern Design**: Responsive and smooth transitions using `astro:transitions`.
- 🧬 **Reusable Components**: Includes NavBar, Footer, AnimeCard, AnimeTag, etc.
- 🔍 **Dynamic Search**: Uses `useDebounce` for optimized queries and fast search.
- 📦 **Efficient Backend**: Integrated with Supabase, with optimized RPC functions.
- 🎥 **Trailer Playback**: Featuring trailers in the `<youtube-video>` component.
- 🌟 **Advanced Filtering**: Search animes by genres, studios, ratings, etc.
- 📄 **Unit Testing**: Uses Vitest for testing components and functions.

---

## 📂 Project Structure

```plaintext
├── 🗁 components/       # Reusable components (NavBar, Footer, AnimeCard, AnimeTag, etc.)
├── 🗁 layouts/          # Base layouts for the application
├── 🗁 hooks/            # Custom hooks: useDebounce, useFetch
├── 🗁 pages/            # Main pages (Home, Search, Anime Details, 404)
├── 🗁 utils/            # Utilities (helpers and configurations)
├── 🗁 public/           # Static files (favicon, images)
├── 🗁 libs/             # Supabase configuration and helpers
└── 🗁 test/             # Unit tests and testing utilities
```

---

## 📄 Hooks Usage

### 🔄 `useFetch`

This hook simplifies making asynchronous requests. It can also be used to fetch data from external APIs.

```typescript
import { useFetch } from '@hooks/useFetch'

const { data, error, loading } = useFetch<Anime[]>({
  url: 'https://api.ani-dev.com/animes?type=tv',
})
```

### 🕒 `useDebounce`

Optimizes performance by delaying the execution of a function.

```typescript
import { useDebounce } from '@hooks/useDebounce'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)
```

---

## 🛠️ Environment Setup

Ensure the following environment variables are set up:

```plaintext
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

Create a `.env` file at the root of the project and add the appropriate keys.

---

## 👨‍💻 Installation and Execution

### 1⃣ Clone the repository

```bash
git clone https://github.com/your-username/ani-dev.git
cd AniDev
```

### 2⃣ Install dependencies

```bash
npm install
```

### 3⃣ Start the server

```bash
npm run dev
```

---

## 🌐 Main Routes

- `/` - Homepage showcasing the most relevant animes.
- `/search` - Search animes by genres, studios, and more.
- `/:slug` - Anime details with trailer, genres, and ratings.

---

## 🖼️ Screenshots

### 🌟 Homepage

![Homepage](https://via.placeholder.com/800x400?text=Homepage)

### 🔍 Anime Search

![Anime Search](https://via.placeholder.com/800x400?text=Anime+Search)

---

## 💻 Technologies Used

- [AstroJS](https://astro.build/) 🌟
- [Supabase](https://supabase.com/) 🐘
- [YouTube Video Element](https://github.com/justinribeiro/youtube-video-element) 🎥
- [TypeScript](https://www.typescriptlang.org/) 🛡️
- [CSS Modules](https://github.com/css-modules/css-modules) 🎨

---

## 🤝 Contributions

Contributions are welcome! If you have ideas, issues, or improvements, feel free to open an [issue](https://github.com/your-username/ani-dev/issues) or submit a [pull request](https://github.com/your-username/ani-dev/pulls).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Thanks to all the tools and libraries that made this project possible. 💖
