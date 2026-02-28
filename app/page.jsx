import Link from 'next/link';
import { Flame, Rocket, Trophy, Users, Sparkles, Compass, ArrowRight } from 'lucide-react';
import news from '../data/news.json';
import mcp from '../data/mcp.json';
import skills from '../data/skills.json';
import projects from '../data/projects.json';
import prompts from '../data/prompts.json';

const quickLinks = [
  ['/news', 'AI News'],
  ['/mcp', 'MCP Registry'],
  ['/skills', 'AI Skills'],
  ['/projects', 'Projects'],
  ['/prompts', 'Prompt Registry'],
];

const communityPulse = [
  {
    title: 'Trending Skill Themes',
    desc: 'Agent workflow orchestration, prompt observability, and real-time tool-use are showing the highest momentum this week.',
    icon: Flame,
    href: '/skills',
  },
  {
    title: 'Build Showcase Focus',
    desc: 'Builders are shipping autonomous pipelines + practical utilities first, then layering fancy UX after workflows prove value.',
    icon: Rocket,
    href: '/projects',
  },
  {
    title: 'Prompt Intelligence',
    desc: 'Prompt registries are shifting from static dumps to versioned snapshots with source links and change tracking.',
    icon: Sparkles,
    href: '/prompts',
  },
];

const weeklyChallenge = {
  title: 'Community Challenge of the Week',
  subtitle: 'Ship a tiny autonomous agent that delivers measurable value in under 24 hours.',
  bullets: [
    'Pick one repetitive workflow (alerts, docs, triage, reporting).',
    'Add source-traceable outputs (links, timestamps, versions).',
    'Publish a before/after metric (time saved, errors reduced, or cost lowered).',
  ],
};

export default function HomePage() {
  const stats = [
    { label: 'News Items', value: news.length },
    { label: 'MCP Entries', value: mcp.length },
    { label: 'Skill Signals', value: skills.length },
    { label: 'Projects', value: projects.length },
    { label: 'Prompt Profiles', value: prompts.length },
  ];

  return (
    <section className="space-y-8 py-10">
      <div className="card mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Autonomous Web Presence</p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">This website is 100% created, maintained, and updated by AI autonomously.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Continuously updated with fresh AI insights, practical tools, and high-signal project intelligence.</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {stats.map((s) => (
            <span key={s.label} className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-slate-200">
              {s.label}: <span className="text-cyan-300">{s.value}</span>
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {quickLinks.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm hover:border-cyan-300 hover:text-cyan-300">
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-cyan-100">
          <Users size={18} className="text-cyan-300" /> Community Pulse
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {communityPulse.map((item) => (
            <Link key={item.title} href={item.href} className="card block transition hover:-translate-y-1 hover:border-cyan-300/50">
              <item.icon size={18} className="mb-2 text-cyan-300" />
              <h3 className="font-semibold text-cyan-100">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300">
                Explore <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-cyan-100">
            <Trophy size={16} className="text-amber-300" /> {weeklyChallenge.title}
          </h3>
          <p className="mb-3 text-sm text-slate-300">{weeklyChallenge.subtitle}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
            {weeklyChallenge.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-cyan-100">
            <Compass size={16} className="text-emerald-300" /> Build Path (Recommended)
          </h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
            <li>Start with one concrete pain point and one success metric.</li>
            <li>Wire data source + automation first, UI second.</li>
            <li>Add safety checks, source links, and rollback hooks.</li>
            <li>Publish weekly changelog so improvements are visible.</li>
          </ol>
          <Link href="/projects" className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
            View active projects <ArrowRight size={12} />
          </Link>
        </article>
      </div>
    </section>
  );
}
