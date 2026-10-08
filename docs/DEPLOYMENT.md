# LensPilot AI Deployment Guide

This guide publishes the source code on GitHub, the Next.js frontend on Vercel, and the FastAPI backend on Render.

## Architecture

```text
Visitor browser
    |
    +-- https://your-project.vercel.app      Next.js frontend
    |
    +-- https://lenspilot-api.onrender.com   FastAPI backend
            |
            +-- temporary demo uploads
            +-- EXIF parser
            +-- Mock AI mode
```

GitHub Pages is not used for the complete product because it cannot run the FastAPI service. It remains suitable only for a static landing page.

## 1. Publish the repository to GitHub

Create a new empty public repository named `lenspilot-ai`. Do not initialize it with another README, `.gitignore`, or license because those files already exist locally.

From the project root:

```powershell
git add .
git commit -m "feat: build initial LensPilot web experience"
git remote add origin https://github.com/YOUR_USERNAME/lenspilot-ai.git
git push -u origin main
```

Before committing, replace `YOUR_USERNAME` only in the command. Never add an API key to the repository.

## 2. Deploy the backend on Render

1. Sign in to Render with GitHub.
2. Choose **New > Blueprint**.
3. Connect the `lenspilot-ai` repository.
4. Render reads `render.yaml` and creates `lenspilot-api`.
5. Wait for `/api/v1/health` to report `status: ok`.
6. Copy the generated backend URL, such as `https://lenspilot-api-xxxx.onrender.com`.

The checked-in Blueprint starts in `MOCK_AI=true`, so no AI key is required.

### Backend limitation

The initial demo uses Render's ephemeral filesystem. Uploaded files can disappear when the service restarts or redeploys. This is acceptable for the upload/EXIF demo but not for permanent history. Before implementing durable user history, migrate photos to object storage and data to managed PostgreSQL.

## 3. Deploy the frontend on Vercel

1. Sign in to Vercel with GitHub.
2. Choose **Add New > Project** and import `lenspilot-ai`.
3. Set **Root Directory** to `frontend`.
4. Keep the detected framework as **Next.js**.
5. Add this environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://YOUR_RENDER_DOMAIN/api/v1
```

6. Choose **Deploy**.
7. Open the generated `vercel.app` URL and test `/analyze`.

`NEXT_PUBLIC_` values are exposed to the browser by design. The backend URL is public and safe to expose; an AI API key is not.

## 4. Verify production

Verify these URLs:

```text
https://YOUR_RENDER_DOMAIN/api/v1/health
https://YOUR_VERCEL_DOMAIN/
https://YOUR_VERCEL_DOMAIN/analyze
```

Upload a non-private JPEG and confirm:

- the preview appears;
- the backend returns image dimensions;
- EXIF is displayed when present;
- an image without EXIF shows the fallback notice;
- the page identifies Mock Mode.

## 5. Configure a custom frontend domain later

If a custom domain replaces `vercel.app`, update Render's `CORS_ORIGINS` to the exact HTTPS origin, for example:

```text
https://lenspilot.example.com
```

Keep `CORS_ORIGIN_REGEX` only if Vercel preview deployments should also access the API.

## 6. Enable a real AI provider later

Add secrets in the Render dashboard, never in GitHub:

```text
MOCK_AI=false
AI_API_KEY=your-secret-key
AI_MODEL=your-vision-model
AI_BASE_URL=optional-compatible-endpoint
```

The live provider should be enabled only after the provider implementation and structured-output tests are complete.

