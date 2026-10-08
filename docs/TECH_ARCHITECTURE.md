# Technical Architecture

## Components

- Next.js handles responsive user interaction and rendering.
- FastAPI owns uploads, EXIF parsing, AI orchestration, validation, and persistence.
- SQLite supports local development; SQLAlchemy and migrations preserve a path to PostgreSQL.
- Local storage is used for MVP photos and thumbnails; the storage service will later support object storage.

## Boundary rule

The browser never receives the AI provider key and never parses untrusted natural-language model output. All AI results cross the backend as validated JSON.

## API namespace

All application endpoints use `/api/v1`. Operational endpoints such as health checks remain simple and contain no secrets.

