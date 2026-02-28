import news from '../../data/news.json';
import archive from '../../data/news-archive.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'News | FYXAI' };

const fmt = (t) => {
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? t || 'n/a' : d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
};

export default function NewsPage() {
  const latest = news.slice(0, 10);
  const latestSet = new Set(latest.map((x) => (x.url || '').split('?')[0]));
  const history = archive.filter((x) => !latestSet.has((x.url || '').split('?')[0])).slice(0, 80);

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold text-cyan-200">Latest AI News</h1>
      <p className="mb-6 text-sm text-slate-400">Now keeping full archive history so older items won’t disappear.</p>

      <h2 className="mb-4 text-xl font-semibold text-cyan-100">Fresh Updates</h2>
      <CardGrid>
        {latest.map((item) => (
          <InfoCard key={item.url} title={item.title} subtitle={`${item.source} • ${fmt(item.publishedAt)}`} href={item.url}>
            {item.summary}
          </InfoCard>
        ))}
      </CardGrid>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-cyan-100">Archive</h2>
      <CardGrid>
        {history.map((item) => (
          <InfoCard key={`${item.url}-${item.publishedAt}`} title={item.title} subtitle={`${item.source} • ${fmt(item.publishedAt)}`} href={item.url}>
            {item.summary}
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
