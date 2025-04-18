# 🌸 AniDev

AniDev is a modern anime streaming and exploration platform built with AstroJS and powered by Supabase. It offers dynamic experiences for discovering, searching, and enjoying top animes, all with smooth transitions and responsive design.

## 🚀 Key Features

- 🎨 **Modern Design**: Responsive and smooth transitions using `astro:transitions`.
- 🧬 **Reusable Components**: Includes NavBar, Footer, AnimeCard, AnimeTag, CategoryMenu, etc.
- 🔍 **Dynamic Search**: Uses `useDebounce` for optimized queries and fast search with advanced filtering.
- 📦 **Efficient Backend**: Integrated with Supabase, with optimized RPC functions.
- 🎥 **Video Playback**: Featuring high-quality anime streaming with Video.js.
- 🌟 **Advanced Filtering**: Search animes by genres, studios, ratings, year, season, etc.
- 💾 **Performance Optimization**: Redis caching for faster API responses.
- 📄 **Unit Testing**: Uses Vitest for testing API endpoints and components.
- 🔐 **Authentication**: Secure user authentication with Supabase Auth.
- 📱 **Responsive UI**: TailwindCSS for beautiful and responsive layouts.
- 🎯 **Code Quality**: Biome for linting and formatting.

---

## 📂 Project Structure

```plaintext
/
├── 🗁 src/
│   ├── components/     # Reusable UI components
│   │   ├── anime-info/    # Anime details components
│   │   ├── auth/          # Authentication components
│   │   ├── buttons/       # Button components
│   │   ├── collection/    # Collection-related components
│   │   ├── icons/         # Icon components
│   │   ├── index/         # Homepage components
│   │   ├── nav-bar/       # Navigation components
│   │   ├── profile/       # User profile components
│   │   ├── search/        # Search-related components
│   │   └── watch-anime/   # Video player components
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Base page layouts
│   ├── libs/          # External integrations (Supabase, Redis)
│   ├── pages/         # Application routes/pages
│   │   └── api/       # API endpoints
│   ├── scripts/       # Utility scripts
│   ├── store/         # State management with Zustand
│   ├── styles/        # Global styles and themes
│   ├── test/          # Test files and utilities
│   │   ├── api-tests/     # API endpoint tests
│   │   └── component-tests/ # Component tests
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Helper functions and utilities
├── 🗁 public/         # Static assets
├── 🗁 .github/        # GitHub workflows and configs
├── 🗁 .vscode/        # VS Code specific settings
├── 🗁 .astro/         # Astro build output
└── 🗁 node_modules/   # Project dependencies
```

---

## 📄 Hooks Usage

### 🔄 `useFetch`

This hook simplifies making asynchronous requests with automatic loading and error handling.

```typescript
import { useFetch } from '@hooks/useFetch'

const { data, error, loading } = useFetch<Anime[]>({
  url: '/api/animes/full?type_filter=tv',
})
```

### 🕒 `useDebounce`

Optimizes performance by delaying the execution of a function, perfect for search inputs.

```typescript
import { useDebounce } from '@hooks/useDebounce'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)
```

---

## 🖥️ API Endpoints

AniDev provides various API endpoints for fetching anime data:

### Anime Endpoints

- `/api/animes/full` - Get animes with filtering options
- `/api/getAnime` - Get detailed information about a specific anime
- `/api/getAnimeMetadatas` - Get SEO metadata for an anime
- `/api/episodes` - Get episodes list for an anime
- `/api/getEpisode` - Get specific episode details
- `/api/studios` - Get anime studios information

### Media Endpoints

- `/api/videoProxy` - Proxy for streaming video content
- `/api/proxy` - Image proxy with optimization (resize, quality, format)
- `/api/uploadImage` - Upload and optimize images (requires authentication)
- `/api/saveImage` - Save user avatar images (requires authentication)

### Authentication Endpoints

- `/api/auth/signup` - Register a new user
- `/api/auth/signin` - Login an existing user
- `/api/auth/signout` - Logout the current user
- `/api/auth/callback` - OAuth callback handling

Each endpoint supports various query parameters for filtering, sorting, and pagination.

## 🔧 Middlewares

AniDev implements several middleware functions to enhance API security and functionality:

### Rate Limiting

```typescript
import { rateLimit } from '@middlewares/rate-limit'

export const GET = rateLimit(
  async (context) => {
    // Your API handler here
  },
  { points: 100, duration: 60 }
)
```

- Prevents API abuse by limiting request rates
- Configurable points and duration
- Returns 429 status with Retry-After header when limit is exceeded
- Includes rate limit headers in responses

### Authentication Check

```typescript
import { checkSession } from '@middlewares/auth'

export const POST = checkSession(async (context) => {
  // Your protected API handler here
})
```

- Verifies user session before allowing access
- Returns 401 status for unauthorized requests
- Automatically adds session to context

---

## 🛠️ Tech Stack

- [AstroJS](https://astro.build/) - Web Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [React](https://react.dev/) - UI Library
- [Supabase](https://supabase.com/) - Backend and Database
- [Redis](https://redis.io/) - Caching Layer
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Video.js](https://videojs.com/) - Video Player
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Vitest](https://vitest.dev/) - Testing Framework
- [Biome](https://biomejs.dev/) - Code Formatting and Linting
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/ani-dev.git
cd AniDev
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

4. **Start the development server**

```bash
pnpm dev
```

Visit `http://localhost:4321` to see your application running.

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome

---

## 🌐 Main Routes

- `/` - Homepage showcasing the most relevant animes
- `/search` - Search animes by genres, studios, year, season, and more
- `/:slug` - Anime details with trailer, genres, and ratings
- `/watch/:id` - Watch anime episodes with video player
- `/profile` - User profile page
- `/collection` - User's anime collection

---

## 🔐 Authentication

AniDev uses Supabase Authentication with the PKCE flow for secure user authentication. The following endpoints are available:

- `/api/auth/signup` - Register a new user
- `/api/auth/signin` - Login an existing user
- `/api/auth/signout` - Logout the current user
- `/api/auth/callback` - OAuth callback handling

---

## 🎮 User Features

- **Watch History**: Keep track of watched episodes
- **Collections**: Create and manage anime collections
- **Profiles**: Customize user profiles
- **Preferences**: Set viewing preferences

---

## 🧪 Testing

AniDev includes a comprehensive test suite for both API endpoints and components:

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test src/test/api-tests/animes.test.ts
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Thanks to all the tools and libraries that made this project possible. 💖
