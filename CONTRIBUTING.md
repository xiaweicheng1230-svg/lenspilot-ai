# Contributing to LensPilot AI

Thank you for helping improve LensPilot AI. The project values evidence-based photography guidance, explicit uncertainty, privacy, and honest product status.

## Development workflow

1. Create a branch such as `feature/exif-normalization` or `fix/mobile-upload`.
2. Keep frontend, backend, AI provider, and persistence concerns separated.
3. Add meaningful tests for changed behavior.
4. Run the relevant checks before opening a pull request.

```powershell
cd backend
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest

cd ..\frontend
npm run lint
npm test
npm run build
```

## Commit messages

Use conventional prefixes:

- `feat:` new behavior
- `fix:` bug fix
- `docs:` documentation
- `refactor:` internal restructuring
- `test:` tests only
- `chore:` tooling and maintenance

## AI-specific requirements

- Never invent missing EXIF fields.
- Keep Mock output visibly labeled.
- Validate model output on the backend.
- Document prompt-version changes.
- Do not publish evaluation scores that were not actually measured.

## Assets and upstream code

Only contribute photos and other media that can legally be redistributed. When adapting open-source code, follow `docs/OPEN_SOURCE_REUSE.md` and update `THIRD_PARTY_NOTICES.md` when required.

