# HN Scraper — MERN Stack App

A full-stack web application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), stores them in MongoDB, and lets users browse, authenticate, and bookmark stories.

## Features

- **Web Scraper** — Scrapes HN on server start; re-triggerable via `POST /api/scrape`
- **JWT Authentication** — Register & login with secure bcrypt password hashing
- **Story API** — Paginated, sorted by points descending
- **Bookmarks** — Toggle bookmark per story, persisted in MongoDB (auth required)
- **React Frontend** — Stories list, Login, Register, protected Bookmarks page

---

## Project Structure

```
Web_Scraper/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # authController, storyController
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # User, Story schemas
│   ├── routes/         # authRoutes, storyRoutes, scrapeRoutes
│   ├── scraper/        # hnScraper.js (cheerio + axios)
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/        # axios instance
    │   ├── components/ # Navbar, StoryCard, ProtectedRoute
    │   ├── context/    # AuthContext (React Context API)
    │   └── pages/      # Stories, Login, Register, Bookmarks
    ├── index.html
    └── vite.config.js
```

---

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hn_scraper
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

---

## Setup & Run Locally

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or provide a MongoDB Atlas URI)

### 1. Backend

```bash
cd backend
npm install
# Copy and fill in .env
cp .env.example .env
npm run dev
```

The server starts on `http://localhost:5000`.  
On startup it **automatically scrapes** the top 10 HN stories.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:3000` and proxies `/api` to the backend.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Stories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stories` | No | All stories, sorted by points desc |
| GET | `/api/stories?page=1&limit=10` | No | Paginated stories |
| GET | `/api/stories/:id` | No | Single story |
| POST | `/api/stories/:id/bookmark` | Yes | Toggle bookmark |
| GET | `/api/stories/bookmarks` | Yes | Get user's bookmarks |

### Scraper
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scrape` | Trigger manual scrape |

---

## Bonus
- **Pagination** — `GET /api/stories?page=1&limit=10` supported
- Frontend includes a "Refresh Stories" button that triggers the scraper on demand
