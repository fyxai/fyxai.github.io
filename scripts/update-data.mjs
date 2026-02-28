import { readFile, writeFile } from 'node:fs/promises';

const DATA_DIR = new URL('../data/', import.meta.url);

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'fyxai-autonomous-updater/1.0', ...(opts.headers || {}) },
      ...opts,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res;
  } catch (error) {
    console.warn(`Fetch failed for ${url}:`, error.message);
    return null;
  }
}

function stripHtml(input = '') {
  return input
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRssItems(xml, source) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items.map((item) => {
    const get = (tag) => {
      const hit = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'));
      return hit ? stripHtml(hit[1]) : '';
    };
    return {
      title: get('title'),
      url: get('link'),
      summary: get('description').slice(0, 220),
      publishedAt: get('pubDate') || new Date().toISOString(),
      source,
    };
  }).filter((x) => x.title && x.url);
}

async function updateNews() {
  const feeds = [
    ['https://feeds.feedburner.com/oreilly/radar/atom', 'OReilly Radar'],
    ['https://www.artificialintelligence-news.com/feed/', 'AI News'],
    ['https://venturebeat.com/category/ai/feed/', 'VentureBeat AI'],
  ];

  let news = [];
  for (const [url, source] of feeds) {
    const res = await safeFetch(url);
    if (!res) continue;
    const xml = await res.text();
    news.push(...parseRssItems(xml, source));
  }

  const unique = [];
  const seen = new Set();
  for (const item of news) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
    if (unique.length >= 10) break;
  }

  if (unique.length) {
    await writeFile(new URL('news.json', DATA_DIR), `${JSON.stringify(unique, null, 2)}\n`);
    console.log(`news.json updated with ${unique.length} items`);
  }
}

async function updateMcp() {
  const file = new URL('mcp.json', DATA_DIR);
  const current = JSON.parse(await readFile(file, 'utf8'));
  const seen = new Set(current.map((x) => x.repo));

  const query = encodeURIComponent('model context protocol language:TypeScript stars:>5');
  const url = `https://api.github.com/search/repositories?q=${query}&sort=updated&order=desc&per_page=10`;
  const res = await safeFetch(url, { headers: { accept: 'application/vnd.github+json' } });
  if (!res) return;

  const body = await res.json();
  const additions = [];
  for (const repo of body.items || []) {
    if (seen.has(repo.html_url)) continue;
    additions.push({
      name: repo.full_name,
      repo: repo.html_url,
      description: repo.description || 'MCP repository discovered by automation.',
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    });
    seen.add(repo.html_url);
    if (additions.length >= 5) break;
  }

  if (additions.length >= 3) {
    const merged = [...additions, ...current].slice(0, 60);
    await writeFile(file, `${JSON.stringify(merged, null, 2)}\n`);
    console.log(`mcp.json appended with ${additions.length} repos`);
  }
}

function inferSkill(repo) {
  const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
  const rules = [
    ['voice', 'Realtime multimodal voice interfaces'],
    ['agent', 'Autonomous agent coordination'],
    ['rag', 'Retrieval-augmented reasoning'],
    ['vision', 'Vision-language perception'],
    ['eval', 'Continuous AI evaluation'],
    ['safety', 'Policy-constrained action planning'],
    ['workflow', 'Adaptive workflow orchestration'],
  ];
  for (const [token, label] of rules) {
    if (text.includes(token)) return label;
  }
  return null;
}

async function updateSkills() {
  const file = new URL('skills.json', DATA_DIR);
  const current = JSON.parse(await readFile(file, 'utf8'));
  const existing = new Set(current.map((x) => x.name));

  const q = encodeURIComponent('ai agent framework language:python stars:>20 pushed:>2025-01-01');
  const res = await safeFetch(`https://api.github.com/search/repositories?q=${q}&sort=updated&order=desc&per_page=15`, {
    headers: { accept: 'application/vnd.github+json' },
  });
  if (!res) return;

  const data = await res.json();
  const additions = [];
  for (const repo of data.items || []) {
    const skillName = inferSkill(repo);
    if (!skillName || existing.has(skillName)) continue;
    additions.push({
      name: skillName,
      category: 'AI Capability',
      description: `Emergent capability inferred from active OSS signal: ${repo.full_name}.`,
      signal: `GitHub repo activity (${repo.html_url})`,
      url: repo.html_url,
    });
    existing.add(skillName);
    if (additions.length >= 3) break;
  }

  if (additions.length) {
    const merged = [...additions, ...current].slice(0, 40);
    await writeFile(file, `${JSON.stringify(merged, null, 2)}\n`);
    console.log(`skills.json updated with ${additions.length} new signals`);
  }
}

async function githubRepoCandidates(query) {
  const q = encodeURIComponent(query);
  const res = await safeFetch(`https://api.github.com/search/repositories?q=${q}&sort=updated&order=desc&per_page=5`, {
    headers: { accept: 'application/vnd.github+json' },
  });
  if (!res) return [];
  const data = await res.json();
  return (data.items || []).slice(0, 5).map((r) => ({
    title: r.full_name,
    url: r.html_url,
    stars: r.stargazers_count,
    updatedAt: r.updated_at,
  }));
}

async function loadReferencePrompt(url) {
  const res = await safeFetch(url);
  if (!res) return 'Failed to load reference prompt snapshot at this cycle.';
  const text = await res.text();
  return text.replace(/\r/g, '').trim().slice(0, 900);
}

async function updatePrompts() {
  const tools = [
    {
      name: 'Claude Code',
      referenceSource: {
        label: 'x1xhlol/system-prompts-and-models-of-ai-tools',
        url: 'https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Anthropic/Claude%20Code%202.0.txt',
      },
      searchQuery: 'claude code system prompt',
      pinnedCandidates: [
        {
          title: 'Piebald-AI/claude-code-system-prompts',
          url: 'https://github.com/Piebald-AI/claude-code-system-prompts',
          stars: null,
          updatedAt: null,
        },
      ],
    },
    {
      name: 'Kiro',
      referenceSource: {
        label: 'x1xhlol/system-prompts-and-models-of-ai-tools',
        url: 'https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Kiro/Vibe_Prompt.txt',
      },
      searchQuery: 'Kiro IDE system prompt',
      pinnedCandidates: [],
    },
    {
      name: 'Antigravity',
      referenceSource: {
        label: 'x1xhlol/system-prompts-and-models-of-ai-tools',
        url: 'https://raw.githubusercontent.com/x1xhlol/system-prompts-and-models-of-ai-tools/main/Google/Antigravity/Fast%20Prompt.txt',
      },
      searchQuery: 'Google Antigravity prompt',
      pinnedCandidates: [
        {
          title: 'Google Antigravity full system prompt (gist)',
          url: 'https://gist.github.com/anthfgreco/87718fbbf313bcf7f5ca3f36fedb372a',
          stars: null,
          updatedAt: null,
        },
      ],
    },
  ];

  const rows = [];
  for (const tool of tools) {
    const [referenceExcerpt, candidates] = await Promise.all([
      loadReferencePrompt(tool.referenceSource.url),
      githubRepoCandidates(tool.searchQuery),
    ]);
    const merged = [...tool.pinnedCandidates, ...candidates]
      .filter((x, idx, arr) => arr.findIndex((y) => y.url === x.url) === idx)
      .slice(0, 6);

    rows.push({
      name: tool.name,
      updatedAt: new Date().toISOString(),
      referenceSource: tool.referenceSource,
      referenceExcerpt,
      latestCandidates: merged,
    });
  }

  await writeFile(new URL('prompts.json', DATA_DIR), `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`prompts.json refreshed with ${rows.length} tools`);
}

await updateNews();
await updateMcp();
await updateSkills();
await updatePrompts();
