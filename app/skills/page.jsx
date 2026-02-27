import skills from '../../data/skills.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'Skills | FYXAI' };

export default function SkillsPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-cyan-200">Emerging AI Skills</h1>
      <CardGrid>
        {skills.map((item) => (
          <InfoCard key={item.name} title={item.name} subtitle={item.category}>
            <p>{item.description}</p>
            <p className="mt-3 text-xs text-slate-400">Signal: {item.signal}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
