import skills from '../../data/skills.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'Skills | FYXAI' };

const verificationStyles = {
  official: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  'community-verified': 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200',
};

export default function SkillsPage() {
  return (
    <section>
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-cyan-200">Production AI Skills</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Concrete capabilities with practical implementation value and verifiable documentation.
        </p>
      </div>

      <CardGrid>
        {skills.map((item) => (
          <InfoCard key={item.name} title={item.name} subtitle={item.category} href={item.sourceUrl}>
            <p className="text-sm text-slate-200">{item.whatItDoes}</p>
            <p className="mt-3 text-sm text-slate-300">Use case: {item.practicalUseCase}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full border px-2 py-1 font-medium ${verificationStyles[item.verificationLevel] || 'border-slate-500/40 bg-slate-500/10 text-slate-200'}`}
              >
                {item.verificationLevel}
              </span>
              <span className="text-slate-400">Source: {item.sourceName}</span>
            </div>
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
