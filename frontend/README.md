# TaskPulse — React Frontend for Tasks API

A fast, modern React frontend built with Vite and vanilla CSS glassmorphism, designed to connect directly with the FastAPI and Supabase backend.

## 📁 Project Structure

```
project/
├── app/                  # Backend FastAPI application (UNTOUCHED)
│   ├── app.py            # Endpoints: GET/POST/PATCH/DELETE /tasks
│   ├── db.py             # Supabase client initialization
│   └── schemas.py        # Pydantic schemas (TaskCreate, TaskUpdate)
├── frontend/             # React Frontend
│   ├── dist/             # Production build bundle
│   ├── src/
│   │   ├── components/   # Modular React components
│   │   │   ├── Header.jsx        # Top navbar, API indicator, hotkeys, new task CTA
│   │   │   ├── TaskStats.jsx     # Overview cards & completion velocity bar
│   │   │   ├── TaskFilters.jsx   # Search input, status tabs, sort dropdown
│   │   │   ├── TaskList.jsx      # Task list container, empty & loading states
│   │   │   ├── TaskCard.jsx      # Task card with toggle, edit, and delete buttons
│   │   │   ├── TaskModal.jsx     # Create and edit task modal with validation
│   │   │   ├── DeleteModal.jsx   # Confirmation modal for task deletion
│   │   │   └── Toast.jsx         # Action notifications
│   │   ├── services/
│   │   │   └── api.js            # API client mapping all /tasks endpoints
│   │   ├── styles/
│   │   │   └── index.css         # Modern dark glassmorphic design system
│   │   ├── App.jsx               # Main state management & coordination
│   │   └── main.jsx              # React DOM entrypoint
│   ├── index.html        # HTML shell with Google Fonts
│   ├── package.json      # Dependencies and build scripts
│   └── vite.config.js    # Vite configuration & dev proxy
├── main.py               # Standalone runner: serves React SPA + FastAPI backend
└── .env                  # Supabase environment variables
```

## 🚀 How to Run

### Method 1: Running Standalone via `main.py` (Recommended)

From the `project` directory:

```bash
# Using your virtual environment python
python main.py
```

Then open your browser at **[http://localhost:8000](http://localhost:8000)**. The React frontend is automatically served directly alongside your FastAPI endpoints!

### Method 2: Running with Vite Dev Server (Hot-Reload)

If you're actively editing React components and want instant Hot Module Replacement (HMR):

1. Start the FastAPI backend:
   ```bash
   python main.py
   ```
2. In a separate terminal inside `project/frontend`:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:5173](http://localhost:5173)**. Requests to `/tasks` are automatically proxied to port 8000.

3. To rebuild the production bundle anytime:
   ```bash
   npm run build
   ```

## 🔌 Integrated Backend Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Fetches all tasks ordered newest first |
| `POST` | `/tasks` | Creates a new task (`title`, `description`) |
| `GET` | `/tasks/{id}` | Fetches a single task by ID |
| `PATCH` | `/tasks/{id}` | Updates task fields (`title`, `description`, `completed`) |
| `PATCH` | `/tasks/{id}/done` | Marks task as completed |
| `DELETE` | `/tasks/{id}` | Deletes a task from Supabase |
