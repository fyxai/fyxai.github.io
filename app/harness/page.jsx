import { Cpu, GitBranch, RefreshCw, Brain, Layers, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'Harness Engineering | FYXAI' };

const concepts = [
  {
    icon: Layers,
    title: 'Skills Packaging',
    desc: 'Structured markdown files with trigger conditions, SOPs, and reference materials. Write once, deploy to Claude Code, Cursor, Copilot, and 10+ other tools via the agentskills.io open standard.',
    badge: 'Standard',
  },
  {
    icon: Brain,
    title: 'Context Injection',
    desc: 'Load only the minimum context per agent turn using progressive disclosure. Fetch tool schemas and skill details on demand instead of dumping everything at startup.',
    badge: 'Pattern',
  },
  {
    icon: RefreshCw,
    title: 'Feedback Loops',
    desc: 'Build explicit success/failure signals back into the agent cycle. A code agent that runs its own tests and re-prompts on failure needs no human intervention.',
    badge: 'Pattern',
  },
  {
    icon: GitBranch,
    title: 'Self-Improving Agents',
    desc: 'Agents that update their own skill files when they find a better procedure — creating a compounding improvement loop across sessions.',
    badge: 'Advanced',
  },
  {
    icon: Cpu,
    title: 'Harness Composition',
    desc: 'Assemble permission layers, memory backends, tool registries, and feedback loops into a single deployable agent harness. The infrastructure layer around your model.',
    badge: 'Architecture',
  },
];

const resources = [
  {
    title: 'Model Context Protocol',
    url: 'https://modelcontextprotocol.io/',
    desc: 'Official MCP spec and SDK docs',
  },
  {
    title: 'Hermes Agent (Nous Research)',
    url: 'https://github.com/NousResearch/hermes-agent',
    desc: 'Open-source self-improving agent framework — 17K+ stars',
  },
  {
    title: 'Harness Engineering — Deep Dive',
    url: 'https://zhuanlan.zhihu.com/p/2014014859164026634',
    desc: 'Comprehensive breakdown of Harness Engineering practices',
  },
  {
    title: 'Claude Code',
    url: 'https://claude.ai/code',
    desc: "Anthropic's agentic CLI with skills and harness support",
  },
  {
    title: 'Agent Harness (2026 Analysis)',
    url: 'https://zhuanlan.zhihu.com/p/2022027288405976801',
    desc: 'Why 70% of agent performance lives in the layer outside the model',
  },
];

const compatibleTools = ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf'];

export default function HarnessPage() {
  return (
    <section className="space-y-12">
      {/* Hero */}
      <div className="card mx-auto max-w-4xl">
        <Badge variant="hot">2026 Hot Topic</Badge>
        <h1 className="mt-4 text-3xl font-bold text-cyan-200 md:text-4xl">Harness Engineering</h1>
        <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">
          Harness Engineering is the practice of designing the constraint environment, feedback loops, and control
          systems that wrap an AI agent — so it runs reliably without going off the rails.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          The name comes from horse tack: the harness does not slow the horse down — it lets it run fast in the right
          direction. In 2026, the model is no longer the hard part. The harness is.
        </p>
      </div>

      {/* Core Concepts */}
      <div>
        <SectionHeader
          title="Core Concepts"
          count={concepts.length}
          description="The building blocks of a production agent harness."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {concepts.map(({ icon: Icon, title, desc, badge }) => (
            <article key={title} className="card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Icon size={18} className="mt-0.5 shrink-0 text-cyan-300" />
                <Badge variant="community">{badge}</Badge>
              </div>
              <h3 className="font-semibold text-cyan-100">{title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Agent Skills Ecosystem */}
      <div className="card">
        <h2 className="mb-2 text-xl font-semibold text-cyan-200">Agent Skills Ecosystem</h2>
        <p className="mb-6 text-sm text-slate-400">
          Skills are portable, structured knowledge packages. Write a skill once and deploy it across every major AI
          coding tool — no vendor lock-in.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {compatibleTools.map((tool) => (
            <div
              key={tool}
              className="rounded-xl border border-cyan-400/15 bg-slate-950/40 px-4 py-3 text-center text-sm text-slate-300"
            >
              {tool}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Compatible via the agentskills.io open standard — skills are plain markdown files, readable by any tool.
        </p>
      </div>

      {/* Resources */}
      <div>
        <SectionHeader title="Resources" description="Specs, frameworks, and deep-dive reading." />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="card group flex items-start justify-between gap-4 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <div>
                <p className="font-medium text-cyan-100">{r.title}</p>
                <p className="mt-1 text-sm text-slate-400">{r.desc}</p>
              </div>
              <ExternalLink size={14} className="mt-1 shrink-0 text-slate-500 group-hover:text-cyan-400" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
