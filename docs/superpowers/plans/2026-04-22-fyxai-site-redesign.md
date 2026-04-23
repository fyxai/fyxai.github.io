# FYXAI Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild component system with badge/tag/filter support, redesign Skills/MCP/Utilities pages, add /harness page, update data, and add daily GitHub Actions auto-update.

**Architecture:** New client-side FilterBar component using render-props pattern wraps card grids on Skills and MCP pages. All pages share a unified Badge + SectionHeader component system. Utilities page splits into dual zones (AI tools nav + dev tools). Static export (Next.js `output: 'export'`) — all filtering is client-side.

**Tech Stack:** Next.js 15 (static export), Tailwind CSS, lucide-react, GitHub Actions

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `components/Cards.jsx` | Keep CardGrid/InfoCard, add Card export |
| Create | `components/Badge.jsx` | Pill badge with variant color system |
| Create | `components/FilterBar.jsx` | `use client` search + category chip filter (render-props) |
| Create | `components/SectionHeader.jsx` | Title + count + description header block |
| Modify | `app/globals.css` | Filter chip + badge styles |
| Replace | `data/skills.json` | 40+ AI engineering skills (2025-2026) |
| Create | `data/utilities.json` | Curated AI tools list by category |
| Modify | `app/skills/page.jsx` | Add FilterBar + SectionHeader |
| Modify | `app/mcp/page.jsx` | Remove Chinese text, add FilterBar, fix cards |
| Rewrite | `app/utilities/page.jsx` | Dual-zone: AI tools nav + dev tools |
| Create | `app/harness/page.jsx` | Harness Engineering + Agent Skills overview |
| Modify | `components/Navbar.jsx` | Add Harness link |
| Create | `.github/workflows/auto-update.yml` | Daily cron: update MCP stars + news |

---

## Task 1: Replace skills.json with 40+ hot AI skills

**Files:**
- Replace: `data/skills.json`

- [ ] **Step 1: Write new skills.json**

```json
[
  {
    "name": "Function calling with JSON schema",
    "category": "LLM Integration",
    "whatItDoes": "Lets an LLM return structured arguments that match a predefined JSON schema for deterministic tool execution.",
    "practicalUseCase": "A support bot calls a ticket API with validated fields instead of generating free-form text.",
    "sourceName": "OpenAI Platform Docs",
    "sourceUrl": "https://platform.openai.com/docs/guides/function-calling",
    "verificationLevel": "official"
  },
  {
    "name": "Structured outputs",
    "category": "LLM Integration",
    "whatItDoes": "Constrains model responses to a strict output schema so downstream systems can parse results reliably.",
    "practicalUseCase": "An extraction pipeline always receives valid JSON for invoice fields without custom regex cleanup.",
    "sourceName": "OpenAI Platform Docs",
    "sourceUrl": "https://platform.openai.com/docs/guides/structured-outputs",
    "verificationLevel": "official"
  },
  {
    "name": "Multi-modal inputs",
    "category": "LLM Integration",
    "whatItDoes": "Sends images, audio, video, or documents alongside text to a vision-capable model for richer understanding.",
    "practicalUseCase": "A quality control app scans product photos and flags defects without a separate CV pipeline.",
    "sourceName": "Anthropic Docs",
    "sourceUrl": "https://docs.anthropic.com/en/docs/build-with-claude/vision",
    "verificationLevel": "official"
  },
  {
    "name": "Tool use chaining",
    "category": "LLM Integration",
    "whatItDoes": "Sequences multiple tool calls within a single agent turn so complex workflows resolve in one pass.",
    "practicalUseCase": "A research agent searches, fetches a page, and summarises results before returning to the user.",
    "sourceName": "Anthropic Tool Use",
    "sourceUrl": "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
    "verificationLevel": "official"
  },
  {
    "name": "Extended context utilisation",
    "category": "LLM Integration",
    "whatItDoes": "Loads entire codebases, books, or long documents into a 1M+ token context for deep reasoning without chunking.",
    "practicalUseCase": "A due-diligence assistant ingests a full M&A data room and answers questions across all documents at once.",
    "sourceName": "Google Gemini 1.5 Pro",
    "sourceUrl": "https://deepmind.google/technologies/gemini/pro/",
    "verificationLevel": "official"
  },
  {
    "name": "Reasoning models (chain-of-thought)",
    "category": "LLM Integration",
    "whatItDoes": "Uses models that reason step-by-step internally before answering, improving accuracy on hard logical or math tasks.",
    "practicalUseCase": "A code reviewer catches subtle concurrency bugs by following the model's explicit reasoning trace.",
    "sourceName": "OpenAI o3 Docs",
    "sourceUrl": "https://platform.openai.com/docs/guides/reasoning",
    "verificationLevel": "official"
  },
  {
    "name": "Embeddings-based semantic search",
    "category": "Retrieval",
    "whatItDoes": "Converts text into vectors so semantically similar documents are retrieved by nearest-neighbour search.",
    "practicalUseCase": "A docs assistant finds the right troubleshooting article even when wording differs from the user query.",
    "sourceName": "OpenAI Embeddings Guide",
    "sourceUrl": "https://platform.openai.com/docs/guides/embeddings",
    "verificationLevel": "official"
  },
  {
    "name": "RAG with chunking and citation",
    "category": "Retrieval",
    "whatItDoes": "Retrieves relevant document chunks and injects them into prompts while keeping source references for answers.",
    "practicalUseCase": "An internal policy assistant answers leave questions and cites the exact handbook section used.",
    "sourceName": "LangChain RAG Tutorial",
    "sourceUrl": "https://python.langchain.com/docs/tutorials/rag/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Hybrid retrieval (BM25 + dense vectors)",
    "category": "Retrieval",
    "whatItDoes": "Combines sparse lexical search and dense semantic search to improve recall across exact terms and paraphrases.",
    "practicalUseCase": "A legal search app matches exact clause IDs and also finds conceptually similar precedent language.",
    "sourceName": "Pinecone Hybrid Search",
    "sourceUrl": "https://docs.pinecone.io/guides/search/hybrid-search",
    "verificationLevel": "official"
  },
  {
    "name": "GraphRAG",
    "category": "Retrieval",
    "whatItDoes": "Builds a knowledge graph from documents and uses graph traversal alongside vector search for richer context.",
    "practicalUseCase": "A biomedical assistant follows drug-protein-disease relationship chains that flat vector search would miss.",
    "sourceName": "Microsoft GraphRAG",
    "sourceUrl": "https://microsoft.github.io/graphrag/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Re-ranking with cross-encoders",
    "category": "Retrieval",
    "whatItDoes": "Re-scores initial retrieval candidates using a more accurate cross-encoder model to push the best results to the top.",
    "practicalUseCase": "An e-commerce search returns truly relevant products at rank 1 even when the embedding retriever over-retrieves.",
    "sourceName": "Cohere Rerank",
    "sourceUrl": "https://docs.cohere.com/docs/reranking",
    "verificationLevel": "official"
  },
  {
    "name": "ReAct tool-use prompting",
    "category": "Agent Design",
    "whatItDoes": "Alternates reasoning and actions so the model decides when to call tools and when to answer directly.",
    "practicalUseCase": "A research agent searches the web, inspects results, and synthesises a grounded response.",
    "sourceName": "ReAct Paper",
    "sourceUrl": "https://arxiv.org/abs/2210.03629",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Conversation memory summarisation",
    "category": "Agent Design",
    "whatItDoes": "Compresses prior turns into concise state summaries to preserve context while controlling token growth.",
    "practicalUseCase": "A customer success agent remembers account history over long chats without exceeding context limits.",
    "sourceName": "LangChain Memory Docs",
    "sourceUrl": "https://python.langchain.com/docs/concepts/memory/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Multi-agent orchestration",
    "category": "Agent Design",
    "whatItDoes": "Coordinates specialised agents (planner, coder, reviewer) under an orchestrator for complex parallel workflows.",
    "practicalUseCase": "A software factory spawns separate agents for spec writing, coding, and testing, then merges results.",
    "sourceName": "Anthropic Multi-Agent",
    "sourceUrl": "https://docs.anthropic.com/en/docs/build-with-claude/agents",
    "verificationLevel": "official"
  },
  {
    "name": "Reflection and self-critique loops",
    "category": "Agent Design",
    "whatItDoes": "Has the model review and critique its own output before finalising, catching errors without human review.",
    "practicalUseCase": "A code-writing agent spots its own off-by-one errors after a reflection prompt before submitting the PR.",
    "sourceName": "Reflexion Paper",
    "sourceUrl": "https://arxiv.org/abs/2303.11366",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Parallel agent execution",
    "category": "Agent Design",
    "whatItDoes": "Dispatches independent subtasks to concurrent agents and merges results, cutting wall-clock time dramatically.",
    "practicalUseCase": "A report generator runs five research agents in parallel and assembles their findings in one pass.",
    "sourceName": "Claude Code Superpowers",
    "sourceUrl": "https://github.com/anthropics/claude-code",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Long-horizon task planning",
    "category": "Agent Design",
    "whatItDoes": "Decomposes a high-level goal into an ordered task list that persists across sessions, surviving context resets.",
    "practicalUseCase": "A project agent builds a full SaaS MVP over multiple days by checking off persisted milestones each session.",
    "sourceName": "OpenAI Task Planning",
    "sourceUrl": "https://platform.openai.com/docs/guides/agents",
    "verificationLevel": "official"
  },
  {
    "name": "LLM-as-judge evaluation",
    "category": "Evaluation",
    "whatItDoes": "Uses a capable LLM to score or compare model outputs against a rubric, replacing slow human annotation at scale.",
    "practicalUseCase": "A chat product runs nightly evals where GPT-4o grades helpfulness and safety across 10,000 conversations.",
    "sourceName": "Judging LLM-as-a-Judge",
    "sourceUrl": "https://arxiv.org/abs/2306.05685",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Regression harness for prompts",
    "category": "Evaluation",
    "whatItDoes": "Runs a fixed golden dataset through prompt changes to catch quality regressions before they reach production.",
    "practicalUseCase": "A team ships prompt updates confidently because the CI pipeline fails if accuracy drops more than 2%.",
    "sourceName": "Braintrust Evals",
    "sourceUrl": "https://www.braintrust.dev/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Tracing and observability",
    "category": "Evaluation",
    "whatItDoes": "Records every LLM call, tool invocation, and token count in a structured trace for debugging and cost tracking.",
    "practicalUseCase": "An ops team drills into a user-reported bad answer and sees exactly which retrieval step returned the wrong chunk.",
    "sourceName": "LangSmith",
    "sourceUrl": "https://docs.smith.langchain.com/",
    "verificationLevel": "official"
  },
  {
    "name": "Automated red-teaming",
    "category": "Evaluation",
    "whatItDoes": "Generates adversarial prompts automatically and scores model robustness against jailbreaks and policy violations.",
    "practicalUseCase": "A safety team stress-tests a new model release overnight without hand-crafting thousands of attack prompts.",
    "sourceName": "Anthropic Red Teaming",
    "sourceUrl": "https://www.anthropic.com/research/red-teaming-language-models",
    "verificationLevel": "official"
  },
  {
    "name": "Prompt caching",
    "category": "Cost & Latency",
    "whatItDoes": "Reuses cached prompt prefixes so repeated requests reduce token processing cost and response time.",
    "practicalUseCase": "A multi-turn app with a long system prompt cuts costs when many users share the same context block.",
    "sourceName": "Anthropic Prompt Caching",
    "sourceUrl": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
    "verificationLevel": "official"
  },
  {
    "name": "Batch API processing",
    "category": "Cost & Latency",
    "whatItDoes": "Submits large volumes of offline requests in one batch job to process data more cheaply at scale.",
    "practicalUseCase": "A content team classifies 100,000 product descriptions overnight instead of sending real-time calls.",
    "sourceName": "OpenAI Batch API",
    "sourceUrl": "https://platform.openai.com/docs/guides/batch",
    "verificationLevel": "official"
  },
  {
    "name": "Token budget management",
    "category": "Cost & Latency",
    "whatItDoes": "Sets hard token limits per request and routes to cheaper models when the task doesn't need frontier capability.",
    "practicalUseCase": "A high-volume classifier uses a small model for 90% of requests and escalates to large only for edge cases.",
    "sourceName": "Anthropic Token Counting",
    "sourceUrl": "https://docs.anthropic.com/en/docs/build-with-claude/token-counting",
    "verificationLevel": "official"
  },
  {
    "name": "Intelligent model routing",
    "category": "Cost & Latency",
    "whatItDoes": "Classifies incoming requests by complexity and routes each to the cheapest model that can handle it reliably.",
    "practicalUseCase": "Simple FAQ queries go to Haiku while architectural design questions route to Opus, halving monthly spend.",
    "sourceName": "OpenRouter",
    "sourceUrl": "https://openrouter.ai/docs",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Streaming token responses",
    "category": "UX Engineering",
    "whatItDoes": "Delivers model output incrementally as tokens are generated so users see progress immediately.",
    "practicalUseCase": "A chat UI shows answers in real time to reduce perceived latency on long completions.",
    "sourceName": "OpenAI Streaming Guide",
    "sourceUrl": "https://platform.openai.com/docs/guides/streaming-responses",
    "verificationLevel": "official"
  },
  {
    "name": "Progressive disclosure for AI outputs",
    "category": "UX Engineering",
    "whatItDoes": "Shows a short answer by default with an expandable 'reasoning trace' or 'sources' panel for power users.",
    "practicalUseCase": "A medical app surfaces a concise recommendation first, with the full evidence chain one click away.",
    "sourceName": "Nielsen Norman Group",
    "sourceUrl": "https://www.nngroup.com/articles/progressive-disclosure/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Confidence indicators",
    "category": "UX Engineering",
    "whatItDoes": "Annotates AI outputs with calibrated uncertainty signals so users know when to double-check.",
    "practicalUseCase": "A legal assistant marks low-confidence clauses in red so lawyers focus review effort efficiently.",
    "sourceName": "Anthropic Model Card",
    "sourceUrl": "https://www.anthropic.com/claude",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Output guardrails",
    "category": "Safety",
    "whatItDoes": "Validates or filters model output against policy rules before delivering it to users, blocking harmful content.",
    "practicalUseCase": "A children's platform rejects any response containing violence or adult themes before rendering it.",
    "sourceName": "NVIDIA NeMo Guardrails",
    "sourceUrl": "https://github.com/NVIDIA/NeMo-Guardrails",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Prompt injection defense",
    "category": "Safety",
    "whatItDoes": "Detects and neutralises adversarial instructions embedded in user content that try to hijack the agent.",
    "practicalUseCase": "A web-browsing agent ignores hidden instructions on malicious pages that say 'Ignore previous instructions'.",
    "sourceName": "OWASP LLM Top 10",
    "sourceUrl": "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Constitutional AI / RLAIF",
    "category": "Safety",
    "whatItDoes": "Trains models to critique and revise their own outputs against a set of principles, reducing harmful outputs.",
    "practicalUseCase": "A fine-tuned assistant refuses harmful requests reliably without needing a large human-labelled refusal dataset.",
    "sourceName": "Anthropic Constitutional AI",
    "sourceUrl": "https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback",
    "verificationLevel": "official"
  },
  {
    "name": "Fine-tuning pipelines",
    "category": "MLOps",
    "whatItDoes": "Adapts a base model to a specific domain or task using curated examples, improving accuracy and reducing prompt length.",
    "practicalUseCase": "A legal firm fine-tunes a model on contract language so it drafts clauses in their house style without lengthy prompts.",
    "sourceName": "OpenAI Fine-tuning",
    "sourceUrl": "https://platform.openai.com/docs/guides/fine-tuning",
    "verificationLevel": "official"
  },
  {
    "name": "Prompt version control",
    "category": "MLOps",
    "whatItDoes": "Stores prompts in a versioned registry so teams can roll back, diff, and audit changes like code.",
    "practicalUseCase": "When a prompt update degrades user satisfaction, an engineer rolls back to v3 in one command.",
    "sourceName": "PromptLayer",
    "sourceUrl": "https://promptlayer.com/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "A/B testing models and prompts",
    "category": "MLOps",
    "whatItDoes": "Splits traffic between prompt or model variants and tracks outcome metrics to pick the statistically better option.",
    "practicalUseCase": "A product team discovers that a shorter prompt variant increases task completion rate by 8% before full rollout.",
    "sourceName": "Braintrust",
    "sourceUrl": "https://www.braintrust.dev/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "OpenAPI-to-tool conversion",
    "category": "Integration",
    "whatItDoes": "Transforms OpenAPI specs into callable tool definitions so agents can invoke REST APIs safely.",
    "practicalUseCase": "An operations assistant triggers shipping API endpoints using validated request parameters.",
    "sourceName": "OpenAI Cookbook",
    "sourceUrl": "https://cookbook.openai.com/examples/function_calling_with_an_openapi_spec",
    "verificationLevel": "community-verified"
  },
  {
    "name": "MCP server implementation",
    "category": "Integration",
    "whatItDoes": "Wraps any data source or service as a Model Context Protocol server so AI clients can query it natively.",
    "practicalUseCase": "A team wraps their internal wiki as an MCP server so Claude Code can read it during coding sessions.",
    "sourceName": "MCP Official Docs",
    "sourceUrl": "https://modelcontextprotocol.io/",
    "verificationLevel": "official"
  },
  {
    "name": "Webhook-driven AI pipelines",
    "category": "Integration",
    "whatItDoes": "Triggers AI processing jobs automatically when external events fire, without polling or manual invocation.",
    "practicalUseCase": "A GitHub webhook triggers an AI code review agent on every pull request opened against the main branch.",
    "sourceName": "n8n AI Workflows",
    "sourceUrl": "https://n8n.io/",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Skills packaging (agentskills.io standard)",
    "category": "Harness Engineering",
    "whatItDoes": "Packages reusable agent behaviours as structured markdown skill files with trigger conditions and SOPs.",
    "practicalUseCase": "A team writes one debugging skill and deploys it across Claude Code, Cursor, and Copilot with no changes.",
    "sourceName": "Claude Code Superpowers",
    "sourceUrl": "https://github.com/anthropics/claude-code",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Context injection patterns",
    "category": "Harness Engineering",
    "whatItDoes": "Loads only the minimum relevant context into each agent turn using lazy discovery instead of upfront dumps.",
    "practicalUseCase": "An agent starts each task with a 500-token context and fetches additional tool schemas only when needed.",
    "sourceName": "Harness Engineering Guide",
    "sourceUrl": "https://zhuanlan.zhihu.com/p/2025639164599608541",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Feedback loop design",
    "category": "Harness Engineering",
    "whatItDoes": "Builds explicit success/failure signals back into the agent loop so it can self-correct without human intervention.",
    "practicalUseCase": "A code-writing agent runs its own tests and re-prompts itself on failure until the suite is green.",
    "sourceName": "Hermes Agent",
    "sourceUrl": "https://github.com/NousResearch/hermes-agent",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Self-improving agents",
    "category": "Harness Engineering",
    "whatItDoes": "Agents update their own skill files when they discover a better procedure, creating a compounding improvement loop.",
    "practicalUseCase": "An agent notices its summarisation skill misses bullet lists and patches the skill before the next run.",
    "sourceName": "Hermes Agent",
    "sourceUrl": "https://github.com/NousResearch/hermes-agent",
    "verificationLevel": "community-verified"
  },
  {
    "name": "Harness composition",
    "category": "Harness Engineering",
    "whatItDoes": "Assembles multiple constraint layers (permissions, memory, tools, feedback) into a single deployable agent harness.",
    "practicalUseCase": "A company ships a compliant internal AI assistant by composing an off-the-shelf harness with their security policies.",
    "sourceName": "Harness Engineering Deep Dive",
    "sourceUrl": "https://zhuanlan.zhihu.com/p/2014014859164026634",
    "verificationLevel": "community-verified"
  }
]
```

- [ ] **Step 2: Verify count**

```bash
cat /tmp/fyxai-site/data/skills.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{len(d)} skills'); cats={}; [cats.update({s['category']:cats.get(s['category'],0)+1}) for s in d]; [print(f'  {k}: {v}') for k,v in sorted(cats.items())]"
```

Expected: 42 skills, 9 categories

- [ ] **Step 3: Commit**

```bash
cd /tmp/fyxai-site && git add data/skills.json && git commit -m "data: expand skills.json to 42 hot AI engineering skills (2025-2026)"
```

---

## Task 2: Create utilities.json

**Files:**
- Create: `data/utilities.json`

- [ ] **Step 1: Write utilities.json**

```json
[
  {
    "name": "Cursor",
    "category": "Coding",
    "desc": "AI-first code editor with codebase-aware chat, inline edits, and agent mode. The dominant IDE for AI-assisted development.",
    "url": "https://cursor.com",
    "hot": true
  },
  {
    "name": "Windsurf",
    "category": "Coding",
    "desc": "Agentic IDE by Codeium with Cascade multi-file agent, deep context awareness, and flow state UX.",
    "url": "https://codeium.com/windsurf",
    "hot": true
  },
  {
    "name": "GitHub Copilot",
    "category": "Coding",
    "desc": "Microsoft's AI pair programmer with inline completions, chat, and agent-mode PR automation across all major IDEs.",
    "url": "https://github.com/features/copilot",
    "hot": true
  },
  {
    "name": "v0",
    "category": "Coding",
    "desc": "Vercel's UI generation tool that turns prompts into production-ready React + Tailwind components instantly.",
    "url": "https://v0.dev",
    "hot": true
  },
  {
    "name": "Bolt",
    "category": "Coding",
    "desc": "StackBlitz's browser-based full-stack agent that scaffolds and runs entire apps from a single prompt.",
    "url": "https://bolt.new",
    "hot": true
  },
  {
    "name": "Replit Agent",
    "category": "Coding",
    "desc": "Cloud IDE with an AI agent that builds, runs, deploys, and debugs apps end-to-end in the browser.",
    "url": "https://replit.com",
    "hot": false
  },
  {
    "name": "Devin",
    "category": "Coding",
    "desc": "Cognition's autonomous software engineer that handles full development tasks from issue to merged PR.",
    "url": "https://devin.ai",
    "hot": true
  },
  {
    "name": "Claude Code",
    "category": "Coding",
    "desc": "Anthropic's terminal-native agentic coding tool with skills/harness framework, MCP support, and deep codebase understanding.",
    "url": "https://claude.ai/code",
    "hot": true
  },
  {
    "name": "Perplexity",
    "category": "Research",
    "desc": "AI answer engine with real-time web search, source citations, and deep research mode for comprehensive reports.",
    "url": "https://perplexity.ai",
    "hot": true
  },
  {
    "name": "NotebookLM",
    "category": "Research",
    "desc": "Google's AI research assistant that grounds answers in your uploaded sources (PDFs, docs, slides) with full citations.",
    "url": "https://notebooklm.google",
    "hot": true
  },
  {
    "name": "Elicit",
    "category": "Research",
    "desc": "AI research assistant for academic literature: searches papers, extracts data tables, and synthesises findings.",
    "url": "https://elicit.com",
    "hot": false
  },
  {
    "name": "Consensus",
    "category": "Research",
    "desc": "AI-powered academic search that finds scientific consensus across millions of research papers.",
    "url": "https://consensus.app",
    "hot": false
  },
  {
    "name": "Midjourney",
    "category": "Design",
    "desc": "Leading text-to-image model known for high aesthetic quality, used widely in creative and product design workflows.",
    "url": "https://midjourney.com",
    "hot": true
  },
  {
    "name": "Runway",
    "category": "Design",
    "desc": "AI video generation and editing platform with text-to-video, inpainting, and motion brush tools.",
    "url": "https://runwayml.com",
    "hot": true
  },
  {
    "name": "Gamma",
    "category": "Design",
    "desc": "AI presentation and document builder that generates beautiful decks from a prompt or outline in seconds.",
    "url": "https://gamma.app",
    "hot": true
  },
  {
    "name": "Figma AI",
    "category": "Design",
    "desc": "AI features inside Figma: auto-layout suggestions, design copy generation, and prototype-from-prompt.",
    "url": "https://figma.com",
    "hot": false
  },
  {
    "name": "Notion AI",
    "category": "Productivity",
    "desc": "AI writing and Q&A assistant built into Notion workspaces — summarise, translate, draft, and query your docs.",
    "url": "https://notion.so/product/ai",
    "hot": true
  },
  {
    "name": "Claude",
    "category": "Productivity",
    "desc": "Anthropic's frontier AI assistant with long context, deep reasoning, Projects memory, and strong writing/code skills.",
    "url": "https://claude.ai",
    "hot": true
  },
  {
    "name": "ChatGPT",
    "category": "Productivity",
    "desc": "OpenAI's flagship AI assistant with GPT-4o, voice mode, image generation, and plugin ecosystem.",
    "url": "https://chatgpt.com",
    "hot": true
  },
  {
    "name": "Gemini",
    "category": "Productivity",
    "desc": "Google's multimodal AI assistant with 1M token context, deep Google Workspace integration, and Gemini 2.0 capabilities.",
    "url": "https://gemini.google.com",
    "hot": true
  },
  {
    "name": "Vercel",
    "category": "Infrastructure",
    "desc": "Deployment platform for Next.js and frontend apps with AI SDK, edge functions, and instant preview URLs.",
    "url": "https://vercel.com",
    "hot": true
  },
  {
    "name": "Supabase",
    "category": "Infrastructure",
    "desc": "Open-source Firebase alternative with Postgres, vector search (pgvector), edge functions, and AI assistant.",
    "url": "https://supabase.com",
    "hot": true
  },
  {
    "name": "Modal",
    "category": "Infrastructure",
    "desc": "Serverless GPU cloud for running AI model inference, fine-tuning jobs, and batch pipelines with Python-native API.",
    "url": "https://modal.com",
    "hot": true
  },
  {
    "name": "Replicate",
    "category": "Infrastructure",
    "desc": "Run open-source AI models via API — Llama, Stable Diffusion, Whisper, and hundreds more with one-line calls.",
    "url": "https://replicate.com",
    "hot": false
  },
  {
    "name": "Cloudflare AI",
    "category": "Infrastructure",
    "desc": "Run inference at the edge globally with Workers AI, plus vector DB (Vectorize) and AI Gateway for cost tracking.",
    "url": "https://developers.cloudflare.com/ai",
    "hot": false
  }
]
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add data/utilities.json && git commit -m "data: add utilities.json with 25 curated hot AI tools"
```

---

## Task 3: Create Badge, FilterBar, SectionHeader components

**Files:**
- Create: `components/Badge.jsx`
- Create: `components/FilterBar.jsx`
- Create: `components/SectionHeader.jsx`
- Modify: `components/Cards.jsx` (export re-check, no breaking changes)

- [ ] **Step 1: Write Badge.jsx**

```jsx
const variants = {
  default:   'border-slate-500/40 bg-slate-500/10 text-slate-300',
  official:  'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  community: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200',
  hot:       'border-orange-400/40 bg-orange-500/10 text-orange-200',
  category:  'border-violet-400/40 bg-violet-500/10 text-violet-200',
  stars:     'border-amber-400/40 bg-amber-500/10 text-amber-200',
};

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variants[variant] ?? variants.default}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Write FilterBar.jsx**

```jsx
'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export function FilterBar({ items, categories, filterFn, children }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => items.filter((item) => filterFn(item, query, active)),
    [items, query, active, filterFn],
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-cyan-400/20 bg-card/60 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                active === cat
                  ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-200'
                  : 'border-slate-600/40 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {children(filtered)}
    </>
  );
}
```

- [ ] **Step 3: Write SectionHeader.jsx**

```jsx
export function SectionHeader({ title, count, description }) {
  return (
    <div className="mb-7">
      <div className="flex items-baseline gap-3">
        <h1 className="text-3xl font-bold text-cyan-200">{title}</h1>
        {count != null && (
          <span className="rounded-full border border-cyan-400/20 px-2 py-0.5 text-xs text-slate-400">
            {count}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /tmp/fyxai-site && git add components/Badge.jsx components/FilterBar.jsx components/SectionHeader.jsx && git commit -m "feat: add Badge, FilterBar, SectionHeader components"
```

---

## Task 4: Update globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append filter chip and card animation styles**

Add to end of `app/globals.css`:

```css
/* filter chip active glow */
button[class*="bg-cyan-500/15"] {
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.12);
}

/* card hover border glow */
.card {
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.18), 0 0 30px rgba(34, 211, 238, 0.08);
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add app/globals.css && git commit -m "style: add filter chip glow and card hover animation"
```

---

## Task 5: Update Skills page

**Files:**
- Modify: `app/skills/page.jsx`

- [ ] **Step 1: Rewrite skills/page.jsx**

```jsx
import skills from '../../data/skills.json';
import { CardGrid, InfoCard } from '../../components/Cards';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'AI Skills | FYXAI' };

const CATEGORIES = [
  'LLM Integration', 'Retrieval', 'Agent Design', 'Evaluation',
  'Cost & Latency', 'UX Engineering', 'Safety', 'MLOps',
  'Integration', 'Harness Engineering',
];

function skillFilter(item, query, category) {
  const q = query.toLowerCase();
  const matchesQuery =
    !q ||
    item.name.toLowerCase().includes(q) ||
    item.whatItDoes.toLowerCase().includes(q) ||
    item.practicalUseCase.toLowerCase().includes(q);
  const matchesCategory = category === 'All' || item.category === category;
  return matchesQuery && matchesCategory;
}

export default function SkillsPage() {
  return (
    <section>
      <SectionHeader
        title="AI Engineering Skills"
        count={skills.length}
        description="Production-ready capabilities with verifiable documentation. Covers LLM integration, retrieval, agents, evaluation, safety, and harness engineering."
      />

      <FilterBar items={skills} categories={CATEGORIES} filterFn={skillFilter}>
        {(filtered) => (
          <CardGrid>
            {filtered.map((item) => (
              <InfoCard key={item.name} title={item.name} href={item.sourceUrl}>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant="category">{item.category}</Badge>
                  <Badge variant={item.verificationLevel === 'official' ? 'official' : 'community'}>
                    {item.verificationLevel}
                  </Badge>
                </div>
                <p className="text-sm text-slate-200">{item.whatItDoes}</p>
                <p className="mt-3 text-xs text-slate-400">↳ {item.practicalUseCase}</p>
                <p className="mt-3 text-xs text-slate-500">via {item.sourceName}</p>
              </InfoCard>
            ))}
          </CardGrid>
        )}
      </FilterBar>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add app/skills/page.jsx && git commit -m "feat: skills page with FilterBar, Badge, and 42 entries"
```

---

## Task 6: Update MCP page

**Files:**
- Modify: `app/mcp/page.jsx`

- [ ] **Step 1: Rewrite mcp/page.jsx**

```jsx
import mcp from '../../data/mcp.json';
import { CardGrid, InfoCard } from '../../components/Cards';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'MCP Ecosystem | FYXAI' };

const SOURCES = ['official', 'community'];

function mcpFilter(item, query, source) {
  const q = query.toLowerCase();
  const matchesQuery =
    !q ||
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q);
  const matchesSource = source === 'All' || item.source === source;
  return matchesQuery && matchesSource;
}

const sortedMcp = [...mcp].sort((a, b) => (b.stars || 0) - (a.stars || 0));

export default function McpPage() {
  return (
    <section>
      <SectionHeader
        title="MCP Ecosystem"
        count={mcp.length}
        description="Model Context Protocol servers and SDKs. Official repos first, sorted by GitHub stars. Auto-verified daily."
      />

      <FilterBar items={sortedMcp} categories={SOURCES} filterFn={mcpFilter}>
        {(filtered) => (
          <CardGrid>
            {filtered.map((item) => (
              <InfoCard key={item.repo} title={item.name} href={item.repo}>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant={item.source === 'official' ? 'official' : 'community'}>
                    {item.source}
                  </Badge>
                  {item.stars > 0 && (
                    <Badge variant="stars">★ {item.stars.toLocaleString()}</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-300">{item.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Updated {item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, 10) : '—'}
                </p>
              </InfoCard>
            ))}
          </CardGrid>
        )}
      </FilterBar>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add app/mcp/page.jsx && git commit -m "feat: MCP page with FilterBar, stars badge, stars-sorted"
```

---

## Task 7: Rebuild Utilities page (dual zone)

**Files:**
- Rewrite: `app/utilities/page.jsx`

- [ ] **Step 1: Rewrite utilities/page.jsx**

```jsx
import Link from 'next/link';
import { ExternalLink, Code2, Microscope, Palette, Zap, Server } from 'lucide-react';
import utilities from '../../data/utilities.json';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'Utilities | FYXAI' };

const CATEGORY_ICONS = {
  Coding:       Code2,
  Research:     Microscope,
  Design:       Palette,
  Productivity: Zap,
  Infrastructure: Server,
};

const AI_TOOL_CATEGORIES = ['Coding', 'Research', 'Design', 'Productivity', 'Infrastructure'];

function toolFilter(item, query, category) {
  const q = query.toLowerCase();
  const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
  const matchesCategory = category === 'All' || item.category === category;
  return matchesQuery && matchesCategory;
}

const devTools = [
  {
    title: 'Token Calculator',
    desc: 'Estimate token counts for prompts across GPT-4o, Claude, and Gemini. Useful for budgeting context windows.',
    href: 'https://platform.openai.com/tokenizer',
    external: true,
  },
  {
    title: 'AI API Pricing Comparison',
    desc: 'Compare input/output token costs across OpenAI, Anthropic, Google, and open-source models.',
    href: 'https://artificialanalysis.ai/models',
    external: true,
  },
  {
    title: 'Prompt Template Library',
    desc: 'Browse community-curated prompt templates for coding, research, summarisation, and data extraction.',
    href: 'https://promptbase.com',
    external: true,
  },
  {
    title: 'Model Benchmarks',
    desc: 'Up-to-date MMLU, HumanEval, MATH, and GPQA leaderboards comparing frontier and open-source models.',
    href: 'https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard',
    external: true,
  },
];

export default function UtilitiesPage() {
  return (
    <section className="space-y-12">
      {/* Zone 1: Hot AI Tools */}
      <div>
        <SectionHeader
          title="Hot AI Tools"
          count={utilities.length}
          description="Trending tools across coding, research, design, productivity, and infrastructure — curated for AI builders."
        />

        <FilterBar items={utilities} categories={AI_TOOL_CATEGORIES} filterFn={toolFilter}>
          {(filtered) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tool) => {
                const Icon = CATEGORY_ICONS[tool.category] ?? Zap;
                return (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card group flex flex-col gap-3 transition hover:-translate-y-1 hover:border-cyan-300/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="shrink-0 text-cyan-300" />
                        <span className="font-semibold text-cyan-100">{tool.name}</span>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {tool.hot && <Badge variant="hot">🔥 Hot</Badge>}
                        <Badge variant="category">{tool.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{tool.desc}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300">
                      Open <ExternalLink size={11} />
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </FilterBar>
      </div>

      {/* Zone 2: Developer Tools */}
      <div>
        <SectionHeader
          title="Developer Tools"
          description="Quick-access resources for prompt engineering, model selection, and API budgeting."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {devTools.map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="card group flex flex-col gap-2 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <h3 className="font-semibold text-cyan-100">{tool.title}</h3>
              <p className="text-sm text-slate-300">{tool.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300">
                Open <ExternalLink size={11} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add app/utilities/page.jsx && git commit -m "feat: utilities page dual-zone — AI tools nav + dev tools"
```

---

## Task 8: Create /harness page

**Files:**
- Create: `app/harness/page.jsx`

- [ ] **Step 1: Write app/harness/page.jsx**

```jsx
import { Cpu, GitBranch, RefreshCw, Brain, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'Harness Engineering | FYXAI' };

const concepts = [
  {
    icon: Layers,
    title: 'Skills Packaging',
    desc: 'Structured markdown files with trigger conditions, SOPs, and reference materials. Write once, deploy to Claude Code, Cursor, Copilot, and 10+ other tools via the agentskills.io standard.',
    badge: 'Standard',
  },
  {
    icon: Brain,
    title: 'Context Injection',
    desc: 'Load only the minimum context per agent turn using progressive disclosure. Fetch tool schemas and skill details on demand instead of dumping everything at startup.',
    badge: 'Pattern',
  },
  {
    icon: RefreshCw,
    title: 'Feedback Loops',
    desc: 'Build explicit success/failure signals back into the agent cycle. A code agent that runs its own tests and re-prompts on failure needs no human intervention.',
    badge: 'Pattern',
  },
  {
    icon: GitBranch,
    title: 'Self-Improving Agents',
    desc: 'Agents that update their own skill files when they find a better procedure — creating a compounding improvement loop across sessions.',
    badge: 'Advanced',
  },
  {
    icon: Cpu,
    title: 'Harness Composition',
    desc: 'Assemble permission layers, memory backends, tool registries, and feedback loops into a single deployable agent harness. The infrastructure layer around your model.',
    badge: 'Architecture',
  },
];

const resources = [
  { title: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/', desc: 'Official MCP spec and SDK docs' },
  { title: 'Hermes Agent (Nous Research)', url: 'https://github.com/NousResearch/hermes-agent', desc: 'Open-source self-improving agent framework — 17K stars' },
  { title: 'Harness Engineering (知乎)', url: 'https://zhuanlan.zhihu.com/p/2025639164599608541', desc: 'Deep dive into Harness Engineering practices' },
  { title: 'Claude Code', url: 'https://claude.ai/code', desc: 'Anthropic\'s agentic CLI with skills and harness support' },
  { title: 'agentskills.io', url: 'https://agentskills.io', desc: 'Cross-framework agent skills standard' },
];

export default function HarnessPage() {
  return (
    <section className="space-y-12">
      {/* Hero */}
      <div className="card mx-auto max-w-4xl">
        <Badge variant="category">2026 Hot Topic</Badge>
        <h1 className="mt-4 text-3xl font-bold text-cyan-200 md:text-4xl">Harness Engineering</h1>
        <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">
          Harness Engineering (驾驭工程) is the practice of designing the constraint environment, feedback loops, and control systems that wrap an AI agent — so it runs reliably without going off the rails.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          The name comes from horse tack: the harness doesn't slow the horse down — it lets it run fast in the right direction. In 2026, the model is no longer the hard part. The harness is.
        </p>
      </div>

      {/* Core Concepts */}
      <div>
        <SectionHeader
          title="Core Concepts"
          count={concepts.length}
          description="The building blocks of a production agent harness."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {concepts.map(({ icon: Icon, title, desc, badge }) => (
            <article key={title} className="card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Icon size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                <Badge variant="community">{badge}</Badge>
              </div>
              <h3 className="font-semibold text-cyan-100">{title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Agent Skills Ecosystem */}
      <div className="card">
        <h2 className="mb-2 text-xl font-semibold text-cyan-200">Agent Skills Ecosystem</h2>
        <p className="mb-6 text-sm text-slate-400">
          Skills are portable, structured knowledge packages. Write a skill once and deploy it across every major AI coding tool.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'].map((tool) => (
            <div key={tool} className="rounded-xl border border-cyan-400/15 bg-slate-950/40 px-4 py-3 text-center text-sm text-slate-300">
              {tool}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Compatible via the agentskills.io open standard — skills are plain markdown, no vendor lock-in.
        </p>
      </div>

      {/* Resources */}
      <div>
        <SectionHeader title="Resources" description="Specs, frameworks, and deep-dive reading." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="card group flex items-start justify-between gap-4 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <div>
                <p className="font-medium text-cyan-100">{r.title}</p>
                <p className="mt-1 text-sm text-slate-400">{r.desc}</p>
              </div>
              <ExternalLink size={14} className="mt-1 shrink-0 text-slate-500 group-hover:text-cyan-400" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add app/harness/page.jsx && git commit -m "feat: add /harness page — Harness Engineering + Agent Skills"
```

---

## Task 9: Update Navbar

**Files:**
- Modify: `components/Navbar.jsx`

- [ ] **Step 1: Add Harness link to Navbar**

Replace the `links` array in `components/Navbar.jsx`:

```jsx
import Link from 'next/link';
import { Home, Newspaper, Cpu, Sparkles, FolderKanban, ScrollText, Wrench, GitBranch } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/mcp', label: 'MCP', icon: Cpu },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/harness', label: 'Harness', icon: GitBranch },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/prompts', label: 'Prompts', icon: ScrollText },
  { href: '/utilities', label: 'Utilities', icon: Wrench },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-cyan-400/20 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-wide text-cyan-300">FYXAI</Link>
        <div className="flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 px-3 py-2 text-sm text-slate-200 hover:border-cyan-300 hover:text-cyan-300">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /tmp/fyxai-site && git add components/Navbar.jsx && git commit -m "feat: add Harness link to Navbar"
```

---

## Task 10: GitHub Actions auto-update workflow

**Files:**
- Create: `.github/workflows/auto-update.yml`

- [ ] **Step 1: Check existing .github directory**

```bash
ls /tmp/fyxai-site/.github/
```

- [ ] **Step 2: Write .github/workflows/auto-update.yml**

```yaml
name: Auto Update Data

on:
  schedule:
    - cron: '0 6 * * *'   # daily at 06:00 UTC
  workflow_dispatch:        # manual trigger

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install deps
        run: npm ci

      - name: Update MCP + news data
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/update-data.mjs

      - name: Commit if changed
        run: |
          git config user.name "fyxai-bot"
          git config user.email "bot@fyxai.github.io"
          git add data/
          git diff --cached --quiet || git commit -m "data: auto-update $(date -u +%Y-%m-%d)"
          git push
```

- [ ] **Step 3: Commit**

```bash
cd /tmp/fyxai-site && mkdir -p .github/workflows && git add .github/workflows/auto-update.yml && git commit -m "ci: daily auto-update GitHub Actions workflow"
```

---

## Task 11: Build verification and push

**Files:** None

- [ ] **Step 1: Install dependencies**

```bash
cd /tmp/fyxai-site && npm install
```

- [ ] **Step 2: Run build**

```bash
cd /tmp/fyxai-site && npm run build 2>&1 | tail -20
```

Expected: `Export successful` with no errors. If build errors appear, fix them before pushing.

- [ ] **Step 3: Fix any build errors**

Common issues:
- `FilterBar` uses `useState` — must have `'use client'` at top of file ✓ (already included)
- `sortedMcp` is created outside component — Next.js static export requires data to be importable server-side ✓
- `utilities.json` missing → build fails → verify file exists at `data/utilities.json` ✓

- [ ] **Step 4: Push to GitHub**

```bash
cd /tmp/fyxai-site && git push origin main
```

- [ ] **Step 5: Verify deployment**

Wait ~2 minutes for GitHub Pages to rebuild, then open `https://fyxai.github.io` and verify:
- Skills page has search + category filter chips working
- MCP page shows stars sorted, no Chinese text
- Utilities page has two zones (Hot AI Tools + Developer Tools)
- `/harness` page loads with concept cards
- Navbar shows Harness link
