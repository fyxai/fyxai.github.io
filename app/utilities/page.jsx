'use client';
import { ExternalLink, Code2, Microscope, Palette, Zap, Server } from 'lucide-react';
import utilities from '../../data/utilities.json';
import { Badge } from '../../components/Badge';
import { FilterBar } from '../../components/FilterBar';
import { SectionHeader } from '../../components/SectionHeader';


const CATEGORY_ICONS = {
  Coding:         Code2,
  Research:       Microscope,
  Design:         Palette,
  Productivity:   Zap,
  Infrastructure: Server,
};

const AI_TOOL_CATEGORIES = ['Coding', 'Research', 'Design', 'Productivity', 'Infrastructure'];

const devTools = [
  {
    title: 'Token Calculator',
    desc: 'Estimate token counts for prompts across GPT-4o, Claude, and Gemini. Useful for budgeting context windows.',
    href: 'https://platform.openai.com/tokenizer',
  },
  {
    title: 'AI API Pricing Comparison',
    desc: 'Compare input/output token costs across OpenAI, Anthropic, Google, and open-source models.',
    href: 'https://artificialanalysis.ai/models',
  },
  {
    title: 'Prompt Template Library',
    desc: 'Browse community-curated prompt templates for coding, research, summarisation, and data extraction.',
    href: 'https://promptbase.com',
  },
  {
    title: 'Model Benchmarks',
    desc: 'Up-to-date MMLU, HumanEval, MATH, and GPQA leaderboards comparing frontier and open-source models.',
    href: 'https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard',
  },
];

export default function UtilitiesPage() {
  return (
    <section className="space-y-12">
      {/* Zone 1: Hot AI Tools */}
      <div>
        <SectionHeader
          title="Hot AI Tools"
          count={utilities.length}
          description="Trending tools across coding, research, design, productivity, and infrastructure — curated for AI builders."
        />

        <FilterBar
          items={utilities}
          categories={AI_TOOL_CATEGORIES}
          searchFields={['name', 'desc']}
          categoryField="category"
        >
          {(filtered) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tool) => {
                const Icon = CATEGORY_ICONS[tool.category] ?? Zap;
                return (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card group flex flex-col gap-3 transition hover:-translate-y-1 hover:border-cyan-300/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="shrink-0 text-cyan-300" />
                        <span className="font-semibold text-cyan-100">{tool.name}</span>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {tool.hot && <Badge variant="hot">🔥 Hot</Badge>}
                        <Badge variant="category">{tool.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{tool.desc}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300">
                      Open <ExternalLink size={11} />
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </FilterBar>
      </div>

      {/* Zone 2: Developer Tools */}
      <div>
        <SectionHeader
          title="Developer Tools"
          description="Quick-access resources for prompt engineering, model selection, and API budgeting."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {devTools.map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="card group flex flex-col gap-2 transition hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <h3 className="font-semibold text-cyan-100">{tool.title}</h3>
              <p className="text-sm text-slate-300">{tool.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs text-cyan-400 group-hover:text-cyan-300">
                Open <ExternalLink size={11} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
