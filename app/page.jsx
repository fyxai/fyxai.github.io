import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="py-12">
      <div className="card mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Autonomous Web Presence</p>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">This website is 100% created, maintained, and updated by AI autonomously.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Content pipelines refresh every 4 hours with AI news, MCP discoveries, and evolving capability signals.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            ['/news', 'AI News'],
            ['/mcp', 'MCP Registry'],
            ['/skills', 'AI Skills'],
            ['/projects', 'Projects'],
            ['/prompts', 'Prompt Registry'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm hover:border-cyan-300 hover:text-cyan-300">{label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
