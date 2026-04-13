#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_URL="${1:-}"
if [[ -z "$API_URL" ]] || [[ "$API_URL" == */ ]]; then
  echo "Usage: $0 https://cs4550-api.shubhthorat.com"
  exit 1
fi

npx vercel@latest env add NEXT_PUBLIC_HTTP_SERVER production --value "$API_URL" --force --yes
npx vercel@latest env add NEXT_PUBLIC_HTTP_SERVER preview --value "$API_URL" --force --yes
npx vercel@latest deploy --prod --yes
