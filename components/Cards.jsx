export function CardGrid({ children }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function InfoCard({ title, subtitle, children, href }) {
  const Wrapper = href ? 'a' : 'div';
  const props = href ? { href, target: '_blank', rel: 'noreferrer' } : {};
  return (
    <Wrapper {...props} className="card block transition hover:-translate-y-1 hover:border-cyan-300/60">
      <h3 className="mb-1 text-lg font-semibold text-cyan-200">{title}</h3>
      {subtitle ? <p className="mb-3 text-xs text-slate-400">{subtitle}</p> : null}
      <div className="text-sm text-slate-300">{children}</div>
    </Wrapper>
  );
}
