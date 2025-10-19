Vercel setup

Project root directory
- Set Root Directory to `influencerstudio/apps/web` in the Vercel Project settings.

Build & install
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output: Next.js defaults (no change needed)
- Node.js Version: 20

Environment variables (Production & Preview)
- NEXT_PUBLIC_CONVEX_URL = https://graceful-goldfish-559.convex.cloud
- NEXTAUTH_URL = https://<your-vercel-domain>
- NEXTAUTH_SECRET = <random string>
- GOOGLE_CLIENT_ID = <from Google OAuth>
- GOOGLE_CLIENT_SECRET = <from Google OAuth>
- USE_MOCK_ADAPTERS = true
- STORYSTUDIO_API_BASE_URL = (optional if using mocks)
- STORYSTUDIO_API_KEY = (optional if using mocks)
- NEXT_PUBLIC_FIREBASE_API_KEY = from .env.sample
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = from .env.sample
- NEXT_PUBLIC_FIREBASE_PROJECT_ID = story-factory-4bbdf
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = from .env.sample
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = from .env.sample
- NEXT_PUBLIC_FIREBASE_APP_ID = from .env.sample
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = from .env.sample

Git integration
- Connect the repository in Vercel and select the branch to deploy (e.g., `main`).
- Ensure the Root Directory points to `influencerstudio/apps/web`.
- Optionally enable automatic Preview Deployments for PRs.

GitHub Actions (optional CI/CD)
- A workflow is included at `infra/github/workflows/vercel-deploy.yml`.
- Add the following GitHub secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- The workflow deploys previews on pull requests and production on pushes to `main`.

