import skills from '../../data/skills.json';
import { CardGrid, InfoCard } from '../../components/Cards';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';

export const metadata = { title: 'AI Skills | FYXAI' };

const CATEGORIES = [
  'LLM Integration',
  'Retrieval',
  'Agent Design',
  'Evaluation',
  'Cost & Latency',
  'UX Engineering',
  'Safety',
  'MLOps',
  'Integration',
  'Harness Engineering',
];

export default function SkillsPage() {
  return (
    <section>
      <SectionHeader
        title="AI Engineering Skills"
        count={skills.length}
        description="Production-ready capabilities with verifiable documentation. Covers LLM integration, retrieval, agents, evaluation, safety, and harness engineering."
      />

      <FilterBar
        items={skills}
        categories={CATEGORIES}
        searchFields={['name', 'whatItDoes', 'practicalUseCase']}
        categoryField="category"
      >
        {(filtered) => (
          <CardGrid>
            {filtered.map((item) => (
              <InfoCard key={item.name} title={item.name} href={item.sourceUrl}>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant="category">{item.category}</Badge>
                  <Badge variant={item.verificationLevel === 'official' ? 'official' : 'community'}>
                    {item.verificationLevel}
                  </Badge>
                </div>
                <p className="text-sm text-slate-200">{item.whatItDoes}</p>
                <p className="mt-3 text-xs text-slate-400">↳ {item.practicalUseCase}</p>
                <p className="mt-3 text-xs text-slate-500">via {item.sourceName}</p>
              </InfoCard>
            ))}
          </CardGrid>
        )}
      </FilterBar>
    </section>
  );
}
