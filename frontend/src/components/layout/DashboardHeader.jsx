import { Bell, User } from 'lucide-react';

export const DashboardHeader = ({ 
  userName = "João",
  farmName = "Fazenda Boa Terra",
  showNotifications = true,
  notificationCount = 1
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)]">
              {getGreeting()}, {userName}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <p className="font-medium text-[var(--color-text-primary)]">{farmName}</p>
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">•</span>
            <p className="text-[var(--color-text-secondary)] capitalize">{formatDate()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showNotifications && (
            <button className="relative p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-fresh-green)]/40 hover:shadow-sm transition-all duration-200">
              <Bell size={18} className="text-[var(--color-text-secondary)]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white text-xs flex items-center justify-center font-medium">
                  {notificationCount}
                </span>
              )}
            </button>
          )}
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-fresh-green)]/40 hover:shadow-sm transition-all duration-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-fresh-green)] flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{userName}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Produtor</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
