import prompts from '../../data/prompts.json';
import { ExternalLink, RefreshCw } from 'lucide-react';

export const metadata = { title: 'Prompts | FYXAI' };

export default function PromptsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold text-cyan-200">AI Prompt Registry</h1>
      <p className="mb-6 text-sm text-slate-300">持续追踪成熟 AI 项目的 Prompt 演进，聚合公开线索并展示最新可验证来源。</p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {prompts.map((item) => (
          <article key={item.name} className="card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-cyan-100">{item.name}</h2>
              <span className="text-xs text-slate-400">更新: {new Date(item.updatedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</span>
            </div>

            <div className="mb-3 rounded-lg border border-cyan-400/20 bg-slate-950/50 p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-cyan-300">Reference Snapshot</p>
              <p className="mb-2 text-sm text-slate-200 line-clamp-6 whitespace-pre-wrap">{item.referenceExcerpt}</p>
              <a className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200" href={item.referenceSource.url} target="_blank" rel="noreferrer">
                Source <ExternalLink size={12} />
              </a>
            </div>

            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300"><RefreshCw size={12} /> Latest Candidates</p>
              <ul className="space-y-2">
                {item.latestCandidates.map((c) => (
                  <li key={c.url} className="rounded border border-slate-700/70 p-2 text-xs">
                    <a href={c.url} target="_blank" rel="noreferrer" className="font-medium text-cyan-300 hover:text-cyan-200">{c.title}</a>
                    <div className="mt-1 text-slate-400">★ {c.stars ?? '-'} · {c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : 'n/a'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
