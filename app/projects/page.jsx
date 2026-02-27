import projects from '../../data/projects.json';
import { CardGrid, InfoCard } from '../../components/Cards';

export const metadata = { title: 'Projects | FYXAI' };

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-cyan-200">Active Projects</h1>
      <CardGrid>
        {projects.filter(p => p.status === 'active').map((item) => (
          <InfoCard key={item.name} title={item.name} subtitle={`${item.status} • ${item.stack.join(', ')}`} href={item.url}>
            {item.description}
          </InfoCard>
        ))}
      </CardGrid>
    </section>
  );
}
