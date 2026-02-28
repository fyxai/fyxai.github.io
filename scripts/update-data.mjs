import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

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

function getTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'));
  return m ? stripHtml(m[1]) : '';
}

function parseFeedItems(xml, source) {
  const out = [];

  // RSS <item>
  const rssItems = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  for (const item of rssItems) {
    const title = getTag(item, 'title');
    const url = getTag(item, 'link');
    const summary = getTag(item, 'description') || getTag(item, 'content:encoded');
    const publishedAt = getTag(item, 'pubDate') || getTag(item, 'dc:date') || new Date().toISOString();
    if (title && url) out.push({ title, url, summary: summary.slice(0, 220), publishedAt, source });
  }

  // Atom <entry>
  const atomEntries = [...xml.matchAll(/<entry[\s\S]*?>([\s\S]*?)<\/entry>/gi)].map((m) => m[1]);
  for (const entry of atomEntries) {
    const title = getTag(entry, 'title');
    const linkHref = (entry.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i) || [])[1] || '';
    const url = linkHref || getTag(entry, 'link');
    const summary = getTag(entry, 'summary') || getTag(entry, 'content');
    const publishedAt = getTag(entry, 'updated') || getTag(entry, 'published') || new Date().toISOString();
    if (title && url) out.push({ title, url, summary: summary.slice(0, 220), publishedAt, source });
  }

  return out;
}

async function updateNews() {
  const feeds = [
    ['https://news.google.com/rss/search?q=AI+when:1d&hl=en-US&gl=US&ceid=US:en', 'Google News AI'],
    ['https://techcrunch.com/tag/artificial-intelligence/feed/', 'TechCrunch AI'],
    ['https://www.artificialintelligence-news.com/feed/', 'AI News'],
    ['https://www.oreilly.com/radar/feed/', 'OReilly Radar'],
    ['https://venturebeat.com/ai/feed/', 'VentureBeat AI'],
  ];

  let news = [];
  for (const [url, source] of feeds) {
    const res = await safeFetch(url);
    if (!res) continue;
    const xml = await res.text();
    news.push(...parseFeedItems(xml, source));
  }

  const unique = [];
  const seen = new Set();
  for (const item of news) {
    const key = item.url.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const top10 = unique.slice(0, 10);

  if (top10.length) {
    await writeFile(new URL('news.json', DATA_DIR), `${JSON.stringify(top10, null, 2)}\n`);
    console.log(`news.json updated with ${top10.length} items`);
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

function parseClawhubSearch(raw, category) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || /^[a-z0-9]/i.test(line))
    .map((line) => line.replace(/^-\s*/, ''))
    .filter((line) => !line.toLowerCase().startsWith('searching'))
    .map((line) => {
      const m = line.match(/^([^\s]+)\s+(.*?)\s+\(([-0-9.]+)\)$/);
      if (!m) return null;
      return {
        slug: m[1],
        title: m[2].trim(),
        score: Number(m[3]),
        category,
        url: `https://clawhub.ai/skills/${m[1]}`,
      };
    })
    .filter(Boolean);
}

async function updateClawhubWeekly() {
  const queries = [
    { q: 'automation', category: 'Hot Skills' },
    { q: 'monitoring', category: 'New & Rising' },
    { q: 'productivity', category: 'Builder Picks' },
  ];

  const all = [];
  for (const item of queries) {
    try {
      const raw = execSync(`clawhub --registry https://clawhub.ai search "${item.q}" --limit 8`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      all.push(...parseClawhubSearch(raw, item.category));
    } catch (e) {
      console.warn(`clawhub search failed for ${item.q}:`, e.message);
    }
  }

  const merged = [];
  const seen = new Set();
  for (const row of all) {
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    merged.push(row);
  }

  const out = {
    updatedAt: new Date().toISOString(),
    sections: [
      {
        name: 'Hot Skills',
        items: merged.filter((x) => x.category === 'Hot Skills').slice(0, 5),
      },
      {
        name: 'New & Rising',
        items: merged.filter((x) => x.category === 'New & Rising').slice(0, 5),
      },
      {
        name: 'Builder Picks',
        items: merged.filter((x) => x.category === 'Builder Picks').slice(0, 5),
      },
    ],
    buzzwords: ['agentic workflows', 'mcp', 'automation', 'monitoring', 'productivity'],
  };

  const hasData = out.sections.some((s) => s.items.length > 0);
  if (hasData) {
    await writeFile(new URL('clawhub.json', DATA_DIR), `${JSON.stringify(out, null, 2)}\n`);
    console.log('clawhub.json refreshed');
  }
}

await updateNews();
await updateMcp();
await updateSkills();
await updatePrompts();
await updateClawhubWeekly();
