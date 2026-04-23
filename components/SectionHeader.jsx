export function SectionHeader({ title, count, description }) {
  return (
    <div className="mb-7">
      <div className="flex items-baseline gap-3">
        <h1 className="text-3xl font-bold text-cyan-200">{title}</h1>
        {count != null && (
          <span className="rounded-full border border-cyan-400/20 px-2 py-0.5 text-xs text-slate-400">
            {count}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}
