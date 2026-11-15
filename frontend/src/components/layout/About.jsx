import { Reveal } from "../ui/Reveal";

const columns = [
  {
    title: "O que se mede",
    text: "Satélites da NASA, a previsão do tempo e, se tiver, sensores no solo registam o que acontece na sua região e na sua terra.",
  },
  {
    title: "O que significa",
    text: "Regras agronómicas transformam as medições num estado: verde, amarelo, vermelho ou cinzento quando faltam dados.",
  },
  {
    title: "O que fazer",
    text: "Recebe uma mensagem curta e a recomendação. O número bruto fica à distância de um toque, em «ver detalhes».",
  },
];

export const About = () => {
  return (
    <section className="bg-[#F1F3EC] py-12 sm:py-16 lg:py-18 px-4 sm:px-8 lg:px-18">
      <Reveal
        as="h2"
        className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-8 sm:mb-12 text-black/90 max-w-2xl leading-tight"
      >
        Do céu e da terra à decisão.
      </Reveal>
      <Reveal delay={0.1} className="flex my-4 rounded-2xl">
        <div className="w-[30%] h-1 bg-black"></div>
        <div className="w-[60%] h-1 bg-[#8B5E3C]"></div>
        <div className="w-[90%] h-1 bg-[#F2A024]"></div>
        <div className="w-[98%] h-1 bg-[#3FA34D] "></div>
        <div className="w-full h-1 bg-gray-500 "></div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {columns.map((column, index) => (
          <Reveal
            key={column.title}
            delay={0.15 + index * 0.1}
            className="flex flex-col gap-3 max-w-md"
          >
            <h4 className="text-2xl font-display font-bold text-black/90">
              {column.title}
            </h4>
            <p className="text-base text-black/70">{column.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
