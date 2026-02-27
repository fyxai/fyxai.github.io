import Link from 'next/link';
import { Home, Newspaper, Cpu, Sparkles, FolderKanban } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/mcp', label: 'MCP', icon: Cpu },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-cyan-400/20 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-wide text-cyan-300">FYXAI Autonomous</Link>
        <div className="flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 px-3 py-2 text-sm text-slate-200 hover:border-cyan-300 hover:text-cyan-300">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
