import news from '../../data/news.json';
import archive from '../../data/news-archive.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'News | FYXAI' };

const fmt = (t) => {
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? t || 'n/a' : d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
};

const dayKey = (t) => {
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return 'Unknown Date';
  return d.toISOString().slice(0, 10);
};

const cleanText = (s = '') => {
  const decoded = s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return decoded
    .replace(/<[^>]*>/g, ' ')
    .replace(/(?:^|\s)[a-z]+\s*=\s*"[^"]*"/gi, ' ')
    .replace(/(?:^|\s)[a-z]+\s*=\s*'[^']*'/gi, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export default function NewsPage() {
  const latest = news.slice(0, 10);
  const latestSet = new Set(latest.map((x) => (x.url || '').split('?')[0]));
  const history = archive.filter((x) => !latestSet.has((x.url || '').split('?')[0])).slice(0, 200);

  const grouped = history.reduce((acc, item) => {
    const k = dayKey(item.publishedAt);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

  const days = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold text-cyan-200">Latest AI News</h1>
      <p className="mb-6 text-sm text-slate-400">Archive is now grouped by day. Click a date to expand.</p>

      <h2 className="mb-4 text-xl font-semibold text-cyan-100">Fresh Updates</h2>
      <CardGrid>
        {latest.map((item) => (
          <InfoCard key={item.url} title={cleanText(item.title)} subtitle={`${item.source} • ${fmt(item.publishedAt)}`} href={item.url}>
            {cleanText(item.summary)}
          </InfoCard>
        ))}
      </CardGrid>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-cyan-100">Archive (by day)</h2>
      <div className="space-y-3">
        {days.map((d, idx) => (
          <details key={d} className="card" open={idx === 0}>
            <summary className="cursor-pointer list-none font-semibold text-cyan-200">
              {d} <span className="ml-2 text-xs text-slate-400">({grouped[d].length} items)</span>
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {grouped[d].map((item) => (
                <InfoCard
                  key={`${item.url}-${item.publishedAt}`}
                  title={cleanText(item.title)}
                  subtitle={`${item.source} • ${fmt(item.publishedAt)}`}
                  href={item.url}
                >
                  {cleanText(item.summary)}
                </InfoCard>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
