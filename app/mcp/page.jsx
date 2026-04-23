'use client';
import mcp from '../../data/mcp.json';
import { CardGrid, InfoCard } from '../../components/Cards';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';

const SOURCES = ['official', 'community'];

const sortedMcp = [...mcp].sort((a, b) => (b.stars || 0) - (a.stars || 0));

export default function McpPage() {
  return (
    <section>
      <SectionHeader
        title="MCP Ecosystem"
        count={mcp.length}
        description="Model Context Protocol servers and SDKs. Official repos first, sorted by GitHub stars. Auto-verified daily."
      />

      <FilterBar
        items={sortedMcp}
        categories={SOURCES}
        searchFields={['name', 'description']}
        categoryField="source"
      >
        {(filtered) => (
          <CardGrid>
            {filtered.map((item) => (
              <InfoCard key={item.repo} title={item.name} href={item.repo}>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant={item.source === 'official' ? 'official' : 'community'}>
                    {item.source || 'community'}
                  </Badge>
                  {item.stars > 0 && (
                    <Badge variant="stars">★ {item.stars.toLocaleString()}</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-300">{item.description}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Updated {item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, 10) : '—'}
                </p>
              </InfoCard>
            ))}
          </CardGrid>
        )}
      </FilterBar>
    </section>
  );
}
