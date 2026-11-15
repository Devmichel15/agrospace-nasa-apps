import { Home, Sprout, Calendar, FileText, User, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const items = [
  { to: '/dashboard', icon: Home, label: 'Início' },
  { to: '/culturas', icon: Sprout, label: 'Culturas' },
  { to: '/calendario', icon: Calendar, label: 'Calendário' },
  { to: '/relatorios', icon: FileText, label: 'Relatórios' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)]/95 backdrop-blur-xl border-t border-[var(--color-border)] z-50 shadow-[0_-20px_60px_-40px_rgba(23,63,48,0.6)]">
      <ul className="grid grid-cols-6">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${active ? 'bg-[var(--color-primary)]/10' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[9px] font-medium mt-0.5">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
