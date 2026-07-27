# CodeArena 🏆

> **The all-in-one coding interview platform** — Practice problems, visualize algorithms, get AI coaching, and track your progress on the journey to your dream job.

[![GitHub](https://img.shields.io/badge/GitHub-AiCodingPlatform-181717?style=for-the-badge&logo=github)](https://github.com/Abhijeet-dev-05/AiCodingPlatform)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Pages](#frontend-pages)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CodeArena is a full-stack, production-ready coding practice platform built with React 19 and Node.js/Express. It combines interactive problem solving, algorithm visualization, AI-powered interviews, spaced repetition learning, and career guidance into a single cohesive dark-themed application.

---

## Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     React 19 SPA (Vite)                         │   │
│   │                                                                 │   │
│   │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │   │
│   │  │  Pages   │  │Visualizer│  │  Redux    │  │  Design      │  │   │
│   │  │ (Router) │  │  Pages   │  │  Store    │  │  System      │  │   │
│   │  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────────────┘  │   │
│   │       └─────────────┴──────────────┘                           │   │
│   │                     │ Axios (HTTP + Cookies)                    │   │
│   └─────────────────────┼───────────────────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │ REST API  /  CORS
┌─────────────────────────▼───────────────────────────────────────────────┐
│                      NODE.JS / EXPRESS SERVER                            │
│                                                                          │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐    │
│  │  Middleware  │   │    Routes    │   │      Controllers          │    │
│  │              │   │              │   │                           │    │
│  │ • JWT Auth   │   │ /user        │   │ userAuth.js               │    │
│  │ • CORS       │   │ /problem     │   │ problemCreator.js         │    │
│  │ • Cookie     │   │ /submission  │   │ submit.js                 │    │
│  │ • Multer     │   │ /ai          │   │ aiChatting.js             │    │
│  │ • Redis      │   │ /career      │   │ careerRoutes.js           │    │
│  │   blocklist  │   │ /interview   │   │ interviewRoutes.js        │    │
│  └──────────────┘   │ /interview/  │   │ voiceInterview.js         │    │
│                     │   voice      │   │ adminRoutes.js            │    │
│                     │ /admin       │   │ videoCreator.js           │    │
│                     │ /video       │   │ userDashboard.js          │    │
│                     │ /dashboard   │   │ codeReviewRoutes.js       │    │
│                     │ /code-review │   │ spacedRepetition.js       │    │
│                     │ /review      │   └───────────────────────────┘    │
│                     └──────────────┘                                    │
└──────────┬───────────────────────┬──────────────────┬───────────────────┘
           │                       │                  │
     ┌─────▼──────┐         ┌──────▼──────┐   ┌──────▼────────────────┐
     │  MongoDB   │         │    Redis    │   │   External AI APIs    │
     │  (Atlas)   │         │  (Upstash)  │   │                       │
     │            │         │             │   │ ┌───────────────────┐ │
     │ • Users    │         │ • JWT       │   │ │  Groq API         │ │
     │ • Problems │         │   Blocklist │   │ │  whisper-large-v3 │ │
     │ • Submit-  │         │ • Session   │   │ │  (STT + LLM)      │ │
     │   sions    │         │   Cache     │   │ └───────────────────┘ │
     │ • Reviews  │         └─────────────┘   │ ┌───────────────────┐ │
     └────────────┘                           │ │  Google Gemini    │ │
                                              │ │  (AI problems)    │ │
                                              │ └───────────────────┘ │
                                              │ ┌───────────────────┐ │
                                              │ │  OpenAI           │ │
                                              │ │  (code review +   │ │
                                              │ │   interview eval) │ │
                                              │ └───────────────────┘ │
                                              │ ┌───────────────────┐ │
                                              │ │  Cloudinary       │ │
                                              │ │  (video storage)  │ │
                                              │ └───────────────────┘ │
                                              │ ┌───────────────────┐ │
                                              │ │  Google OAuth2    │ │
                                              │ │  (auth)           │ │
                                              │ └───────────────────┘ │
                                              └───────────────────────┘
```

---

### Request Flow

```
User Action
    │
    ▼
React Component
    │  dispatch(action) or direct call
    ▼
Redux Store / Axios Client
    │  HTTP Request + JWT Cookie
    ▼
Express Router  ──►  userMiddleware (verify JWT, check Redis blocklist)
    │
    ▼
Controller
    ├── MongoDB query   (Mongoose model)
    ├── Redis operation (cache / blocklist)
    └── AI API call     (Groq / Gemini / OpenAI / Cloudinary)
    │
    ▼
JSON Response
    │
    ▼
React Component  ──►  Redux State Update  ──►  UI Re-render
```

---

### Authentication Flow

```
┌──────────┐     POST /user/login      ┌──────────────┐
│  Client  │ ─────────────────────────► │    Server    │
│          │                           │              │
│          │ ◄─ Set-Cookie: token=JWT ─ │  bcrypt      │
│          │                           │  verify pw   │
│          │                           │  sign JWT    │
└──────────┘                           └──────────────┘
     │
     │  Every protected request
     ▼
┌──────────────────────────────────────┐
│           userMiddleware             │
│                                      │
│  1. Extract JWT from cookie          │
│  2. jwt.verify(token, JWT_KEY)       │
│  3. Redis.exists(`token:${token}`)   │ ← blocked (logged out)?
│  4. User.findById(_id)               │
│  5. req.user = user  →  next()       │
└──────────────────────────────────────┘
     │
     ▼
┌──────────┐   POST /user/logout    ┌──────────────────────────────┐
│  Client  │ ──────────────────────► │  Redis.set(`token:${token}`) │
│          │                        │  → token now blocklisted      │
│          │ ◄── clear cookie ───── └──────────────────────────────┘
└──────────┘
```

---

### Voice Interview Flow

```
                    VOICE MODE ON
                          │
          ┌───────────────▼────────────────┐
          │  Browser Web Speech API (TTS)   │
          │  AI reads question aloud        │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  User speaks answer            │
          │  MediaRecorder → WebM Blob     │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  POST /interview/voice/         │
          │  speech-to-text                 │
          │  (multipart/form-data)          │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  Groq Whisper Large V3          │
          │  → transcription text           │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  Transcription shown in UI      │
          │  User reviews + edits           │
          │  User clicks Submit             │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  POST /interview/evaluate       │
          │  AI scores answer (0-10)        │
          │  + feedback + improvement tips  │
          └────────────────────────────────┘
```

---

### DSA Visualizer Architecture

```
VisualizerHome
      │
      ├── SortingCategory ──► BubbleSortViz
      │                  ──► MergeSortViz
      │                  ──► QuickSortViz
      │                  ──► HeapSortViz
      │
      ├── TreesCategory  ──► TreeViz
      ├── GraphsCategory ──► GraphViz
      ├── DPCategory     ──► DPViz
      ├── StacksQueues   ──► StackViz / QueueViz
      ├── Searching      ──► BinarySearchViz / LinearSearchViz
      ├── Strings        ──► StringsViz
      └── Recursion      ──► NQueensViz / SudokuViz / ...

Each Viz Component:
┌──────────────────────────────────────────────────────┐
│  generateXxxSteps(array)  ←── algorithms/sorting.js  │
│       │                                              │
│       ▼                                              │
│  useAnimation(steps)  ←── hooks/useAnimation.js      │
│  { play, pause, stepForward, stepBack,               │
│    goToStep, changeSpeed, currentState }             │
│       │                                              │
│  ┌────▼────────────────────────┐                     │
│  │        Render               │                     │
│  │ ┌─────────────────────────┐ │                     │
│  │ │ ArrayBars (visualization)│ │                     │
│  │ └─────────────────────────┘ │                     │
│  │ ┌─────────────────────────┐ │                     │
│  │ │ AnimationControls       │ │                     │
│  │ └─────────────────────────┘ │                     │
│  │ ┌──────────┐ ┌───────────┐  │                     │
│  │ │CodePanel │ │StatePanel │  │                     │
│  │ └──────────┘ └───────────┘  │                     │
│  │ ┌─────────────────────────┐ │                     │
│  │ │  AskTutorButton →       │ │                     │
│  │ │  GeminiTutorModal       │ │                     │
│  │ └─────────────────────────┘ │                     │
│  └─────────────────────────────┘                     │
└──────────────────────────────────────────────────────┘
```

---

### 🧩 Problem Solving
- Curated coding problems with Easy / Medium / Hard difficulty
- Monaco Editor with multi-language support (JavaScript, Java, C++, Python)
- Real-time code execution and automated test case evaluation
- Submission history with runtime and memory tracking
- Code review with AI-generated hints and feedback

### 📊 Algorithm Visualizer
- **Sorting**: Bubble Sort, Merge Sort, Quick Sort, Heap Sort
- **Trees**: Binary Tree, BST, Heap, Trie traversals
- **Graphs**: BFS, DFS, Dijkstra, Union-Find
- **Dynamic Programming**: Knapsack, LCS, LIS, Matrix DP
- **Stacks & Queues**: Stack, Queue, Monotonic Stack
- **Searching**: Binary Search, Linear Search
- **Strings**: Sliding Window, Two Pointers, KMP
- **Recursion**: N-Queens, Rat in a Maze, Sudoku Solver
- Step-by-step animation controls (play, pause, step forward/back, speed)
- Live code panel with highlighted active line
- AI Tutor modal for algorithm explanations

### 🤖 AI Mock Interview
- AI-generated interview questions across 30+ topics and job roles
- Text + **Voice mode** — AI reads questions aloud (Browser TTS), user answers via microphone
- Voice transcription using **Groq Whisper** (`whisper-large-v3`)
- Real-time answer evaluation with scoring, feedback, and improvement tips
- Session summary with weak topics, grades, and overall advice
- Modes: Quick (5Q), Standard (10Q), Marathon (20Q)
- Difficulties: Beginner, Intermediate, Expert

### 🎓 Career Guidance Chat
- AI-powered career advisor chatbot
- Topics: Resume Review, Interview Prep, Salary Negotiation, Job Search
- Personalized roadmap generation
- Motivational quote engine
- Streaming markdown responses

### 🗺️ Roadmap Generator
- AI-generated personalized learning roadmaps
- Target company + skill gap analysis
- Phase-by-phase learning timeline
- Export and share roadmaps

### 🔁 Spaced Repetition
- Smart review scheduling (forgetting curve algorithm)
- Problems resurface at optimal review intervals
- Track mastery level per problem

### 📈 User Dashboard
- Profile card with level badge and acceptance rate
- Contribution heatmap (GitHub-style, month-divided with gaps)
- Difficulty donut chart + language breakdown
- Solved problems list with tags and timestamps
- Achievements system

### 🛡️ Admin Panel
- Problem creator and editor
- Video editorial uploader (Cloudinary integration)
- User management
- Analytics dashboard — submission stats, leaderboard, activity feed

### 🔐 Authentication
- Email/Password signup with bcrypt hashing
- Google OAuth2 login
- JWT cookie-based sessions
- Redis blocklist for secure logout

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| Vite | 7.2 | Build tool |
| React Router | 7.10 | Client-side routing |
| Redux Toolkit | 2.11 | Global state management |
| Monaco Editor | 0.55 | Code editor |
| React Hook Form + Zod | 7.68 / 4.1 | Form validation |
| TailwindCSS + DaisyUI | 4.1 / 5.5 | Utility CSS |
| Lucide React | 0.560 | Icons |
| React Markdown | 10.1 | Markdown rendering |
| @react-oauth/google | 0.12 | Google OAuth |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.1 | REST API server |
| MongoDB + Mongoose | 9.0 | Primary database |
| Redis | 5.10 | Session blocklist + caching |
| JWT | 9.0 | Authentication tokens |
| bcrypt | 6.0 | Password hashing |
| Groq SDK | 0.10 | Whisper STT + LLM (Llama) |
| Google Generative AI | 1.33 | Gemini for problem AI |
| OpenAI | 6.10 | Code review + interview AI |
| Cloudinary | 2.8 | Video/image storage |
| Multer | 1.4 | File upload middleware |
| Validator | 13.15 | Input validation |

---

## Project Structure

```
CodeArena/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── redis.js           # Redis client
│   │   ├── controllers/
│   │   │   ├── userAuth.js        # Login, signup, Google OAuth
│   │   │   ├── problemCreator.js  # Problem CRUD
│   │   │   ├── submit.js          # Code execution + evaluation
│   │   │   ├── aiChatting.js      # Career guidance AI
│   │   │   ├── careerRoutes.js    # Career chat endpoints
│   │   │   ├── interviewRoutes.js # AI interview Q&A
│   │   │   ├── voiceInterview.js  # Groq Whisper STT
│   │   │   ├── adminRoutes.js     # Admin analytics
│   │   │   ├── videoCreator.js    # Cloudinary video upload
│   │   │   ├── userDashboard.js   # User stats + heatmap
│   │   │   ├── codeReviewRoutes.js# AI code review
│   │   │   └── spacedRepetition.js# Review scheduling
│   │   ├── middleware/
│   │   │   └── userMiddleware.js  # JWT auth + Redis check
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── problem.js
│   │   │   ├── submission.js
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── userAuth.js
│   │   │   ├── problemCreator.js
│   │   │   ├── submit.js
│   │   │   ├── aiChatting.js
│   │   │   ├── careerRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   ├── voiceInterview.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── videoCreator.js
│   │   │   ├── userDashboard.js
│   │   │   ├── codeReviewRoutes.js
│   │   │   └── spacedRepetitionRoutes.js
│   │   └── index.js               # Express app entry point
│   ├── .env
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx/.css   # Marketing homepage
    │   │   ├── Login.jsx              # Sign in page
    │   │   ├── SignUp.jsx             # Registration page
    │   │   ├── HomePage.jsx/.css      # Problems list dashboard
    │   │   ├── ProblemPage.jsx/.css   # Code editor + problem view
    │   │   ├── AIInterview.jsx/.css   # Mock interview (text+voice)
    │   │   ├── CareerGuidance.jsx/.css# Career chat
    │   │   ├── RoadmapGenerator.jsx/.css # Learning roadmaps
    │   │   ├── SpacedRepetition.jsx/.css # Review queue
    │   │   ├── UserDashboard.jsx/.css # User analytics
    │   │   ├── AdminDashboard.jsx/.css# Admin analytics
    │   │   └── Admin.jsx/.css         # Admin panel
    │   ├── components/
    │   │   ├── layout/Navbar.jsx      # Global navigation
    │   │   ├── ChatAi.jsx             # AI chat widget
    │   │   ├── CodeReview.jsx         # Code review panel
    │   │   ├── Editorial.jsx          # Video editorial
    │   │   ├── SolutionsTab.jsx       # Community solutions
    │   │   ├── SubmissionHistory.jsx  # Past submissions
    │   │   ├── AdminPanel.jsx         # Problem management
    │   │   ├── AdminUpload.jsx        # Video upload
    │   │   └── AdminVideo.jsx         # Video manager
    │   ├── visualizer/
    │   │   ├── pages/
    │   │   │   ├── VisualizerHome.jsx  # DSA hub
    │   │   │   ├── SortingCategory.jsx
    │   │   │   ├── CategoryPage.jsx
    │   │   │   └── StacksQueuesCategory.jsx
    │   │   ├── components/
    │   │   │   ├── sorting/BubbleSortViz.jsx
    │   │   │   ├── sorting/MergeSortViz.jsx
    │   │   │   ├── trees/TreeViz.jsx
    │   │   │   ├── graphs/GraphViz.jsx
    │   │   │   ├── dp/DPViz.jsx
    │   │   │   ├── searching/BinarySearchViz.jsx
    │   │   │   ├── stacks-queues/StackViz.jsx
    │   │   │   ├── recursion/NQueensViz.jsx
    │   │   │   └── common/
    │   │   │       ├── AnimationControls.jsx
    │   │   │       ├── CodePanel.jsx
    │   │   │       ├── StatePanel.jsx
    │   │   │       └── GeminiTutorModal.jsx
    │   │   ├── algorithms/          # Step generation logic
    │   │   └── hooks/useAnimation.js
    │   ├── design-system/
    │   │   ├── tokens/index.css     # CSS custom properties
    │   │   └── components/          # Button, Badge, Card, etc.
    │   ├── store/store.js           # Redux store
    │   ├── authSlice.js             # Auth state
    │   ├── utils/axiosClient.js     # Axios instance
    │   └── index.css                # Global styles + theme
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Redis instance (Upstash or local)
- Groq API key (free tier works)
- Google Cloud OAuth credentials
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/codearena.git
cd codearena
```

### 2. Backend setup
```bash
cd Backend
npm install
cp .env.example .env
# Fill in all environment variables (see below)
npm run dev
```

### 3. Frontend setup
```bash
cd Frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Environment Variables

Create `Backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECT_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/codearena

# Auth
JWT_KEY=your_super_secret_jwt_key_min_32_chars

# Redis
REDIS_PASS=your_redis_password
REDIS_PORT=6379
REDIS_HOST=localhost

# AI APIs
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com

# Cloudinary (video editorials)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `Frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000
```

---

## API Reference

### Authentication — `/user`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/user/register` | Register with email + password | Public |
| POST | `/user/login` | Login, sets JWT cookie | Public |
| POST | `/user/logout` | Invalidates token in Redis | Protected |
| POST | `/user/google` | Google OAuth login | Public |
| GET  | `/user/profile` | Get current user | Protected |

### Problems — `/problem`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/problem/all` | List all problems | Protected |
| GET  | `/problem/:id` | Get single problem | Protected |
| POST | `/problem/create` | Create problem | Admin |
| PUT  | `/problem/:id` | Update problem | Admin |
| DELETE | `/problem/:id` | Delete problem | Admin |

### Code Submission — `/submission`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/submission/run` | Run code against test cases | Protected |
| POST | `/submission/submit` | Submit for evaluation | Protected |
| GET  | `/submission/history/:problemId` | User's past submissions | Protected |

### AI Interview — `/interview`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/interview/domains` | Available domains + topics | Protected |
| POST | `/interview/question` | Generate next question | Protected |
| POST | `/interview/evaluate` | Evaluate user answer | Protected |
| POST | `/interview/hint` | Get hint for current Q | Protected |
| POST | `/interview/summary` | Generate session summary | Protected |

### Voice Interview — `/interview/voice`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/interview/voice/speech-to-text` | Transcribe audio via Groq Whisper | Protected |
| GET  | `/interview/voice/settings` | Voice configuration | Protected |

### Career Guidance — `/career`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/career/chat` | Chat with AI career advisor | Protected |
| POST | `/career/roadmap` | Generate learning roadmap | Protected |

### User Dashboard — `/dashboard`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/stats` | Solved count, streak, acceptance | Protected |
| GET | `/dashboard/heatmap` | Contribution data for heatmap | Protected |
| GET | `/dashboard/submissions` | Recent submissions | Protected |

### Admin — `/admin`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/stats` | Platform-wide statistics | Admin |
| GET | `/admin/users` | All users | Admin |
| GET | `/admin/submissions` | All submissions | Admin |
| GET | `/admin/leaderboard` | Top solvers | Admin |

---

## Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | LandingPage | Marketing page with hero, features, how-it-works |
| `/login` | Login | Split-panel sign in with code editor decoration |
| `/signup` | SignUp | Split-panel registration with stats |
| `/home` | HomePage | Problems list with filter, search, progress |
| `/problem/:id` | ProblemPage | LeetCode-style split editor |
| `/visualizer` | VisualizerHome | DSA algorithm hub |
| `/visualizer/sorting/*` | SortingViz | Sorting algorithm visualizers |
| `/visualizer/trees/*` | TreeViz | Tree traversal visualizers |
| `/visualizer/graphs/*` | GraphViz | Graph algorithm visualizers |
| `/ai-interview` | AIInterview | Mock interview with voice support |
| `/career` | CareerGuidance | AI career chat |
| `/roadmap` | RoadmapGenerator | AI learning roadmaps |
| `/review` | SpacedRepetition | Smart review queue |
| `/dashboard` | UserDashboard | Personal analytics + heatmap |
| `/admin` | Admin | Problem + video management |
| `/admin/dashboard` | AdminDashboard | Platform analytics |

---

## Screenshots

> Coming soon — screenshots of each major feature

---

## Contributing

1. Fork the repository at [github.com/Abhijeet-dev-05/AiCodingPlatform](https://github.com/Abhijeet-dev-05/AiCodingPlatform)
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is licensed under the ISC License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by the CodeArena team
  <br/>
  <sub>Helping developers land their dream jobs, one problem at a time.</sub>
</div>
