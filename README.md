# TaskPulse — FastAPI & React Task Studio

A full-stack task management application featuring a modern React frontend (built with Vite) and a robust FastAPI backend connected to Supabase.

---

## 🚀 Live Deployment Guide (Render.com)

You can easily deploy this repository as a **Web Service** on [Render](https://render.com):

1. **Create a New Web Service** on Render and connect your GitHub repository.
2. Configure the service settings:
   - **Environment**: `Python 3`
   - **Region**: Choose the closest to you / your Supabase region
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
3. Add **Environment Variables** in Render's dashboard:
   - `SUPABASE_URL` = your Supabase Project URL (e.g. `https://xyz.supabase.co`)
   - `SUPABASE_KEY` = your Supabase API anon key
   - `ENVIRONMENT` = `production`
4. Click **Deploy Web Service**! Render will automatically detect the port via the `$PORT` environment variable and host your React UI and FastAPI API together.

---

## 🛠 Local Development

### 1. Install Dependencies

```bash
# Python dependencies
pip install -r requirements.txt

# Frontend dependencies (optional, if modifying React code)
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

### 3. Run the Application

```bash
# Run standalone (serves both React UI and API on http://localhost:8000)
python main.py
```

Or for React development with hot-reload:
```bash
# Terminal 1: Backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📁 Repository Structure

```
.
├── .env.example          # Template for required environment variables
├── .gitignore            # Git ignore rules for Python, Node, and secrets
├── requirements.txt      # Python dependencies for FastAPI & Supabase
├── main.py               # Application entrypoint & static SPA server
├── app/                  # FastAPI backend
│   ├── app.py            # API routes (/tasks, /tasks/{id}, /tasks/{id}/done)
│   ├── db.py             # Supabase client initialization
│   └── schemas.py        # Pydantic schemas (TaskCreate, TaskUpdate)
└── frontend/             # React frontend
    ├── dist/             # Pre-built production bundle for instant serving
    ├── src/              # React source code & components
    ├── package.json      # Frontend package configuration
    └── vite.config.js    # Vite configuration & backend proxy
```

---

## 🔌 API Endpoints

- `GET /tasks`: Retrieve all tasks
- `POST /tasks`: Create a new task (`title`, `description`)
- `GET /tasks/{id}`: Retrieve a specific task by ID
- `PATCH /tasks/{id}`: Update task title, description, or status
- `PATCH /tasks/{id}/done`: Mark a task as completed
- `DELETE /tasks/{id}`: Permanently delete a task
