import { Link } from "react-router";
import { Reveal } from "../ui/Reveal";

export const CTA = () => {
  return (
    <section className="bg-[#0B3D2E] px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl">
          <Reveal
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-5 sm:mb-6"
          >
            Comece pela localização da fazenda.
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="text-base sm:text-lg text-white/75 leading-7 sm:leading-8 mb-8"
          >
            Crie a conta, diga o que planta e onde fica a terra. O resto é com
            os satélites.
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/login" className="bg-[#F2A024] text-[#0B3D2E] px-6 py-3 rounded-full font-bold hover:bg-[#F2A024]/85 transition-colors">
              Criar conta
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
