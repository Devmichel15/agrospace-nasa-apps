import { Navigate, Outlet, Route, Routes } from "react-router";
import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { Onboarding } from "./pages/Onboarding";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CulturasPage } from "./pages/culturas/CulturasPage";
import { CalendarioPage } from "./pages/calendario/CalendarioPage";
import { RelatoriosPage } from "./pages/relatorios/RelatoriosPage";
import { PerfilPage } from "./pages/perfil/PerfilPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SobreDadosPage } from "./pages/transparencia/SobreDadosPage";
import { SensoresPage } from "./pages/detalhes/SensoresPage";
import { ChuvaDetalhePage } from "./pages/detalhes/ChuvaDetalhePage";
import { Previsao7DiasPage } from "./pages/detalhes/Previsao7DiasPage";
import {
  InterpretacaoPage,
  DadosInsuficientesPage,
  AlertasPage,
} from "./pages/interpretacoes/InterpretacoesPage";
import { Chatbot } from "./pages/chat/Chatbot";
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-warm-bg)]">
        <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          <p className="text-sm">A validar sessão...</p>
        </div>
      </main>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<SignIn />} />
      <Route
        path="/onboarding"
        element={
          <Protected>
            <Onboarding />
          </Protected>
        }
      />
      <Route
        element={
          <Protected>
            <Outlet />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/culturas" element={<CulturasPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/sobre-dados" element={<SobreDadosPage />} />
        <Route path="/sensores" element={<SensoresPage />} />
        <Route path="/chuva" element={<ChuvaDetalhePage />} />
        <Route path="/previsao" element={<Previsao7DiasPage />} />
        <Route path="/interpretacao" element={<InterpretacaoPage />} />
        <Route path="/sem-dados" element={<DadosInsuficientesPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/chat" element={<Chatbot />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default App;
