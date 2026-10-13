import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import "../style/session.css";

export default function Access({ admin = false }) {
  const { user, logout } = useAuth();
  return (
    <AuthLayout>
      <div className="login-intro animate-login">
        <span className="login-eyebrow">BIBLIOTECA VIRTUAL</span>
        <h1 className="login-title">
          {admin ? "Administração" : "Sua biblioteca"}
          <em> em um só lugar.</em>
        </h1>
        <p className="login-description">
          {admin
            ? "Acesso reservado ao gerenciamento da biblioteca."
            : "Seu espaço para consultar livros, organizar favoritos e acessar leituras."}
        </p>
      </div>
      <section
        className="login-card session-panel"
        aria-labelledby="session-title"
      >
        <h2 id="session-title">
          {admin ? "Acesso administrativo" : "Acesso confirmado"}
        </h2>
        <p>
          Perfil: <strong>{user.perfil}</strong>
        </p>
        <p>
          {admin
            ? "Gerenciamento de usuários, acervo, relatórios e gráficos serão disponibilizados nas próximas entregas."
            : "Consulta, favoritos e download de livros serão disponibilizados nas próximas entregas."}
        </p>
        <nav aria-label="Áreas da biblioteca" className="session-navigation">
          {admin ? (
            <Link to="/biblioteca">Minha biblioteca</Link>
          ) : (
            user.perfil === "ADMINISTRADOR" && (
              <Link to="/admin">Administração</Link>
            )
          )}
          <Link to="/">Página inicial</Link>
        </nav>
        <button className="login-submit" onClick={logout}>
          Sair da conta
        </button>
      </section>
    </AuthLayout>
  );
}
