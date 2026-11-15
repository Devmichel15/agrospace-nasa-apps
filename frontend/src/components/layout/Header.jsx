import { useState } from "react";
import { Link } from "react-router";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Sobre", href: "/" },
  { label: "Contacto", href: "/" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full h-20 flex justify-between items-center px-4 sm:px-8 lg:px-18 font-display z-100">
      <h1 className="text-2xl font-bold text-white">
        Agro<span className="text-green-900">Space</span>
      </h1>

      <nav className="hidden md:flex items-center gap-5 list-none text-white">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
        <button className="bg-[#F2A024] px-4 py-2 rounded-full hover:bg-[#F2A024]/80 transition-colors cursor-pointer">
          Entrar
        </button>
      </nav>

      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="md:hidden text-white p-2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-20 left-0 w-full bg-[#0B3D2E] md:hidden flex flex-col gap-4 px-4 py-6 text-white list-none">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <Link
            to="/login"
            className="bg-[#F2A024] text-[#0B3D2E] px-4 py-2 rounded-full font-semibold "
          >
            Entrar
          </Link>
        </div>
      )}
    </header>
  );
};
