# FYXAI Site Redesign — Design Spec

**Date:** 2026-04-22  
**Scope:** Full UI redesign + data refresh + automated agent updates  
**Repo:** fyxai/fyxai.github.io

---

## Goals

1. Rebuild component system with badge/tag/filter support (Notion/Raycast card style)
2. Redesign Skills, MCP, Utilities pages with category filters and search
3. Add `/harness` page covering Harness Engineering + Agent Skills framework
4. Update `skills.json` to 2025-2026 hot AI engineering skills (40+)
5. Add `utilities.json` with curated hot AI tools list
6. Add GitHub Actions workflow for automated AI agent data updates

---

## Architecture

### Component System (`components/`)

**`Cards.jsx`** — Rebuilt with:
- `Card` — base card with optional `href`, hover lift effect
- `FilterBar` — `use client`, search input + category chip array, filters cards in-memory
- `Badge` — small pill for verification level, source, stars, category
- `SectionHeader` — title + item count + description line

**`globals.css`** — Add:
- Badge color palette (official=emerald, community=cyan, category chips)
- Filter chip active/inactive states
- Card hover border glow animation

---

## Pages

### Skills (`/skills`)
- `FilterBar` with categories: LLM Integration, Retrieval, Agent Design, Evaluation, Cost & Latency, Safety, MLOps, UX Engineering, Integration
- Search by name or description
- Card shows: name, category badge, verification badge, what-it-does, use case, source link
- Data: `skills.json` expanded to 40+ entries covering 2025-2026 hot skills

### MCP (`/mcp`)
- Remove Chinese description text
- `FilterBar` with source filter: official / community
- Sort by stars (descending)
- Card shows: name, stars badge, updated date, description
- Data: `mcp.json` unchanged (auto-updated by existing script)

### Utilities (`/utilities`) — Dual Zone
**Zone 1 — Hot AI Tools (navigation):**
- Categories: Coding, Research, Design, Productivity, Infrastructure
- Tools: Cursor, v0, Bolt, Windsurf, Perplexity, Replit, Notion AI, Gamma, Midjourney, Runway, Vercel, Supabase, etc.
- Data: new `utilities.json`

**Zone 2 — Developer Tools:**
- Token Calculator (interactive, client component)
- Prompt Template Library (curated examples)
- AI API Comparison table (pricing/context/features)

### Harness (`/harness`) — New Page
- Hero: What is Harness Engineering (驾驭工程)?
- Concept cards: Skills Standard, Tool Execution, Feedback Loops, Memory/State, Context Management
- Agent Skills ecosystem overview (Claude Code / Cursor / Copilot interop)
- Resource links: agentskills.io, Hermes Agent, key articles

---

## Data Updates

### `skills.json` — Full Replacement
Categories and new entries (40+ total):

| Category | Example Skills |
|----------|---------------|
| LLM Integration | Function calling, Structured outputs, Multi-modal inputs, Tool use chaining |
| Retrieval | RAG + chunking, Hybrid search, GraphRAG, Re-ranking |
| Agent Design | ReAct, Memory summarization, Multi-agent orchestration, Reflection loops |
| Evaluation | LLM-as-judge, Evals harness, Regression testing, Tracing |
| Cost & Latency | Prompt caching, Batch API, Token budgeting, Model routing |
| Safety | Guardrails, Constitutional AI, Output validation, Red-teaming |
| MLOps | Fine-tuning pipelines, Observability, A/B testing models |
| Harness Engineering | Skills packaging, Context injection, Feedback loops, Self-improving agents |

### `utilities.json` — New File
```json
[
  { "name": "Cursor", "category": "Coding", "desc": "...", "url": "...", "hot": true },
  ...
]
```

---

## Automated Agent Updates

### `.github/workflows/auto-update.yml`
- **Trigger:** `schedule: cron '0 6 * * *'` (daily 6AM UTC) + `workflow_dispatch`
- **Steps:**
  1. Checkout repo
  2. Setup Node.js
  3. Run `scripts/update-mcp.js` — refresh MCP stars from GitHub API
  4. Run `scripts/update-news.js` — fetch latest AI news
  5. Commit & push changes if any

### `scripts/update-mcp.js` (already exists, keep)
### `scripts/update-news.js` (already exists or create)

---

## Navigation Update

Add `/harness` to Navbar:
```
Home | News | MCP | Skills | Harness | Projects | Prompts | Utilities
```

---

## Out of Scope

- Authentication / user accounts
- Backend API changes
- Prompt Registry redesign (separate effort)
- News page redesign (separate effort)
