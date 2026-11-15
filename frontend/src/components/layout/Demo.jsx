import { useState } from "react";
import { CardDemo } from "../ui/CardDemo";
import { Reveal } from "../ui/Reveal";

const states = [
  {
    key: "tudo-bem",
    label: "Tudo bem",
    color: "green",
    title: "Condições favoráveis para a cultura.",
    description: "Sem chuva forte prevista e condições estáveis para os próximos dias.",
    advice: "Continue a acompanhar a cultura e mantenha o plano de rega.",
    source: "Previsão",
    confidence: "Confiança alta",
  },
  {
    key: "atencao",
    label: "Atenção",
    color: "orange",
    title: "Possível redução da chuva esta semana.",
    description: "A precipitação prevista pode ficar abaixo do necessário para a cultura.",
    advice: "Verifique a humidade do solo e prepare um plano de rega.",
    source: "Previsão",
    confidence: "Confiança média",
  },
  {
    key: "perigo",
    label: "Perigo",
    color: "red",
    title: "Chuva forte prevista para quinta-feira.",
    description: "Cerca de 38 mm em 24 horas. Risco de encharcamento nas culturas.",
    advice: "Não adube antes da chuva e verifique a drenagem do terreno.",
    source: "Previsão",
    confidence: "Confiança média",
  },
  {
    key: "sem-dados",
    label: "Sem dados",
    color: "gray",
    title: "Ainda não existem dados suficientes.",
    description: "Não foi possível obter informações recentes para esta área.",
    advice: "Tente novamente mais tarde ou verifique a disponibilidade dos dados.",
    source: "Dados indisponíveis",
    confidence: "Sem confiança disponível",
  },
];

const colorDot = {
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  gray: "#9ca3af",
};

export const Demo = () => {
  const [active, setActive] = useState("perigo");

  return (
    <section className="bg-[#0B3D2E] px-6 sm:px-10 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-22 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="flex flex-col">
          <Reveal
            as="h2"
            className="text-4xl sm:text-5xl font-display font-extrabold mb-6 sm:mb-8 max-w-xl leading-tight"
          >
            Uma resposta, não uma tabela de números.
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="text-base sm:text-lg text-white/70 max-w-xl leading-7 sm:leading-8"
          >
            Escolha uma situação e veja o que o agricultor lê no ecrã. Cada
            resposta diz de onde vem e quão segura é.
          </Reveal>

          <Reveal delay={0.2} className="flex gap-3 mt-8 flex-wrap">
            {states.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                  active === s.key
                    ? "bg-white text-[#0B3D2E] border-white"
                    : "bg-transparent text-white border-white/40 hover:border-white/70"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colorDot[s.color] }}
                  aria-hidden
                />
                {s.label}
              </button>
            ))}
          </Reveal>

          <Reveal as="p" delay={0.3} className="text-xs text-white/60 mt-4">
            Exemplo com dados fictícios.
          </Reveal>
        </div>

        <Reveal delay={0.25} className="w-full">
          <CardDemo active={active} states={states} />
        </Reveal>
      </div>
    </section>
  );
};
