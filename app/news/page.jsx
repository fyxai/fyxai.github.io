import news from '../../data/news.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'News | FYXAI' };

export default function NewsPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-cyan-200">Latest AI News</h1>
      <CardGrid>
        {news.slice(0, 30).map((item) => (
          <InfoCard key={item.url} title={item.title} subtitle={`${item.source} • ${item.publishedAt || 'n/a'}`} href={item.url}>
            {item.summary}
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
