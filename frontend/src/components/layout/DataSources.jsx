import { Reveal } from "../ui/Reveal";

const badgeStyles = {
  Observado: "bg-[#E6F0FA] text-[#1E4E79]",
  Previsão: "bg-[#FFF6E2] text-[#B5701A] border border-dashed border-[#F2A024]",
  Estimado: "bg-[#F3EDE0] text-[#7A5A2B]",
  Sensor: "bg-[#E4F4E6] text-[#2E6B38]",
};

const Badge = ({ type }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyles[type]}`}
  >
    {type}
  </span>
);

const rows = [
  {
    source: "NASA POWER",
    type: "Observado",
    description: (
      <>
        Temperatura e clima diários, com histórico.{" "}
        <strong className="font-semibold text-[#0B3D2E]">
          Não é previsão.
        </strong>
      </>
    ),
  },
  {
    source: "NASA POWER",
    type: "Observado",
    description: (
      <>
        Chuva e humidade da zona radicular por satélite/modelo.{" "}
        <strong className="font-semibold text-[#0B3D2E]">
          Resolução regional (~50 km): não mede a sua parcela.
        </strong>
      </>
    ),
  },
  {
    source: "Open-Meteo",
    type: "Previsão",
    description: (
      <>
        Condições atuais e previsão de 3 dias, fonte externa à NASA.{" "}
        <strong className="font-semibold text-[#0B3D2E]">
          A incerteza cresce com os dias.
        </strong>
      </>
    ),
  },
  {
    source: "SoilGrids",
    type: "Estimado",
    description: (
      <>
        pH, textura e matéria orgânica do solo.{" "}
        <strong className="font-semibold text-[#0B3D2E]">
          Não substitui análise de laboratório.
        </strong>
      </>
    ),
  },
  {
    source: "Sensores da fazenda",
    type: "Sensor",
    description: (
      <>
        Ainda não integrados nesta versão.{" "}
        <strong className="font-semibold text-[#0B3D2E]">
          Sem leituras in-situ nem calibração local.
        </strong>
      </>
    ),
  },
];

export const DataSources = () => {
  return (
    <section className="bg-[#F2F3EB] px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <Reveal
          as="h2"
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0B3D2E] max-w-3xl leading-tight mb-10 sm:mb-14"
        >
          De onde vem cada dado e o que ele não diz.
        </Reveal>

        <div className="border-t-2 border-[#0B3D2E]/80">
          {rows.map((row, index) => (
            <Reveal
              key={row.source}
              delay={index * 0.06}
              y={16}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 py-5 border-b border-[#0B3D2E]/10 md:grid md:grid-cols-[1.2fr_0.7fr_2fr] md:gap-6 md:py-6"
            >
              <span className="order-1 text-base sm:text-lg font-bold text-[#0B3D2E]">
                {row.source}
              </span>
              <span className="order-2 md:order-none">
                <Badge type={row.type} />
              </span>
              <p className="order-3 w-full md:w-auto text-sm sm:text-base leading-7 text-[#3A4A45]">
                {row.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
