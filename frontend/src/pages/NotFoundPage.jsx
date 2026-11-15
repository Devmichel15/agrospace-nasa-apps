import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-display text-[#0B3D2E] font-bold">404</h1>
      <p className="mt-4 text-xl text-[#0B3D2E]/90">Página não encontrada</p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-2 rounded-lg bg-[#0B3D2E] text-white font-display"
      >
        Ir para o Dashboard
      </Link>
    </main>
  );
};
