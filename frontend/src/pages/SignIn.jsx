import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const SignIn = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signup(email.trim(), password, fullName.trim());
      navigate("/onboarding");
    } catch (err) {
      if (err.code === "email_confirmation") {
        setError(
          "Conta criada. Confirme o email que recebeu e depois inicie sessão.",
        );
      } else {
        setError(err.message || "Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen px-4 py-12 flex justify-center items-center">
      <div className="flex w-200 h-full shadow-lg rounded-2xl overflow-hidden">
        <div className="hidden w-[50%] h-full bg-[#0B3D2E] sm:flex items-center justify-center">
          <img src="/logo.png" alt="AgroSpace" className="bg-cover w-60" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-3">
          <h1 className="text-4xl font-display text-[#0B3D2E]">Criar Conta</h1>
          <p className="text-sm font-display mb-2 text-[#0B3D2E]/90">
            Seja bem-vindo à plataforma AgroSpace
          </p>
          {error && (
            <p className="text-sm text-red-600 mb-2 text-center" role="alert">
              {error}
            </p>
          )}
          <form className="flex flex-col w-full px-5" onSubmit={handleSubmit}>
            <label htmlFor="signin-nome">Nome</label>
            <input
              id="signin-nome"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Michel César"
              className="w-full p-2 ring rounded-lg ring-[#0B3D2E] my-2"
            />
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              className="w-full p-2 ring rounded-lg ring-[#0B3D2E] my-2"
            />

            <label htmlFor="signin-pass">Palavra-passe</label>
            <input
              id="signin-pass"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full p-2 ring rounded-lg ring-[#0B3D2E] my-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0B3D2E] px-6 py-2 mt-2 rounded-lg text-white font-display disabled:opacity-60"
            >
              {loading ? "A criar..." : "Criar conta"}
            </button>
          </form>

          <p className="text-sm mt-8 font-display">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-bold hover:underline text-[#0B3D2E]"
            >
              entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
