# DiscvrAI — AI-Powered Product Discovery

## 🚀 Live Demo

| Service | URL |
|--------|------|
| 🌐 Frontend | https://discvr-ai-platform.vercel.app |
| 🔌 Backend API | https://discvr-ai-backend.onrender.com |
| ❤️ Health Check | https://discvr-ai-backend.onrender.com/api/health |


A full-stack **Product Discovery** application with an AI/LLM-powered natural-language search. Browse a curated electronics catalog, or ask the AI to find exactly what you need — "Show me budget laptops" or "What's good for gaming?"

## 🏗️ Architecture

```
Discvrai/
├── backend/                  # Express API + OpenAI integration
│   ├── data/products.json    # Mock product catalog (8 products)
│   ├── routes/
│   │   ├── products.js       # GET /api/products (list + filter)
│   │   └── ask.js            # POST /api/ask (LLM-powered search)
│   ├── services/
│   │   └── llmService.js     # OpenAI prompt + response parsing
│   ├── server.js             # Express entry point
│   ├── .env.example          # Env var template
│   └── package.json
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── AskBox.jsx    # Natural-language search input
│   │   │   ├── AISummary.jsx # LLM summary display
│   │   │   ├── ProductCard.jsx  # Reusable product card
│   │   │   └── ProductList.jsx  # Grid of ProductCards
│   │   ├── services/api.js   # Centralised API helpers
│   │   ├── App.jsx           # Root component (state management)
│   │   └── main.jsx          # ReactDOM entry
│   ├── vite.config.js        # Vite config + API proxy
│   └── package.json
└── README.md                 # ← you are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- An **OpenAI API key** (or compatible provider)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/discvrai.git
cd discvrai
```

### 2. Backend setup

```bash
cd backend
npm install

# Create your .env from the template
cp .env.example .env
# Then edit .env and paste your OpenAI key:
#   OPENAI_API_KEY=sk-...
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

### 4. Run both servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev          # or: npm start

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📡 API Endpoints

| Method | Path             | Description                                          |
| ------ | ---------------- | ---------------------------------------------------- |
| `GET`  | `/api/products`  | List all products. Optional query params: `category`, `q` (keyword). |
| `POST` | `/api/ask`       | AI search. Body: `{ "query": "your question" }`. Returns `{ products, summary }`. |
| `GET`  | `/api/health`    | Health check.                                        |

### Example — Ask AI

```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me budget laptops"}'
```

**Response:**

```json
{
  "products": [
    { "id": 1, "name": "ProBook Lite 14", "category": "Laptops", "price": 499, "..." : "..." }
  ],
  "summary": "The ProBook Lite 14 is a lightweight, budget-friendly laptop ideal for students and productivity tasks at just $499."
}
```

---

## 🤖 AI / LLM Integration

- **Provider:** OpenAI (gpt-3.5-turbo) — easily swappable to gpt-4 or any compatible API.
- **Prompt design:** The system prompt sends the entire product catalog (ID, name, category, price, tags, description) as context, then instructs the model to return structured JSON: `{ "productIds": [...], "summary": "..." }`.
- **Structured output:** The backend parses the LLM response as JSON, validates the shape, resolves product IDs to full objects, and returns a clean response.
- **Error handling:** Rate limits → 503, invalid key → 502, parse failures → 502. No raw API errors or keys are ever exposed to the client.

---

## ⚙️ Environment Variables

| Variable         | Required | Description                            |
| ---------------- | -------- | -------------------------------------- |
| `OPENAI_API_KEY` | ✅       | Your OpenAI API key                    |
| `PORT`           | ❌       | Backend port (default: `5000`)         |

> **Security:** `.env` is git-ignored. Never commit your API key.

---

## 🧩 Key Technical Decisions

| Area                  | Choice                                          |
| --------------------- | ----------------------------------------------- |
| Backend framework     | Express (lightweight, fast to set up)            |
| Frontend framework    | React 18 + Vite (fast HMR, modern tooling)       |
| LLM provider          | OpenAI Chat Completions API                      |
| Data store            | In-memory JSON file (no DB needed for scope)     |
| Styling               | Vanilla CSS with CSS custom properties (dark theme) |
| API proxy             | Vite dev server proxy (`/api` → `localhost:5000`) |
| Reusable component    | `ProductCard` — used in both catalog and AI results |

---

## 🔮 What I'd Add with More Time

- **Product detail page** with dynamic route (`/products/:id`) and an AI-generated one-liner
- **Response caching** to avoid redundant LLM calls for similar queries
- **Streaming** LLM responses for a chat-like UX
- **Testing** — Jest + React Testing Library for components, Supertest for API
- **Deployment** — Vercel (frontend) + Railway (backend)
- **Semantic search** using embeddings for more accurate product matching

---

## ⏱️ Time Spent

~2.5 hours (backend + LLM: ~1h, frontend + integration: ~1h, README + polish: ~30min)
