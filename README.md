# my-puzzles-guide

## Environment Variables

This project uses environment variables for services and sensitive configuration. Do not commit `.env` with secrets.

1. Copy `.env.example` to `.env` and fill in the values.
2. Set the `DISCORD_WEBHOOK` in your hosting provider (e.g., Vercel) as an environment variable — do not commit it into the repository.
3. For local testing, use the `scripts/generate-env-js.ps1` script (PowerShell) to generate an `env.js` for client pages that read variables, but avoid including secrets you don't want exposed in `env.js`.

Required environment variables:

- `DISCORD_WEBHOOK` — The Discord webhook URL the server uses to forward messages.
- `SUPABASE_URL` — The supabase project URL.
- `SUPABASE_ANON_KEY` — The supabase anon or service key used by your back-end.

Note: `env.js` should not include secrets like `DISCORD_WEBHOOK`; server routes should use process.env instead.
