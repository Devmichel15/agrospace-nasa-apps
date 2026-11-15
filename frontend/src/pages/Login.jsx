import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao entrar");
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
          <h1 className="text-4xl font-display text-[#0B3D2E]">Entrar</h1>
          <p className="text-sm font-display mb-2 text-[#0B3D2E]/90">
            Seja bem-vindo de volta à AgroSpace
          </p>
          {error && (
            <p className="text-sm text-red-600 mb-2 text-center" role="alert">
              {error}
            </p>
          )}
          <form className="flex flex-col w-full px-5" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              className="w-full p-2 ring rounded-lg ring-[#0B3D2E] my-2"
            />

            <label htmlFor="login-password">Palavra-passe</label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
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
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="text-sm mt-8 font-display">
            Ainda não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-bold hover:underline text-[#0B3D2E]"
            >
              criar conta
            </Link>
          </p>
          <Link to="/" className="mt-3 text-xs text-[#0B3D2E]/70 hover:underline">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </main>
  );
};
