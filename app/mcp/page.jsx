import mcp from '../../data/mcp.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'MCP | FYXAI' };

export default function McpPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cyan-200">MCP Ecosystem</h1>
        <p className="mt-2 text-sm text-slate-300">只展示本轮自动校验通过的仓库（官方优先，过滤无效/404 页面）。</p>
      </div>

      <CardGrid>
        {mcp.map((item) => (
          <InfoCard
            key={item.repo}
            title={item.name}
            subtitle={`${item.stars || 0}★ • ${item.source || 'community'} • ${item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, 10) : ''}`}
            href={item.repo}
          >
            <p>{item.description}</p>
            <p className="mt-3 text-xs text-slate-400">verified: {item.verifiedAt ? new Date(item.verifiedAt).toISOString().slice(0, 16).replace('T', ' ') : '-' } UTC</p>
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
