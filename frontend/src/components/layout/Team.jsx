import { Reveal } from "../ui/Reveal";

export const Team = () => {
  return (
    <section className="bg-[#F2F3EB] px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <Reveal
          as="h2"
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#0B3D2E] max-w-3xl leading-tight mb-4"
        >
          A equipa por trás do AgroSpace.
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="text-base sm:text-lg leading-7 sm:leading-8 text-[#4B5B56] max-w-2xl mb-10 sm:mb-14"
        >
          Estamos a competir no NASA Space Apps Challenge 2026. Veja a nossa
          apresentação.
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative aspect-video w-full max-w-4xl rounded-2xl border border-dashed border-[#0B3D2E]/30 bg-white/50 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B3D2E]/90">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="text-sm sm:text-base font-semibold text-[#0B3D2E]">
              Espaço reservado para o vídeo de apresentação
            </p>
            <p className="text-xs sm:text-sm text-[#4B5B56]">
              Substituir por um elemento &lt;video&gt; ou &lt;iframe&gt;.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
