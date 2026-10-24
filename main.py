import os
from pathlib import Path
import uvicorn
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

#pyrefly: ignore[missing-import]
from app.app import app

# 1. Enable CORS for local development (e.g. Vite dev server on port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Path to React frontend build artifacts
FRONTEND_DIST = Path(__file__).resolve().parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    # Remove existing root GET route from app.app so "/" serves our React app
    app.router.routes = [
        route
        for route in app.router.routes
        if not (getattr(route, "path", None) == "/" and "GET" in getattr(route, "methods", []))
    ]

    # Mount static assets directory (/assets/...)
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    # Serve index.html for root path
    @app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_root():
        return FileResponse(FRONTEND_DIST / "index.html")

    # SPA catch-all for direct links and browser refreshes
    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't intercept API endpoints, docs, or openapi schema
        if full_path.startswith("tasks") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Endpoint not found")

        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(FRONTEND_DIST / "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    reload = os.environ.get("ENVIRONMENT", "development").lower() != "production"
    uvicorn.run(app="main:app", host="0.0.0.0", port=port, reload=reload)