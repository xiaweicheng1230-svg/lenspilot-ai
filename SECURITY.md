# Security Policy

## Supported version

The latest code on `main` is the currently supported development version.

## Reporting a vulnerability

Do not publish API keys, private photographs, exploit details, or sensitive logs in a public issue. Contact the repository owner privately through the security contact configured on the GitHub profile or use GitHub private vulnerability reporting when enabled.

## Deployment safety

- Keep `.env` and provider keys out of Git.
- Configure AI secrets only in the hosting provider dashboard.
- Treat uploaded photos as private user data.
- Do not enable permanent photo history on ephemeral storage.
- Review CORS origins before adding a custom production domain.

