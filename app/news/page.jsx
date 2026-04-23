'use client';
import { useState } from 'react';
import { ExternalLink, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react';
import news from '../../data/news.json';
import archive from '../../data/news-archive.json';

const decodeEntities = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

const cleanTitle = (s = '') =>
  decodeEntities(s).replace(/<[^>]*>/g, '').trim();

const cleanSummary = (s = '') => {
  const decoded = decodeEntities(s);
  const stripped = decoded
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > 20 ? stripped : '';
};

const fmtRelative = (t) => {
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const fmtDate = (t) => {
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return t || '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const dayKey = (t) => {
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toISOString().slice(0, 10);
};

function NewsCard({ item, size = 'normal' }) {
  const title = cleanTitle(item.title);
  const summary = cleanSummary(item.summary);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="card group flex flex-col gap-2.5 transition hover:-translate-y-0.5 hover:border-cyan-400/30"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-300 truncate max-w-[140px]">
          {item.source || 'AI News'}
        </span>
        {item.publishedAt && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
            <Clock size={10} />
            {fmtRelative(item.publishedAt)}
          </span>
        )}
      </div>

      <p className={`font-medium text-slate-100 leading-snug ${size === 'large' ? 'text-base' : 'text-sm'} line-clamp-3`}>
        {title}
      </p>

      {summary && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{summary}</p>
      )}

      <span className="mt-auto flex items-center gap-1 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
        Read article <ExternalLink size={10} />
      </span>
    </a>
  );
}

function ArchiveDay({ date, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">{fmtDate(date)}</span>
          <span className="rounded-full border border-slate-600/40 bg-slate-700/20 px-2 py-0.5 text-xs text-slate-400">
            {items.length} articles
          </span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <NewsCard key={`${item.url}-${item.publishedAt}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  const [query, setQuery] = useState('');

  const latest = news.slice(0, 12);
  const latestSet = new Set(latest.map((x) => (x.url || '').split('?')[0]));
  const history = archive.filter((x) => !latestSet.has((x.url || '').split('?')[0]));

  const q = query.toLowerCase().trim();
  const filteredLatest = q
    ? latest.filter((x) => cleanTitle(x.title).toLowerCase().includes(q) || (x.source || '').toLowerCase().includes(q))
    : latest;

  const grouped = history.reduce((acc, item) => {
    const k = dayKey(item.publishedAt);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
  const days = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1)).slice(0, 30);

  return (
    <section className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-400 mb-2">Live Feed</p>
        <h1 className="text-3xl font-bold text-white">AI News</h1>
        <p className="mt-2 text-sm text-slate-400">
          Auto-updated every 4h from top AI sources &mdash; {news.length + archive.length} articles indexed.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400/40 focus:bg-white/[0.06] transition"
        />
      </div>

      {/* Fresh Updates */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-cyan-100">Fresh Updates</h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        {filteredLatest.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredLatest.map((item) => (
              <NewsCard key={item.url} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No results for &quot;{query}&quot;</p>
        )}
      </div>

      {/* Archive */}
      {!q && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-cyan-100">Archive</h2>
          <div className="space-y-2">
            {days.map((d) => (
              <ArchiveDay key={d} date={d} items={grouped[d]} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
