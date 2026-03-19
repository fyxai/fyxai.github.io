import Link from 'next/link';
import { Wrench, Calculator, ShieldCheck, Newspaper, Cpu, Sparkles, ExternalLink, ArrowRight, Clock3, LayoutGrid } from 'lucide-react';

const featuredTool = {
  title: 'Compound Interest Calculator',
  desc: 'Interactive calculator for compounding growth over time with chart visualization, simple sliders, and clean stacked-bar feedback.',
  href: '/utilities/compound-interest.html',
  icon: Calculator,
  badge: 'New utility',
};

const utilityLinks = [
  {
    title: 'Health Snapshot',
    desc: 'Inspect current site health, freshness, and deployment status.',
    href: '/health',
    icon: ShieldCheck,
    kind: 'Ops',
  },
  {
    title: 'AI News Feed',
    desc: 'Jump into the latest AI news items gathered by the site.',
    href: '/news',
    icon: Newspaper,
    kind: 'Research',
  },
  {
    title: 'MCP Registry',
    desc: 'Browse MCP entries and tool ecosystem references.',
    href: '/mcp',
    icon: Cpu,
    kind: 'Infra',
  },
  {
    title: 'Skills Registry',
    desc: 'Explore skills and practical automations collected on the site.',
    href: '/skills',
    icon: Sparkles,
    kind: 'Automation',
  },
];

const quickNotes = [
  'Fast access to lightweight tools without digging through projects.',
  'A stable landing area for calculators, operational dashboards, and small utilities.',
  'Easy to extend later with more one-page helpers.',
];

export default function UtilitiesPage() {
  return (
    <section className="space-y-8 py-10">
      <div className="card mx-auto max-w-5xl overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Utilities Tools</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Practical tools, calculators, and quick-access utility pages.</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              A cleaner home for small useful pages — designed to open fast, feel lightweight, and stay easy to discover from the main navigation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:min-w-[280px]">
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-300"><LayoutGrid size={14} /> Section</div>
              <div className="mt-2 text-2xl font-semibold text-cyan-100">Utilities</div>
              <div className="mt-1 text-xs text-slate-400">Small tools, one-click access</div>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-300"><Clock3 size={14} /> Focus</div>
              <div className="mt-2 text-2xl font-semibold text-cyan-100">Fast</div>
              <div className="mt-1 text-xs text-slate-400">Low-friction, practical pages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Link href={featuredTool.href} className="card group block border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 via-slate-950/40 to-slate-950/80 transition hover:-translate-y-1 hover:border-cyan-300/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-300/30 px-3 py-1 text-xs text-cyan-200">
                {featuredTool.badge}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-cyan-100">{featuredTool.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{featuredTool.desc}</p>
            </div>
            <featuredTool.icon size={22} className="mt-1 shrink-0 text-cyan-300" />
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-300 group-hover:text-cyan-200">
            Open tool <ArrowRight size={14} />
          </div>
        </Link>

        <div className="card">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-100">
            <Wrench size={16} className="text-cyan-300" /> Why this section exists
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {quickNotes.map((note) => (
              <li key={note} className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-cyan-100">More utility links</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Operational shortcuts</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {utilityLinks.map(({ title, desc, href, icon: Icon, kind }) => (
            <Link key={href} href={href} className="card block transition hover:-translate-y-1 hover:border-cyan-300/50">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-cyan-400/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                  {kind}
                </div>
                <ExternalLink size={14} className="mt-1 text-slate-500" />
              </div>
              <Icon size={18} className="mt-4 text-cyan-300" />
              <h3 className="mt-3 text-lg font-semibold text-cyan-100">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
