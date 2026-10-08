# LensPilot AI

> Your AI photography coach that understands both the image and how it was captured.
>
> 一个同时理解照片内容和拍摄参数的 AI 摄影教练。

LensPilot AI is an in-development multimodal photography assistant for beginners. It combines image content, EXIF metadata, shooting intent, and historical performance to explain what happened in a photo and make the next shot more actionable.

## Project status

The repository is currently in the engineering-foundation stage. The frontend shell, backend API, local configuration, and product documentation are being implemented first. Features are marked complete only after they can be run and verified.

## Product principles

- Diagnose instead of merely rating a photo.
- Explain the relationship between ISO, aperture, shutter speed, and focal length.
- Use the actual image and available EXIF data; never invent missing metadata.
- Express camera settings as situational guidance, not absolute answers.
- Keep Mock Mode explicit so demo output is never mistaken for a live AI result.

## Planned MVP

- Photo upload and validation for JPEG, PNG, and WebP
- Normalized EXIF extraction
- Structured multimodal photo analysis
- A prominent “Next Shot” recommendation
- History, feedback, photography profile, and learning plan
- Versioned prompts and a reproducible evaluation runner

## Currently verified

- Responsive Web landing and analysis workspace
- Drag-and-drop or file-picker upload for JPEG, PNG, and WebP
- Server-side format, file-size, and pixel-count validation
- Local photo persistence and thumbnail generation
- Normalized EXIF display with a safe no-EXIF fallback
- GPS metadata excluded from the public upload response

See [docs/PRD.md](docs/PRD.md) for requirements and [docs/ROADMAP.md](docs/ROADMAP.md) for delivery status.

## Quick start

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000/analyze`, select a photo, and choose **上传并读取 EXIF**. No API key is needed for the upload and EXIF flow.

### Docker

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Endpoints:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

Copy `.env.example` to `.env` when you want to override defaults. Leave `MOCK_AI=true` to run without an AI key.

## Repository layout

```text
frontend/     Next.js user interface
backend/      FastAPI, EXIF, AI providers, persistence
docs/         Product and engineering decisions
evaluation/   AI evaluation cases and runner
sample_data/  Clearly labeled demo assets
assets/       Repository screenshots and media
```

## Documentation

- [Product requirements](docs/PRD.md)
- [Product strategy](docs/PRODUCT_STRATEGY.md)
- [User persona](docs/USER_PERSONA.md)
- [User flow](docs/USER_FLOW.md)
- [AI design](docs/AI_DESIGN.md)
- [Technical architecture](docs/TECH_ARCHITECTURE.md)
- [Evaluation plan](docs/EVALUATION.md)
- [Hardware concept](docs/HARDWARE_CONCEPT.md)
- [Open-source reuse policy](docs/OPEN_SOURCE_REUSE.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Roadmap](docs/ROADMAP.md)

## Deployment

The recommended public deployment uses Vercel for the Next.js frontend and Render for the FastAPI backend. The repository includes `frontend/vercel.json` and a root `render.yaml` Blueprint. Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the exact GitHub-to-production flow and current storage limitations.

## Open-source references

LensPilot AI is its own product and codebase. Permissively licensed projects may be studied or adapted at a module level, with source and license disclosures recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The repository does not present upstream work as original work.

## License

MIT

