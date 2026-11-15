import { Reveal } from "../ui/Reveal";

export const Footer = () => {
  return (
    <footer className="bg-[#062D23] px-6 sm:px-10 lg:px-16 xl:px-24 py-5 sm:py-6">
      <Reveal
        y={12}
        className="max-w-6xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-xs text-[#9DB8AE]">
          AgroSpace · Desenvolvido para o NASA Space Apps Challenge 2026
        </p>
        <p className="text-xs text-[#9DB8AE]">
          As pontuações são indicativas e não substituem um agrónomo.
        </p>
      </Reveal>
    </footer>
  );
};
