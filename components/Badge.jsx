const variants = {
  default:   'border-slate-500/40 bg-slate-500/10 text-slate-300',
  official:  'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  community: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200',
  hot:       'border-orange-400/40 bg-orange-500/10 text-orange-200',
  category:  'border-violet-400/40 bg-violet-500/10 text-violet-200',
  stars:     'border-amber-400/40 bg-amber-500/10 text-amber-200',
};

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variants[variant] ?? variants.default}`}>
      {children}
    </span>
  );
}
