# LLM Papers autoformalisation

A curated, filterable catalogue of papers on Large Language Models, deployed as a static site on GitHub Pages.

## Live Site

The site is automatically deployed on every push to `main` and refreshed weekly via a scheduled GitHub Actions workflow.

## Features

- **Filterable paper browser** — filter by LLM, language, type, dataset, domain, or free-text search.
- **Statistics charts** — papers per year (bar) and LLM usage (pie) via Chart.js, updated live as filters change.
- **Duplicate detection** — fuzzy matching (weighted Jaccard on title, authors, year) prevents duplicate entries.
- **Security hardened** — Content Security Policy with hash-based script/style allowlists, Subresource Integrity on all assets, Trusted Types polyfill, no `innerHTML` usage, URL scheme validation on links.

## Project Structure

```text
├── template.html              # HTML template with SRI/CSP placeholders
├── index.html                 # Generated at build time (do not edit)
├── build-sri.js               # Build script: computes SRI hashes, injects CSP, generates index.html
├── package.json               # Node dependencies and build script
├── papers.json                # Master paper database (raw + normalised entries)
├── _data/
│   └── papers.json            # Deployed paper list (raw entries only, synced from papers.json)
├── src/
│   ├── python/
│   │   ├── add_paper.py       # CLI tool to add a paper interactively
│   │   ├── normaliser.py      # BibTeX entry normalisation (text, authors, LaTeX stripping)
│   │   ├── duplicate_checker.py # Fuzzy duplicate detection
│   │   └── sync_database.py   # Sync papers.json → _data/papers.json
│   └── typescript/
│       ├── index.ts            # Entry point
│       ├── Main.ts             # App bootstrap
│       ├── divs/               # UI components (filters, papers, statistics, top message)
│       ├── papers/             # Paper model, loader, filters
│       └── utils/              # HTML utilities, validation
├── static/
│   ├── css/index.css
│   ├── images/                 # Favicon and images
│   └── js/                     # Built JS bundle + Trusted Types polyfill
├── add_paper.sh                # Shell wrapper for add_paper.py
├── sync_database.sh            # Shell wrapper for sync_database.py
└── .github/workflows/
    └── update.yml              # CI/CD: build, sync, commit, deploy to GitHub Pages
```

## Prerequisites

- **Node.js** >= 20 (with [Corepack](https://nodejs.org/api/corepack.html) enabled)
- **Yarn** >= 4 (managed automatically via `corepack` and the `packageManager` field in `package.json`)
- **Python** >= 3.14 (only for the paper management CLI and database sync)

## Build

```bash
corepack enable   # if not already enabled
yarn install
yarn build
```

This will:

1. Bundle the TypeScript source into `static/js/index.js` via esbuild.
2. Compute SHA-384 hashes for all static assets.
3. Generate `index.html` from `template.html` with SRI integrity attributes and a CSP `<meta>` tag.

## Adding a Paper

```bash
./add_paper.sh
```

This launches an interactive CLI that prompts for paper metadata, normalises the entry, checks for duplicates, and appends it to `papers.json`.

## Syncing the Database

```bash
./sync_database.sh
```

Extracts the raw entries from `papers.json` into `_data/papers.json` (the file served to the frontend). Creates a backup at `_data/papers.json.bak` before overwriting.

## CI/CD

The GitHub Actions workflow (`.github/workflows/update.yml`) runs on every push to `main` and weekly on a cron schedule. It:

1. Enables Corepack and installs JS dependencies via Yarn Berry.
2. Builds the frontend (`yarn build`).
3. Syncs the paper database.
4. Commits any changes back to `main`.
5. Deploys the site to GitHub Pages.

## Security

- **Content Security Policy**: Hash-based `script-src` and `style-src` directives injected at build time via `<meta http-equiv="Content-Security-Policy">`. Only scripts and styles matching their SHA-384 hashes can execute.
- **Subresource Integrity**: All `<script>` and `<link>` tags include `integrity` attributes.
- **Trusted Types**: A polyfill enforces Trusted Types to prevent DOM-based XSS.
- **No `innerHTML`**: All DOM manipulation uses safe APIs (`textContent`, `createElement`, `appendChild`).
- **URL validation**: Links from paper data are validated to only allow `http:` and `https:` schemes.
- **Link safety**: All external links use `rel="noopener noreferrer"`.
