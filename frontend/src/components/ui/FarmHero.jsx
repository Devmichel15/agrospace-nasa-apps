import { MapPin, CalendarDays } from 'lucide-react';

export const FarmHero = ({ 
  farmName = "Fazenda Boa Terra",
  crops = ["Milho", "Tomate"],
  area = "12.5 ha"
}) => {
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-sm mb-8">
      <div className="absolute inset-0">
        <img 
          src="/images/hero-agri-01.jpg" 
          alt="Vista aérea de propriedade agrícola" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,47,36,0.92)] via-[rgba(16,47,36,0.7)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,47,36,0.4)] to-transparent" />
      </div>
      
      <div className="relative px-6 sm:px-10 py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs">
              <MapPin size={14} />
              <span>Propriedade agrícola</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs">
              <CalendarDays size={14} />
              <span className="capitalize">{date}</span>
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight mb-3">
            {farmName}
          </h1>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
            Inteligência agrícola para decisões mais precisas. Monitorização ambiental, interpretação de dados e recomendações contextualizadas.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/25 text-white text-sm">{area}</span>
            {crops.map((crop, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-white/12 backdrop-blur-sm border border-white/25 text-white text-sm">{crop}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
