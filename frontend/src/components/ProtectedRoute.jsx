import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "./AuthLayout";
import "../style/session.css";

export default function ProtectedRoute({ profiles }) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.status === "anonymous") return <Navigate to="/login" replace state={{ from: location.pathname, sessionExpired: auth.reason === "expired" }} />;
  if (auth.status !== "authenticated") return (
    <AuthLayout>
      <section className="login-card session-status" role="status" aria-live="polite">
        <h1>{auth.status === "checking" ? "Confirmando seu acesso…" : "Não foi possível confirmar seu acesso"}</h1>
        {auth.status === "error" && <><p>{auth.error}</p><button className="login-submit" onClick={auth.retry}>Tentar novamente</button><button className="session-link-button" onClick={auth.logout}>Voltar ao Login</button></>}
      </section>
    </AuthLayout>
  );
  if (profiles && !profiles.includes(auth.user.perfil)) return <Navigate to="/biblioteca" replace />;
  return <Outlet />;
}
