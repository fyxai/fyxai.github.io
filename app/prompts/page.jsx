import prompts from '../../data/prompts.json';
import { Radar, Activity, ShieldCheck, Code2 } from 'lucide-react';

export const metadata = { title: 'Prompts | FYXAI' };

function statusColor(status) {
  if (status === 'updated') return 'text-amber-300';
  if (status === 'new') return 'text-emerald-300';
  if (status === 'unchanged') return 'text-slate-300';
  return 'text-rose-300';
}

export default function PromptsPage() {
  const tools = prompts.tools || [];

  return (
    <section className="space-y-6">
      <header className="card">
        <h1 className="mb-3 flex items-center gap-2 text-2xl font-bold"><Radar className="text-cyan-300" /> Coding Prompt Registry</h1>
        <p className="text-sm text-slate-300">针对 coding workflow 的多工具 Prompt 变化追踪（每4小时刷新）。Last refresh: {new Date(prompts.generatedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC.</p>
      </header>

      <section className="card space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck size={18} className="text-cyan-300" /> How it works</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>同一轮同时抓取多个候选来源（官方文档/仓库）并进行评分筛选。</li>
          <li>聚焦 coding 信号（code/cli/agent/instructions）而不是泛 Prompt 文案。</li>
          <li>用 hash 做变更检测，标记 updated / unchanged / new。</li>
          <li>保留每个工具的最近时间线，避免“静态快照幻觉”。</li>
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {tools.map((tool) => (
          <article key={tool.tool} className="card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold capitalize">{tool.displayName}</h3>
              <span className={`text-xs font-medium uppercase tracking-wide ${statusColor(tool.latest?.change?.status)}`}>
                {tool.latest?.change?.status || 'unknown'}
              </span>
            </div>

            <div className="text-sm text-slate-300">
              <p><span className="text-slate-400">Snapshot:</span> {tool.latest?.snapshotId}</p>
              <p><span className="text-slate-400">Detected:</span> {new Date(tool.latest?.detectedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</p>
              <p><span className="text-slate-400">Hash:</span> <code className="rounded bg-slate-800 px-1 py-0.5">{tool.latest?.contentHash}</code></p>
              <p><span className="text-slate-400">Source:</span> <a href={tool.latest?.url} className="text-cyan-300 hover:underline" target="_blank" rel="noreferrer">{tool.latest?.title}</a></p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
              <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400"><Activity size={14} /> Confidence & source summary</p>
              <p className="mb-2">{tool.latest?.confidence}% confidence</p>
              <p>{tool.latest?.sourceSummary}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-cyan-300"><Code2 size={12} /> coding focus: {tool.latest?.codingFocus || '-'}</p>
            </div>

            <details className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
              <summary className="cursor-pointer text-slate-200">Recent timeline ({tool.timeline?.length || 0})</summary>
              <ul className="mt-2 space-y-1">
                {(tool.timeline || []).slice(0, 5).map((item, i) => (
                  <li key={`${item.at}-${item.hash}-${i}`} className="text-xs text-slate-400">
                    {new Date(item.at).toLocaleString('en-US', { timeZone: 'UTC' })} UTC • {item.status} • {item.hash} • {item.confidence}%
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </section>
    </section>
  );
}
