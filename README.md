# 🌸 AniDev

AniDev is a modern anime streaming and exploration platform built with AstroJS and powered by Supabase. It offers dynamic experiences for discovering, searching, and enjoying top animes, all with smooth transitions and responsive design.

## 🚀 Key Features

- 🎨 **Modern Design**: Responsive and smooth transitions using `astro:transitions`.
- 🧬 **Reusable Components**: Includes NavBar, Footer, AnimeCard, AnimeTag, CategoryMenu, SearchBar, Sidebar, etc.
- 🔍 **Dynamic Search**: Uses `useDebounce` for optimized queries and fast search with advanced filtering.
- 📦 **Efficient Backend**: Integrated with Supabase, with optimized RPC functions.
- 🎥 **Video Playback**: Featuring high-quality anime streaming with Video.js.
- 🌟 **Advanced Filtering**: Search animes by genres, studios, ratings, year, season, etc.
- 💾 **Performance Optimization**: Redis caching for faster API responses.
- 📄 **Unit Testing**: Uses Vitest for testing API endpoints and components.
- 🔐 **Authentication**: Secure user authentication with Supabase Auth.
- 📱 **Responsive UI**: TailwindCSS for beautiful and responsive layouts.
- 🎯 **Code Quality**: Biome and Prettier for linting and formatting.
- 📅 **Schedule System**: Track and manage anime release schedules.
- 🔄 **Progress Tracking**: Monitor your anime watching progress.
- 🖼️ **Image Optimization**: Advanced image handling with Picture component.
- 🛡️ **Error Handling**: Robust error boundary implementation.
- 📊 **User Preferences**: Personalized user experience settings.

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
│   │   ├── schedule/      # Schedule management components
│   │   ├── search/        # Search-related components
│   │   └── watch-anime/   # Video player components
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Base page layouts
│   ├── libs/          # External integrations (Supabase, Redis)
│   ├── middlewares/   # API and route middlewares
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

### 🎨 `useDynamicBorder`

Creates an interactive dynamic border effect that follows mouse movement, perfect for hover effects.

```typescript
import { useDynamicBorder } from '@hooks/useDynamicBorder'

const { elementRef, handleMouseMove, handleMouseLeave, handleMouseEnter } = useDynamicBorder({
  borderWidth: 2,
  normalOpacity: 0.4,
  hoverOpacity: 0.9
})
```

### 🎮 `useShortcuts`

Manages keyboard shortcuts with support for key combinations.

```typescript
import { useShortcuts } from '@hooks/useShortcuts'

useShortcuts(
  [{ keys: ['ctrl', 's'], action: 'save' }],
  { save: () => handleSave() }
)
```

### 🎠 `useCarouselScroll`

Handles smooth scrolling behavior for carousel components.

```typescript
import { useCarouselScroll } from '@hooks/useCarouselScroll'

const { scrollRef, handleScroll } = useCarouselScroll()
```

### 🔄 `useUrlSync`

Synchronizes component state with URL parameters.

```typescript
import { useUrlSync } from '@hooks/useUrlSync'

const { params, updateParams } = useUrlSync(['page', 'filter'])
```

### 🖱️ `useDragAndDrop`

Implements drag and drop functionality for interactive elements.

```typescript
import { useDragAndDrop } from '@hooks/useDragAndDrop'

const { dragRef, isDragging } = useDragAndDrop({
  onDrop: (data) => handleDrop(data)
})
```

---

## 🖥️ API Endpoints

AniDev provides various API endpoints for fetching anime data:

### Anime Endpoints

- `/api/animes/full` - Get animes with filtering options
- `/api/animes/random` - Get a random anime
- `/api/animes` - Get anime list with pagination
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

### User Preferences

- `/api/saveUserPreferences` - Save user preferences and settings

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

### Core Technologies
- [AstroJS](https://astro.build/) v5.7.8 - Web Framework
- [TypeScript](https://www.typescriptlang.org/) v5.7.2 - Programming Language
- [React](https://react.dev/) v19.0.0 - UI Library
- [TailwindCSS](https://tailwindcss.com/) v4.0.14 - CSS Framework

### Backend & Database
- [Supabase](https://supabase.com/) v2.46.1 - Backend and Database
- [Redis](https://redis.io/) v4.7.0 - Caching Layer
- [Node Fetch](https://github.com/node-fetch/node-fetch) v3.3.2 - HTTP Client

### State Management & Forms
- [Zustand](https://zustand-demo.pmnd.rs/) v5.0.2 - State Management
- [React Hook Form](https://react-hook-form.com/) v7.54.2 - Form Management
- [Zod](https://zod.dev/) v3.24.2 - Schema Validation

### Media & UI Components
- [Video.js](https://videojs.com/) v8.21.0 - Video Player
- [CropperJS](https://github.com/fengyuanchen/cropperjs) v2.0.0 - Image Cropping
- [Sharp](https://sharp.pixelplumbing.com/) v0.33.5 - Image Processing
- [Pheralb Toast](https://github.com/pheralb/toast) v1.0.0 - Toast Notifications

### Authentication & Security
- [Auth.js](https://authjs.dev/) v4.2.0 - Authentication
- [Rate Limiter Flexible](https://github.com/animir/node-rate-limiter-flexible) v6.1.0 - Rate Limiting

### Development Tools
- [Vitest](https://vitest.dev/) v2.1.9 - Testing Framework
- [Biome](https://biomejs.dev/) v1.9.4 - Code Formatting and Linting
- [Prettier](https://prettier.io/) v3.5.3 - Code Formatting
- [Vercel](https://vercel.com/) - Deployment Platform

### Additional Features
- [Sitemap](https://github.com/astrojs/astro/tree/main/packages/integrations/sitemap) v3.3.1 - SEO Optimization
- [Pinata](https://www.pinata.cloud/) v2.1.3 - IPFS Integration
- [Lite YouTube](https://github.com/justinribeiro/lite-youtube) v1.7.1 - YouTube Embedding

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

### Public Routes
- `/` - Homepage showcasing the most relevant animes
- `/search` - Advanced search page with multiple filter options
- `/schedule` - Calendar view of upcoming anime releases
- `/404` - Custom error page for not found routes

### Authentication Routes
- `/signin` - User login page
- `/signup` - User registration page

### Dynamic Routes
- `/anime/[slug]` - Anime details page with:
  - Trailer and video information
  - Genres and ratings
  - Episode list
  - Related animes
  - User reviews and comments

- `/watch/[slug]` - Video player page with:
  - High-quality video streaming
  - Episode navigation
  - Progress tracking
  - Quality selection
  - Subtitle options

- `/collection/[slug]` - User collection page with:
  - Personal anime lists
  - Collection management
  - Progress tracking
  - List customization

### User Routes
- `/profile` - User profile page with:
  - Profile customization
  - Avatar management
  - User preferences
  - Watch history
  - Collection overview

### API Routes
- `/api/animes` - Anime data endpoints
- `/api/auth` - Authentication endpoints
- `/api/episodes` - Episode management
- `/api/studios` - Studio information
- `/api/videoProxy` - Video streaming proxy
- `/api/proxy` - Image optimization proxy
- `/api/uploadImage` - Image upload handling
- `/api/saveImage` - Image saving functionality
- `/api/saveUserPreferences` - User preferences management

Each route supports dynamic parameters and query strings for filtering and customization.

---

## 🔐 Authentication

AniDev uses Supabase Authentication with the PKCE flow for secure user authentication. The following endpoints are available:

- `/api/auth/signup` - Register a new user
- `/api/auth/signin` - Login an existing user
- `/api/auth/signout` - Logout the current user
- `/api/auth/callback` - OAuth callback handling

---

## 🎮 User Features

### Profile Management
- **Personal Profile**: Customize your profile with avatar and username
  ```typescript
  // Example of profile customization
  const { userInfo, setUserInfo } = useGlobalUserPreferences()
  ```
- **Image Upload**: Drag and drop interface for profile pictures with cropping capabilities
  ```typescript
  const { isDragging, dragDropProps } = useDragAndDrop({
    onDrop: (file) => handleImageUpload(file)
  })
  ```

### Anime Collections
- **Multiple Lists**: Organize animes into different categories
  - Collection: Your main anime collection
  - Completed: Track finished animes
  - To Watch: Plan your next watches
  - Watching: Currently watching animes
  ```typescript
  const { userList } = useUserListsStore()
  // userList = [
  //   { label: 'Collection', icon: CollectionIcon, selected: true },
  //   { label: 'Completed', icon: CompletedIcon, selected: false },
  //   { label: 'To Watch', icon: ToWatchIcon, selected: false },
  //   { label: 'Watching', icon: WatchingIcon, selected: false }
  // ]
  ```

### Watch History & Progress
- **Progress Tracking**: Monitor your watching progress with visual indicators
  ```typescript
  <ProgressBar progress={currentProgress} />
  ```
- **Schedule System**: Track upcoming anime releases with a calendar view
  ```typescript
  <CalendarShowBox />
  ```

### User Preferences
- **Theme Customization**: Personalize your experience with custom accent colors
  ```typescript
  const { enfasis, setEnfasis } = useGlobalUserPreferences()
  // Change accent color
  setEnfasis('#FF5733')
  ```
- **Parental Control**: Toggle content filtering for family-friendly viewing
  ```typescript
  const { parentalControl, setParentalControl } = useGlobalUserPreferences()
  // Enable/disable parental control
  setParentalControl(true)
  ```

### Search & Discovery
- **Advanced Search**: Find animes with multiple filter options
  - Genre filtering
  - Year selection
  - Status filtering
  - Studio selection
  - Rating filtering
  ```typescript
  const { appliedFilters, setAppliedFilters } = useSearchStoreResults()
  // Apply filters
  setAppliedFilters({
    genre_filter: ['action', 'adventure'],
    year_filter: ['2023'],
    status_filter: ['currently_airing']
  })
  ```
- **Search History**: Keep track of your recent searches
  ```typescript
  const { addSearchHistory } = useSearchStoreResults()
  ```

### Responsive Design
- **Adaptive Layout**: Optimized viewing experience across all devices
  ```typescript
  const { width } = useWindowWidth()
  const isMobile = width && width < 768
  ```
- **Dynamic UI**: Smooth transitions and animations for better user experience
  ```typescript
  <ClientRouter>
    {/* Your routes here */}
  </ClientRouter>
  ```

### Notifications
- **Toast Messages**: Get feedback on your actions
  ```typescript
  toast[ToastType.Success]({
    text: 'Action completed successfully',
    options: {
      autoDismiss: true
    }
  })
  ```

---

## 🧪 Testing

AniDev includes a comprehensive test suite for both API endpoints and components:

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test src/test/api-tests/animes.test.ts
```

## 🔒 Security Features

### Content Security Policy
```typescript
// Strict CSP implementation in base layout
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    connect-src 'self' data:;
    script-src 'self' 'unsafe-inline';
    frame-src 'self' https://www.youtube.com/;
    style-src 'self' 'unsafe-inline';
    font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
    img-src 'self' data: https://i.ytimg.com https://cdn.myanimelist.net https://coffee-advanced-tern-335.mypinata.cloud;
    worker-src 'self' blob:;
  "
/>
```

### Security Headers
```typescript
// Security headers configuration in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🚀 Performance Optimizations

### Multi-level Caching Strategy
- **Redis Caching**: Server-side caching with configurable TTL
  ```typescript
  await redis.set(
    `image-${url.searchParams.toString()}`,
    JSON.stringify(optimizedBuffer),
    { EX: 31536000 } // 1 year TTL
  )
  ```
- **CDN Caching**: Edge caching for static assets
- **Browser Caching**: Client-side caching with appropriate headers

### Image Optimization
- **Dynamic Resizing**: On-the-fly image resizing
- **Format Conversion**: WebP and AVIF support
- **Quality Adjustment**: Configurable compression
  ```typescript
  image = format === 'avif'
    ? image.avif({ quality })
    : image.webp({ quality })
  ```

### API Performance
- **Rate Limiting**: Prevents API abuse
  ```typescript
  const limiter = new RateLimiterMemory({
    points: options.points ?? 100,
    duration: options.duration ?? 60,
  })
  ```
- **Request Batching**: Optimized data fetching
- **Response Compression**: Reduced payload size

## 🛠️ Development Practices

### Code Quality
- **Biome Integration**: Advanced linting and formatting
  ```json
  {
    "linter": {
      "rules": {
        "a11y": {
          "noAccessKey": "error",
          "noAriaUnsupportedElements": "error",
          // ... more accessibility rules
        },
        "correctness": {
          "noChildrenProp": "error",
          "useJsxKeyInIterable": "error"
        },
        "security": {
          "noDangerouslySetInnerHtmlWithChildren": "error"
        }
      }
    }
  }
  ```

### Testing Strategy
- **Unit Testing**: Component and API testing with Vitest
- **Integration Testing**: End-to-end functionality testing
- **Performance Testing**: Load and stress testing

### Documentation
- **JSDoc Comments**: Comprehensive API documentation
- **Type Definitions**: Strong TypeScript typing
- **Code Examples**: Usage examples for components and hooks

### Error Handling
- **API Error Responses**: Standardized error format
- **User Feedback**: Toast notifications for errors

## 📦 Deployment

### Vercel Configuration
- **Edge Functions**: Serverless API endpoints
- **Static Optimization**: Automatic static optimization
- **Environment Variables**: Secure configuration management

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Thanks to all the tools and libraries that made this project possible. 💖
