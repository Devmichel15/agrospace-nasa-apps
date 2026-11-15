import { useState, useRef, useEffect } from 'react';
import { Home, Sprout, Cpu, Calendar, FileText, User, Info, ChevronDown, LogOut, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Visão geral' },
  { to: '/culturas', icon: Sprout, label: 'Culturas' },
  { to: '/sensores', icon: Cpu, label: 'Sensores' },
  { to: '/calendario', icon: Calendar, label: 'Calendário' },
  { to: '/relatorios', icon: FileText, label: 'Relatórios' },
  { to: '/chat', icon: MessageCircle, label: 'Assistente' },
];

const secondaryNav = [
  { to: '/sobre-dados', icon: Info, label: 'Sobre estes dados' },
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const displayName = user?.full_name || user?.email || 'Utilizador';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-[290px] h-screen sticky top-0 bg-gradient-to-b from-[var(--color-forest)] via-[var(--color-forest)] to-[var(--color-deep-green)] text-white shadow-[0_10px_60px_-20px_rgba(16,47,36,0.9)]">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/logo.png" alt="AgroSpace" className="w-11 h-11 object-contain" />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-lime-accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold tracking-tight leading-tight">AgroSpace</h1>
            <p className="text-xs text-white/60 leading-tight">Inteligência Agrícola</p>
          </div>
        </Link>
        
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-4 space-y-6">
        <div>
          <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-white/40">Explorar</p>
          <ul className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-white/75 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[var(--color-lime-accent)] shadow-[0_0_0_4px_rgba(183,217,154,0.08)]" />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      active ? 'bg-[var(--color-lime-accent)]/18' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon size={18} className={active ? 'text-[var(--color-lime-accent)]' : 'text-white/90'} />
                    </div>
                    <span className="text-sm font-medium tracking-tight">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.16em] text-white/40">Suporte</p>
          <ul className="space-y-1">
            {secondaryNav.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      active
                        ? 'text-white bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      active ? 'bg-white/12' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium tracking-tight">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User profile */}
      <div className="px-4 pb-5 relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/6 hover:bg-white/9 border border-white/12 transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-lime-accent)] to-[var(--color-fresh-green)] flex items-center justify-center text-[var(--color-deep-green)] font-semibold">
            {initial}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
            <p className="text-xs text-white/60 leading-tight truncate">{email}</p>
          </div>
          <ChevronDown size={16} className={`text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 rounded-2xl bg-[#0f2a22]/98 backdrop-blur-xl border border-white/12 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-white/60">{email || 'Conta AgroSpace'}</p>
            </div>
            <div className="p-1">
              <Link to="/perfil" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/8 text-sm">
                <User size={16} />
                <span>Perfil</span>
              </Link>
              
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/8 text-sm text-left text-white/80" onClick={() => { logout(); navigate("/login"); setProfileOpen(false); }}>
                <LogOut size={16} />
                <span>Terminar sessão</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
