import { About } from "../components/layout/About";
import { CTA } from "../components/layout/CTA";
import { DataSources } from "../components/layout/DataSources";
import { Demo } from "../components/layout/Demo";
import { Features } from "../components/layout/Features";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/layout/Hero";
import { Team } from "../components/layout/Team";

export const Landing = () => {
  return (
    <div className="relative isolate flex w-full flex-col">
      <div className="relative isolate flex w-full flex-col min-h-screen">
        <img
          src="/bg-hero01.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        {/* Overlay verde subtil para melhorar a leitura do texto */}
        <div className="absolute inset-0 -z-10 bg-linear-to-tr from-[#0B3D2E]/25 via-[#0B3D2E]/10 to-transparent" />
        <Header className="relative z-10" />
        <Hero className="relative z-10" />
      </div>
      <About />
      <Demo />
      <DataSources />
      <Features />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
};
