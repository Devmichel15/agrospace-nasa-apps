import { AppLayout } from '../../components/layout/AppLayout';
import { DataOriginBadge } from '../../components/ui/shared/DataOriginBadge';
import { Database, Satellite, Cloud, Sprout, Cpu } from 'lucide-react';

export const SobreDadosPage = () => {
  return (
    <AppLayout>
      <header className="mb-10">
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">Transparência científica</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Sobre estes dados</h1>
        <p className="text-base text-[var(--color-text-secondary)] mt-2 max-w-3xl">
          Fontes, metodologia, origem e limitações. O front-end apresenta apenas as fontes
          realmente consultadas pelo backend, sem inventar leituras de sensores.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
                <Cloud size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-lg font-semibold">Open-Meteo</h3>
            </div>
            <DataOriginBadge origin="PREVISAO" />
          </div>
          <p className="text-sm text-[var(--color-text-primary)] mb-2">
            Condições atuais, chuva observada nos últimos 7 dias e previsão diária de 3 dias
            (temperatura máxima/mínima e precipitação).
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Limitação: a previsão tem apenas 3 dias; a incerteza aumenta com o horizonte.
            Se o serviço falhar, o backend usa a NASA POWER como alternativa (sem previsão).
          </p>
        </article>

        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
                <Satellite size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-lg font-semibold">NASA POWER</h3>
            </div>
            <DataOriginBadge origin="OBSERVADO" />
          </div>
          <p className="text-sm text-[var(--color-text-primary)] mb-2">
            Temperatura, humidade relativa, chuva acumulada e humidade da zona radicular
            (GWETROOT), com resumo dos últimos 14 dias.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Limitação: resolução de ~50 km e atraso de alguns dias. São dados observados/
            reconstruídos, não previsão em tempo real.
          </p>
        </article>

        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
                <Database size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-lg font-semibold">SoilGrids (ISRIC)</h3>
            </div>
            <DataOriginBadge origin="ESTIMADO" />
          </div>
          <p className="text-sm text-[var(--color-text-primary)] mb-2">
            pH, carbono orgânico, argila e areia para os primeiros 5 cm do solo.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Limitação: estimativa global (~250 m) a partir de modelos. Não substitui uma
            análise laboratorial.
          </p>
        </article>

        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
                <Cpu size={18} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-display text-lg font-semibold">Sensores físicos</h3>
            </div>
            <DataOriginBadge origin="SENSOR" />
          </div>
          <p className="text-sm text-[var(--color-text-primary)] mb-2">
            Ainda não estão integrados nesta versão. A página de sensores mostra apenas
            estimativas de satélite e modelos, identificadas como tal.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Limitação: sem leituras in-situ, não há calibração local nem monitorização em
            tempo real.
          </p>
        </article>

        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
              <Sprout size={18} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="font-display text-lg font-semibold">Como a análise é calculada</h3>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--color-text-secondary)]">
            <li>Regras de demonstração comparam temperatura, chuva (7 dias), previsão, pH e humidade NASA com intervalos por cultura.</li>
            <li>Culturas com regras específicas: milho, mandioca, feijão e tomate. Outras usam intervalos genéricos.</li>
            <li>O estado final é “risco” se existir um fator de risco, “atenção” se existir um aviso, e “favorável” caso contrário.</li>
            <li>Não há comparação com médias históricas de 20 anos nem séries plurianuais no backend atual.</li>
            <li>A IA é opcional: sem chave configurada no servidor, o assistente responde com uma mensagem honesta de indisponibilidade.</li>
          </ul>
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            Isto não é aconselhamento agronómico profissional. Consulte um agrónomo local
            antes de decisões importantes.
          </p>
        </article>
      </div>
    </AppLayout>
  );
};
