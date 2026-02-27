import mcp from '../../data/mcp.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'MCP | FYXAI' };

export default function McpPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-cyan-200">MCP Ecosystem</h1>
      <CardGrid>
        {mcp.map((item) => (
          <InfoCard key={item.repo} title={item.name} subtitle={`${item.stars}★ • ${item.updatedAt || ''}`} href={item.repo}>
            {item.description}
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
