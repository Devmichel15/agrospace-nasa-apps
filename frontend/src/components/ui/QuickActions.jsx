import { ArrowRight, Sprout, Calendar, FileText, Activity, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { SectionHeader } from './SectionHeader';

const defaultActions = [
  { to: '/culturas', icon: Sprout, title: 'Comparar culturas', description: 'Avalie adequação por época e fatores limitantes' },
  { to: '/calendario', icon: Calendar, title: 'Calendário', description: 'Janelas indicativas de plantio e manejo' },
  { to: '/relatorios', icon: FileText, title: 'Relatórios', description: 'Resumo semanal e histórico de alertas' },
  { to: '/sensores', icon: Activity, title: 'Sensores', description: 'Indicadores de satélite e solo' },
  { to: '/chat', icon: MessageCircle, title: 'Assistente', description: 'Perguntas sobre a exploração e agricultura' },
];

export const QuickActions = ({ actions = [] }) => {
  const items = actions.length > 0 ? actions : defaultActions;

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5">
        <SectionHeader 
          title="Ações rápidas"
          subtitle="Acesso direto às principais funcionalidades"
          className="mb-0"
        />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.to}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-warm-bg)] border border-transparent hover:border-[var(--color-border)] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--color-warm-bg)] group-hover:bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] transition-colors">
                  <Icon size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-deep-green)] transition-colors">{item.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{item.description}</p>
                </div>
                <ArrowRight size={16} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
