#!/usr/bin/env bash
# After your Node API is live (e.g. Render), run from repo root:
#   ./scripts/vercel-set-api-url.sh https://your-service.onrender.com
# No trailing slash. Then redeploys production so NEXT_PUBLIC_* is baked into the build.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_URL="${1:-}"
if [[ -z "$API_URL" ]] || [[ "$API_URL" == */ ]]; then
  echo "Usage: $0 https://your-api.example.onrender.com"
  echo "(no trailing slash)"
  exit 1
fi

npx vercel@latest env add NEXT_PUBLIC_HTTP_SERVER production --value "$API_URL" --force --yes
npx vercel@latest env add NEXT_PUBLIC_HTTP_SERVER preview --value "$API_URL" --force --yes
npx vercel@latest deploy --prod --yes
echo "Done. Production: https://cs4550.vercel.app (or your project alias)"
