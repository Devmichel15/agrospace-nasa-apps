import { motion } from "motion/react";
import { Link } from "react-router";

const lineVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const headlineLines = [
  <>Saiba o que fazer na sua</>,
  <>
    <span className="text-green-900">fazenda</span> antes de o tempo
  </>,
  <>decidir por si.</>,
];

export const Hero = () => {
  return (
    <main className="w-full flex-1 relative flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8 px-4 sm:px-8 lg:px-18 py-10 lg:py-0">
      <section className="w-full flex flex-col justify-center items-start gap-4">
        <h3 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-white max-w-xl lg:max-w-[600px] font-display leading-tight">
          {headlineLines.map((line, index) => (
            <span key={index} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 + index * 0.15 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h3>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          className="text-base text-white max-w-xl lg:max-w-lg"
        >
          O AgroSpace lê os satélites da NASA e os sensores do solo e diz-lhe,
          em palavras simples, quando plantar, regar ou proteger as culturas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
          className="flex flex-wrap gap-4 mt-8"
        >
          <Link to="/cadastro" className="bg-green-900 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 transition-colors">
            Criar Conta
          </Link>
          <Link to="/login" className="bg-transparent text-white border border-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-green-900 transition-colors">
            Ver resultado
          </Link>
        </motion.div>
      </section>

      <section className="w-full lg:w-auto flex justify-center lg:justify-end">
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg flex flex-col items-start justify-center gap-4 p-5 sm:p-6"
        >
          <div className="font-display font-bold text-xl sm:text-2xl">
            Atenção · Fazenda Boa Terra
          </div>
          <div className="font-display text-base text-[#8B5E3C]">
            Solo seco e chuva forte na quinta. Não adube antes da chuva.
          </div>
          <div className="text-[12px] text-[#8B5E3C] bg-[#FFF6E2] font-display p-1 border border-dashed border-[#F2A024] rounded-full">
            Previsão
          </div>
        </motion.div>
      </section>
    </main>
  );
};
