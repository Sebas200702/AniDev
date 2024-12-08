# 🌸 Animeflix

Animeflix es una plataforma moderna de streaming y exploración de animes, diseñada con AstroJS y potenciada por Supabase. Ofrece una experiencia dinámica para descubrir, buscar y disfrutar de los mejores animes, con un diseño responsivo y transiciones suaves.

## 🚀 Características principales

- 🎨 **Diseño moderno** con transiciones fluidas usando `astro:transitions`.
- 🧩 **Componentes reutilizables**: NavBar, Footer, AnimeCard, AnimeTag, entre otros.
- 🔍 **Búsqueda dinámica** con `useDebounce` para optimizar consultas.
- 📦 **Backend eficiente**: Integrado con Supabase y funciones RPC para filtrar animes.
- 📽️ **Reproducción de trailers** con el componente `<youtube-video>`.
- 🌟 **Filtrado avanzado**: Géneros, estudios, puntajes, y más.

---

## 📂 Estructura del proyecto

```plaintext
├── 📁 components/       # Componentes reutilizables (NavBar, Footer, AnimeCard, AnimeTag)
├── 📁 layouts/          # Layouts base para la aplicación
├── 📁 hooks/            # Hooks personalizados: useDebounce, useFetch
├── 📁 pages/            # Páginas principales (Home, Search, Anime Details)
├── 📁 utils/            # Utilidades (helpers y configuraciones)
├── 📁 public/           # Archivos estáticos (favicon, imágenes)
├── 📁 libs/             # Configuración de Supabase
└── 📁 types/            # Definición de tipos TypeScript
```

---

## 📄 Uso de Hooks

### 🔄 `useFetch`

Este hook permite realizar peticiones asíncronas de forma sencilla.

```typescript
import { useFetch } from '@hooks/useFetch'

const { data, error, loading } = useFetch<Anime[]>({
  url: 'https://api.animeflix.com/animes?type=tv',
})
```

### 🕒 `useDebounce`

Optimiza el rendimiento al retrasar la ejecución de una función.

```typescript
import { useDebounce } from '@hooks/useDebounce'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)
```

---

## 🛠️ Configuración del entorno

Asegúrate de tener configuradas las siguientes variables de entorno:

```plaintext
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_de_supabase
```

Crea un archivo `.env` en la raíz del proyecto y agrega las claves correspondientes.

---

## 🧑‍💻 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/animeflix.git
cd animeflix
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Iniciar el servidor

```bash
npm run dev
```

---

## 🌐 Rutas principales

- `/` - Página de inicio con los animes más relevantes.
- `/search` - Búsqueda de animes por géneros, estudios, y más.
- `/anime/:slug` - Detalle de un anime con trailer y géneros.

---

## 🖼️ Capturas de pantalla

### 🌟 Página principal

![Página Principal](https://via.placeholder.com/800x400?text=Página+Principal)

### 🔍 Búsqueda de animes

![Búsqueda de Animes](https://via.placeholder.com/800x400?text=Búsqueda+de+Animes)

---

## 💻 Tecnologías utilizadas

- [AstroJS](https://astro.build/) 🌟
- [Supabase](https://supabase.com/) 🐘
- [YouTube Video Element](https://github.com/justinribeiro/youtube-video-element) 🎥
- [TypeScript](https://www.typescriptlang.org/) 🛡️
- [CSS Modules](https://github.com/css-modules/css-modules) 🎨

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas, problemas o mejoras, no dudes en abrir un [issue](https://github.com/tu-usuario/animeflix/issues) o enviar un [pull request](https://github.com/tu-usuario/animeflix/pulls).

---

## 📜 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 🙌 Agradecimientos

Gracias a todas las herramientas y librerías que hicieron este proyecto posible. 💖

```

```
