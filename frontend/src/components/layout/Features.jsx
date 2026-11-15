import { Reveal } from "../ui/Reveal";

const features = [
  {
    name: "Início",
    description:
      "Um semáforo geral da fazenda e os indicadores já interpretados, com a recomendação do dia.",
  },
  {
    name: "Culturas",
    description:
      "Compare até três culturas para a sua fazenda, com factores favoráveis, riscos e limitações. Sem dados, sem veredicto.",
  },
  {
    name: "Calendário",
    description:
      "As melhores janelas de plantio, colheita e manejo, sempre com o porquê.",
  },
  {
    name: "Relatórios e alertas",
    description:
      "Um relatório semanal em linguagem simples e o histórico de alertas da fazenda.",
  },
];

export const Features = () => {
  return (
    <section className="bg-[#F2F3EB] px-6 sm:px-10 lg:px-16 xl:px-24 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-6xl mx-auto">
        <Reveal
          as="h2"
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0B3D2E] leading-tight mb-10 sm:mb-14"
        >
          O que encontra lá dentro.
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 sm:gap-y-12">
          {features.map((feature, index) => (
            <Reveal
              key={feature.name}
              delay={index * 0.1}
              className="max-w-md"
            >
              <h3 className="text-base sm:text-lg font-bold text-[#0B3D2E] mb-2">
                {feature.name}
              </h3>
              <p className="text-sm leading-7 text-[#4B5B56]">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
