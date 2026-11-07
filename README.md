# NewsHub 🗞️
### Real-Time Curated Global Journalism & Intelligence

<div align="center">
  <img src="public/favicon.svg" alt="NewsHub Logo" width="80" />
  <br />
  <h3><i>"Informed Perspectives. Modern Editorial Velocity."</i></h3>

  <p>
    <a href="https://kanishk-upadhyay.github.io/news/">
      <img src="https://img.shields.io/badge/Live_Demo-GitHub_Pages-22c55e?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo" />
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    </a>
    <a href="https://vite.dev/">
      <img src="https://img.shields.io/badge/Vite-Lightning_Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
    </a>
    <a href="https://open-platform.theguardian.com/">
      <img src="https://img.shields.io/badge/API-The_Guardian-052962?style=for-the-badge" alt="The Guardian API" />
    </a>
  </p>
</div>

---

### 🌐 Overview
**NewsHub** is a modern editorial news application built to deliver real-time global news with the visual gravitas of world-class publications (*The New York Times*, *The Verge*, *The Guardian*). 

Engineered with React 19, Vite, and Tailwind CSS v4, it transforms flat news feeds into an asymmetrical editorial front-page featuring lead stories, live breaking tickers, omni-search, in-app quick reading with speech synthesis, and offline-persistent bookmarks.

---

### ✨ Core Features

* **📰 Asymmetrical Editorial Front-Page**: Visual hierarchy featuring a dominant Lead Story Hero, secondary highlight cards, and a compact wire stream instead of repetitive grids.
* **⚡ Live Breaking Ticker**: Top marquee streaming real-time headlines with pause-on-hover interaction.
* **🔍 Instant Omni-Search**: Debounced keyword search (`q`) across global headlines with quick-topic pills and keyboard trigger (`⌘K` or `/`).
* **📖 In-App Quick Reader**: Full-screen slide-over drawer to read summaries, bylines, and excerpts without bouncing off-site. Includes native **Text-to-Speech (TTS)** voice read-aloud and font size scaling.
* **🔖 Bookmarks & Read Later**: One-tap bookmarking backed by `localStorage` for offline reading and curated personal archives.
* **🌓 True Dual Theme**: Rich obsidian dark mode (`#0B0F17`) paired with warm editorial paper light mode (`#FAFAF9`), with automatic system synchronization.
* **🛡️ 429 Resilience & Caching**: Smart 5-minute client-side `sessionStorage` caching layer to prevent API quota exhaustion on high-frequency navigation.
* **📱 Responsive & Accessible**: Fluid layouts spanning mobile phones, tablets, and widescreen displays with full keyboard navigation and ARIA landmarks.

---

### 🏗️ Architecture & Data Flow

```text
[ Guardian Open API ]
         │
         ▼
[ NewsApi Client ] ──► [ 5-Min Memory / Session Cache ] 
                              │ (hit / miss)
                              ▼
                   [ React 19 App State ]
                    ├── ThemeContext (Dark / Light)
                    ├── BookmarksContext (LocalStorage)
                    └── ReaderContext (TTS & Modal)
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   [ Hero Lead ]       [ News Grid / List ]    [ Reader Drawer ]
```

---

### 📂 Project Structure

```text
news/
├── public/
│   ├── favicon.svg          # Bespoke vector newspaper icon
│   └── manifest.json        # Web App Manifest for PWA installation
├── src/
│   ├── api/
│   │   └── NewsApi.js       # Guardian API client with caching & fallbacks
│   ├── components/
│   │   ├── BreakingTicker.jsx # Marquee breaking news ticker
│   │   ├── HeroCard.jsx     # High-impact lead story card
│   │   ├── Navbar.jsx       # Masthead, search trigger, theme toggle & pills
│   │   ├── NewsCard.jsx     # Modular card supporting Magazine & Digest views
│   │   ├── ReaderDrawer.jsx # In-app reading drawer with TTS & text sizing
│   │   ├── SearchModal.jsx  # Global instant search modal
│   │   └── SkeletonCard.jsx # Editorial loading shimmer skeletons
│   ├── constants/
│   │   └── index.js         # Categories, configuration, and defaults
│   ├── context/
│   │   ├── AppContext.jsx   # Theme, bookmarks, and reader global state
│   ├── pages/
│   │   ├── Bookmarks.jsx    # Saved articles library
│   │   └── NewsFeed.jsx     # Asymmetric editorial front page
│   ├── utils/
│   │   ├── textUtils.js     # HTML entities decoding, date & read-time utils
│   │   └── styles.js        # Design tokens and Tailwind utility classes
│   ├── App.jsx              # HashRouter and context providers
│   ├── index.css            # Tailwind v4, editorial fonts, and color tokens
│   └── main.jsx             # React 19 root
├── .github/
│   └── workflows/
│       └── deploy.yml       # Automated GitHub Pages CI/CD deployment
├── index.html               # SEO metadata, Open Graph, and Google Fonts
├── vite.config.js           # Vite configuration with Tailwind v4 plugin
└── package.json
```

---

### 🚀 Getting Started

#### Prerequisites
* **Node.js** >= 18.x
* **npm** >= 9.x

#### 1. Clone the repository
```bash
git clone https://github.com/kanishk-upadhyay/news.git
cd news
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure API Key (Optional)
The application includes a public developer tier key by default. For higher rate limits, get your free key from [The Guardian Open Platform](https://open-platform.theguardian.com/access/) and create a `.env` file:
```env
VITE_GUARDIAN_API_KEY=your_guardian_api_key_here
```

#### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/news/`.

#### 5. Build for Production
```bash
npm run build
```

---

### 📜 License
MIT License © [Kanishk Upadhyay](https://github.com/kanishk-upadhyay)
