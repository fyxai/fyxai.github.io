'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export function FilterBar({
  items,
  categories,
  searchFields = ['name'],
  categoryField = 'category',
  children,
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q || searchFields.some((f) => String(item[f] ?? '').toLowerCase().includes(q));
      const matchesCategory = active === 'All' || item[categoryField] === active;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, active, searchFields, categoryField]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-xs flex-1">
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
