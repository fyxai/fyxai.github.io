import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';

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

  const rssItems = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  for (const item of rssItems) {
    const title = getTag(item, 'title');
    const url = getTag(item, 'link');
    const summary = getTag(item, 'description') || getTag(item, 'content:encoded');
    const publishedAt = getTag(item, 'pubDate') || getTag(item, 'dc:date') || new Date().toISOString();
    if (title && url) out.push({ title, url, summary: summary.slice(0, 220), publishedAt, source });
  }

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

function hashText(input) {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}

function scoreCandidate({ text, sourceType, tool }) {
  const normalized = String(text || '').toLowerCase();
  const keywords = [tool, 'system prompt', 'instructions', 'code', 'coding', 'cli', 'assistant', 'agent'];
  const keywordHits = keywords.reduce((acc, k) => acc + (normalized.includes(k.toLowerCase()) ? 1 : 0), 0);
  const lengthScore = Math.min(22, Math.floor((normalized.length || 0) / 500));
  const typeScore = sourceType === 'official-doc' ? 28 : sourceType === 'official-repo' ? 24 : 16;
  const keywordScore = Math.min(40, keywordHits * 6);
  const codingScore = /code|coding|cli|agent/.test(normalized) ? 10 : 0;
  return Math.max(0, Math.min(100, typeScore + lengthScore + keywordScore + codingScore));
}

function summarizeSource(candidates) {
  const ok = candidates.filter((c) => c.ok);
  if (!ok.length) return 'No live sources available in this cycle; previous snapshot retained.';
  const avg = Math.round(ok.reduce((a, c) => a + c.confidence, 0) / ok.length);
  const top = ok
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2)
    .map((c) => c.label)
    .join(' + ');
  return `Scored ${ok.length}/${candidates.length} live sources, selected highest-confidence signal (${top}); average confidence ${avg}%.`;
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

    let oldArchive = [];
    try {
      oldArchive = JSON.parse(await readFile(new URL('news-archive.json', DATA_DIR), 'utf8'));
    } catch {}

    const merged = [];
    const seenArchive = new Set();
    for (const item of [...top10, ...oldArchive]) {
      const key = (item.url || '').split('?')[0];
      if (!key || seenArchive.has(key)) continue;
      seenArchive.add(key);
      merged.push(item);
    }

    merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const capped = merged.slice(0, 500);
    await writeFile(new URL('news-archive.json', DATA_DIR), `${JSON.stringify(capped, null, 2)}\n`);
    console.log(`news-archive.json updated with ${capped.length} items`);
  }
}

async function githubSearchRepos(query, perPage = 30) {
  const q = encodeURIComponent(query);
  const res = await safeFetch(`https://api.github.com/search/repositories?q=${q}&sort=updated&order=desc&per_page=${perPage}`, {
    headers: { accept: 'application/vnd.github+json' },
  });
  if (!res) return [];
  const json = await res.json();
  return json.items || [];
}

async function updateMcp() {
  const file = new URL('mcp.json', DATA_DIR);

  const canonical = await githubSearchRepos('org:modelcontextprotocol mcp in:readme,name,description', 25);
  const ecosystem = await githubSearchRepos('"model context protocol" mcp server in:readme,name,description stars:>3', 40);

  const mergedMap = new Map();
  for (const repo of [...canonical, ...ecosystem]) {
    if (!repo?.html_url || !repo?.full_name) continue;
    const key = repo.html_url.toLowerCase();
    if (mergedMap.has(key)) continue;
    mergedMap.set(key, {
      name: repo.full_name,
      repo: repo.html_url,
      description: (repo.description || 'MCP server discovered by autonomous scanner.').slice(0, 220),
      stars: repo.stargazers_count || 0,
      updatedAt: repo.updated_at,
      verifiedAt: new Date().toISOString(),
      source: repo.owner?.login === 'modelcontextprotocol' ? 'official' : 'community',
    });
  }

  const rows = [...mergedMap.values()]
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === 'official' ? -1 : 1;
      if ((b.stars || 0) !== (a.stars || 0)) return (b.stars || 0) - (a.stars || 0);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    })
    .slice(0, 60);

  if (rows.length < 20) throw new Error(`mcp.json quality guard failed: only ${rows.length} healthy repos`);

  await writeFile(file, `${JSON.stringify(rows, null, 2)}\n`);
  console.log(`mcp.json rebuilt with ${rows.length} verified MCP repos`);
}

const SKILL_REQUIRED_FIELDS = [
  'name',
  'category',
  'whatItDoes',
  'practicalUseCase',
  'sourceName',
  'sourceUrl',
  'verificationLevel',
];

const VAGUE_SKILL_TERMS = [
  'agentic',
  'synergy',
  'future-ready',
  'next-gen',
  'revolutionary',
  'cutting-edge',
  'emergent capability',
  'autonomous',
  'ai capability',
];

function isActionableSkill(skill) {
  if (!skill || typeof skill !== 'object') return false;

  for (const key of SKILL_REQUIRED_FIELDS) {
    if (!skill[key] || typeof skill[key] !== 'string') return false;
  }

  if (!['official', 'community-verified'].includes(skill.verificationLevel)) return false;

  const lowerName = skill.name.toLowerCase();
  if (VAGUE_SKILL_TERMS.some((term) => lowerName.includes(term))) return false;

  const sentenceLike = (value) => value.includes('.') && value.length >= 35;
  if (!sentenceLike(skill.whatItDoes) || !sentenceLike(skill.practicalUseCase)) return false;

  try {
    const parsed = new URL(skill.sourceUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  } catch {
    return false;
  }

  return true;
}

async function updateSkills() {
  const file = new URL('skills.json', DATA_DIR);
  const current = JSON.parse(await readFile(file, 'utf8'));

  const cleaned = current
    .filter(isActionableSkill)
    .map((item) => ({
      name: item.name.trim(),
      category: item.category.trim(),
      whatItDoes: item.whatItDoes.trim(),
      practicalUseCase: item.practicalUseCase.trim(),
      sourceName: item.sourceName.trim(),
      sourceUrl: item.sourceUrl.trim(),
      verificationLevel: item.verificationLevel,
    }));

  const deduped = [];
  const seen = new Set();
  for (const skill of cleaned) {
    const key = skill.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(skill);
  }

  if (deduped.length < 20 || deduped.length > 30) {
    throw new Error(`skills.json must contain 20-30 validated skills, found ${deduped.length}`);
  }

  await writeFile(file, `${JSON.stringify(deduped, null, 2)}\n`);
  console.log(`skills.json validated and normalized with ${deduped.length} concrete skills`);
}

async function fetchPromptSource(url) {
  const res = await safeFetch(url);
  if (!res) return { ok: false, error: 'fetch-failed' };
  const text = (await res.text()).replace(/\s+/g, ' ').trim();
  return { ok: true, text };
}

async function updatePrompts() {
  const now = new Date().toISOString();
  const file = new URL('prompts.json', DATA_DIR);

  let existing = { generatedAt: null, method: null, tools: [] };
  try {
    existing = JSON.parse(await readFile(file, 'utf8'));
  } catch {}
  const previousMap = new Map((existing.tools || []).map((t) => [t.tool, t]));

  const radarConfig = [
    {
      tool: 'claude code',
      shortName: 'claude-code',
      codingFocus: 'agent-workflows',
      sources: [
        { label: 'Anthropic Claude Code Docs', url: 'https://docs.anthropic.com/en/docs/claude-code/overview', sourceType: 'official-doc' },
        { label: 'Claude Code GitHub', url: 'https://github.com/search?q=claude+code+cli&type=repositories', sourceType: 'official-repo' },
      ],
    },
    {
      tool: 'kiro',
      shortName: 'kiro',
      codingFocus: 'spec-driven-development',
      sources: [
        { label: 'Kiro Docs', url: 'https://kiro.dev/docs', sourceType: 'official-doc' },
        { label: 'Kiro Blog', url: 'https://kiro.dev/blog', sourceType: 'official-doc' },
      ],
    },
    {
      tool: 'codex',
      shortName: 'codex',
      codingFocus: 'code-generation-and-refactor',
      sources: [
        { label: 'OpenAI Codex Intro', url: 'https://openai.com/index/introducing-codex/', sourceType: 'official-doc' },
        { label: 'OpenAI Prompting Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', sourceType: 'official-doc' },
      ],
    },
    {
      tool: 'antigravity',
      shortName: 'antigravity',
      codingFocus: 'high-speed-coding-assistant',
      sources: [
        { label: 'Antigravity Docs', url: 'https://antigravity.dev', sourceType: 'official-doc' },
        { label: 'Antigravity GitHub Search', url: 'https://github.com/search?q=antigravity+ai+agent&type=repositories', sourceType: 'official-repo' },
      ],
    },
    {
      tool: 'gemini cli',
      shortName: 'gemini-cli',
      codingFocus: 'terminal-first-coding',
      sources: [
        { label: 'Gemini CLI Docs', url: 'https://ai.google.dev/gemini-api/docs/cli', sourceType: 'official-doc' },
        { label: 'Gemini Prompting Intro', url: 'https://ai.google.dev/gemini-api/docs/prompting-intro', sourceType: 'official-doc' },
      ],
    },
    {
      tool: 'kimi',
      shortName: 'kimi',
      codingFocus: 'long-context-debugging',
      sources: [
        { label: 'Moonshot API Docs', url: 'https://platform.moonshot.cn/docs', sourceType: 'official-doc' },
        { label: 'Kimi Product Site', url: 'https://kimi.moonshot.cn', sourceType: 'official-doc' },
      ],
    },
    {
      tool: 'glm',
      shortName: 'glm',
      codingFocus: 'cn-stack-engineering',
      sources: [
        { label: 'Zhipu Open Platform', url: 'https://open.bigmodel.cn/dev/api', sourceType: 'official-doc' },
        { label: 'Zhipu How-To Docs', url: 'https://open.bigmodel.cn/dev/howuse/introduction', sourceType: 'official-doc' },
      ],
    },
    {
      tool: 'doubao',
      shortName: 'doubao',
      codingFocus: 'enterprise-agent-apps',
      sources: [
        { label: 'Volcengine Doubao Docs', url: 'https://www.volcengine.com/docs/82379', sourceType: 'official-doc' },
        { label: 'Doubao Product Site', url: 'https://www.doubao.com', sourceType: 'official-doc' },
      ],
    },
  ];

  const tools = [];

  for (const cfg of radarConfig) {
    const candidates = [];
    for (const source of cfg.sources) {
      const res = await fetchPromptSource(source.url);
      if (!res.ok) {
        candidates.push({ ...source, ok: false, confidence: 0, error: res.error });
        continue;
      }
      const confidence = scoreCandidate({ text: res.text, sourceType: source.sourceType, tool: cfg.tool });
      candidates.push({
        ...source,
        ok: true,
        confidence,
        contentHash: hashText(res.text || source.url),
        sample: (res.text || '').slice(0, 320),
      });
    }

    const successful = candidates.filter((x) => x.ok).sort((a, b) => b.confidence - a.confidence);
    const selected = successful[0] || null;
    const previous = previousMap.get(cfg.shortName);
    const previousHash = previous?.latest?.contentHash || null;

    const latest = selected
      ? {
          snapshotId: `${cfg.shortName}-${now.slice(0, 19).replace(/[-:T]/g, '')}`,
          detectedAt: now,
          title: selected.label,
          url: selected.url,
          contentHash: selected.contentHash,
          confidence: selected.confidence,
          excerpt: selected.sample,
          sourceSummary: summarizeSource(candidates),
          codingFocus: cfg.codingFocus,
          change: {
            status: previousHash ? (previousHash === selected.contentHash ? 'unchanged' : 'updated') : 'new',
            previousHash,
          },
        }
      : previous?.latest || {
          snapshotId: `${cfg.shortName}-${now.slice(0, 19).replace(/[-:T]/g, '')}`,
          detectedAt: now,
          title: 'No healthy source this cycle',
          url: cfg.sources[0].url,
          contentHash: previousHash || 'unavailable',
          confidence: 0,
          excerpt: 'Source fetch failed for all configured inputs in this cycle.',
          sourceSummary: summarizeSource(candidates),
          codingFocus: cfg.codingFocus,
          change: { status: previousHash ? 'unchanged' : 'unknown', previousHash },
        };

    const prevTimeline = previous?.timeline || [];
    const timeline = [
      {
        at: now,
        hash: latest.contentHash,
        status: latest.change?.status || 'unknown',
        confidence: latest.confidence,
        source: latest.title,
      },
      ...prevTimeline,
    ]
      .filter((item, idx, arr) => idx === arr.findIndex((x) => x.at === item.at && x.hash === item.hash))
      .slice(0, 8);

    tools.push({
      tool: cfg.shortName,
      displayName: cfg.tool,
      latest,
      timeline,
      monitoredSources: cfg.sources.map((s) => ({ label: s.label, url: s.url, type: s.sourceType })),
      sourceStats: { total: candidates.length, healthy: candidates.filter((x) => x.ok).length },
    });
  }

  const out = {
    generatedAt: now,
    method: {
      name: 'prompt-radar-style coding registry',
      description: 'Multi-source prompt candidate scoring focused on coding workflows, with hash-based change tracking and timeline retention.',
      version: 3,
    },
    tools,
  };

  await writeFile(file, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`prompts.json refreshed with ${out.tools.length} coding-focused profiles`);
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
      { name: 'Hot Skills', items: merged.filter((x) => x.category === 'Hot Skills').slice(0, 5) },
      { name: 'New & Rising', items: merged.filter((x) => x.category === 'New & Rising').slice(0, 5) },
      { name: 'Builder Picks', items: merged.filter((x) => x.category === 'Builder Picks').slice(0, 5) },
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
