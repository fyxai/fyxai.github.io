'use client';
import Link from 'next/link';
import {
  Sparkles, Cpu, GitBranch, Wrench, Newspaper, ScrollText,
  ArrowRight, ExternalLink, Clock,
} from 'lucide-react';
import news from '../data/news.json';
import mcp from '../data/mcp.json';
import skills from '../data/skills.json';
import projects from '../data/projects.json';
import prompts from '../data/prompts.json';
import utilities from '../data/utilities.json';

const promptCount = Array.isArray(prompts) ? prompts.length : (prompts.tools?.length || 0);

const SECTIONS = [
  {
    href: '/skills',
    label: 'AI Skills',
    desc: 'Production engineering techniques with verifiable sources',
    count: skills.length,
    unit: 'skills',
    Icon: Sparkles,
    glow: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    text: '#c4b5fd',
  },
  {
    href: '/mcp',
    label: 'MCP Registry',
    desc: 'Model Context Protocol servers & SDKs, sorted by stars',
    count: mcp.length,
    unit: 'repos',
    Icon: Cpu,
    glow: 'rgba(34,211,238,0.12)',
    border: 'rgba(34,211,238,0.25)',
    text: '#67e8f9',
  },
  {
    href: '/harness',
    label: 'Harness Engineering',
    desc: 'Agent design frameworks, skills packaging, feedback loops',
    count: null,
    unit: '2026 hot',
    Icon: GitBranch,
    glow: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.25)',
    text: '#6ee7b7',
  },
  {
    href: '/utilities',
    label: 'Hot AI Tools',
    desc: 'Curated tools across coding, research, design, infra',
    count: utilities.length,
    unit: 'tools',
    Icon: Wrench,
    glow: 'rgba(251,146,60,0.1)',
    border: 'rgba(251,146,60,0.22)',
    text: '#fdba74',
  },
  {
    href: '/news',
    label: 'AI News',
    desc: 'Live feed from top AI sources, auto-updated every 4h',
    count: null,
    unit: 'live',
    Icon: Newspaper,
    glow: 'rgba(56,189,248,0.1)',
    border: 'rgba(56,189,248,0.22)',
    text: '#7dd3fc',
  },
  {
    href: '/prompts',
    label: 'Prompt Registry',
    desc: 'Versioned prompt profiles with source change tracking',
    count: promptCount || null,
    unit: promptCount ? 'prompts' : 'registry',
    Icon: ScrollText,
    glow: 'rgba(244,114,182,0.1)',
    border: 'rgba(244,114,182,0.22)',
    text: '#f9a8d4',
  },
];

const cleanTitle = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]*>/g, '').trim();

const fmtDate = (t) => {
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function HomePage() {
  const recentNews = news.slice(0, 3);

  return (
    <section className="space-y-12 py-6">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="card relative overflow-hidden">
        {/* ambient spot */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-10%',
          width: '55%', paddingBottom: '55%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-400">
          Autonomous AI Hub
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
          FYXAI
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400 leading-relaxed">
          Continuously updated AI engineering intelligence — skills, MCP ecosystem, harness frameworks, hot tools, and live news. Built and maintained autonomously.
        </p>

        {/* Live stats */}
        <div className="mt-6 flex flex-wrap gap-6">
          {[
            { v: skills.length, l: 'AI Skills' },
            { v: mcp.length, l: 'MCP Repos' },
            { v: utilities.length, l: 'Hot Tools' },
            { v: news.length, l: 'News Items' },
          ].map(({ v, l }) => (
            <div key={l}>
              <div className="text-2xl font-bold tabular-nums text-cyan-300">{v}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{l}</div>
            </div>
          ))}
          <div>
            <div className="flex items-center gap-1.5 text-2xl font-bold text-emerald-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Auto-updated</div>
          </div>
        </div>
      </div>

      {/* ── Section nav grid ─────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Explore
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map(({ href, label, desc, count, unit, Icon, glow, border, text }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-2xl border p-5 transition hover:-translate-y-0.5"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 0% 0%, ${glow} 0%, rgba(6,8,22,0.9) 70%)`,
                borderColor: 'rgba(255,255,255,0.07)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = border; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div className="flex items-start justify-between gap-3">
                <Icon size={18} style={{ color: text, marginTop: '1px', flexShrink: 0 }} />
                <span className="rounded-full border px-2 py-0.5 text-xs font-medium"
                  style={{ borderColor: border, color: text, background: glow }}>
                  {count != null ? `${count} ${unit}` : unit}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-slate-100">{label}</h3>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs transition-colors"
                style={{ color: text, opacity: 0.7 }}>
                Browse <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Latest News ──────────────────────────────────── */}
      {recentNews.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Latest News
            </h2>
            <Link href="/news"
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              All news <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {recentNews.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="card group flex flex-col gap-2 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
                    {item.source || 'AI News'}
                  </span>
                  {item.publishedAt && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={10} />
                      {fmtDate(item.publishedAt)}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-200 leading-snug line-clamp-3">
                  {cleanTitle(item.title)}
                </p>
                <span className="mt-auto flex items-center gap-1 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Read article <ExternalLink size={10} />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
