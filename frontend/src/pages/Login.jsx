import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, BookOpen, LoaderCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { authErrorMessage, loginDestination } from "../utils/auth.js";
import "../style/login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setSubmitting(true);
    setSubmitMessage("");
    const request = new AbortController();
    controller.current = request;
    try {
      const user = await login({ email, password }, request.signal);
      if (user && !request.signal.aborted) {
        setPassword("");
        navigate(loginDestination(location.state?.from, user.perfil), { replace: true });
      }
    } catch (error) {
      if (!request.signal.aborted) setSubmitMessage(authErrorMessage(error));
    } finally {
      pending.current = false;
      if (!request.signal.aborted) setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-intro animate-login">
        <span className="login-eyebrow">
          <span className="login-eyebrow-line" />
          SEU ESPAÇO DE LEITURA
        </span>

        <h1 className="login-title">
          Sua próxima história <em>continua aqui.</em>
        </h1>

        <p className="login-description">
          Entre na sua conta e volte a explorar um universo de livros,
          ideias e descobertas.
        </p>
      </div>

      <section className="login-card animate-login" aria-labelledby="login-card-title">
        <div className="login-card-heading">
          <div className="login-card-icon">
            <BookOpen size={23} strokeWidth={1.6} />
          </div>

          <h2 id="login-card-title">Bem-vindo de volta</h2>
          <p>Acesse sua biblioteca pessoal.</p>
        </div>

        {location.state?.registrationComplete && (
          <p className="login-notice" role="status">Cadastro concluído. Entre com seu e-mail e senha.</p>
        )}
        {location.state?.sessionExpired && <p className="login-notice" role="status">Sua sessão terminou. Entre novamente.</p>}
        <form onSubmit={handleSubmit} className="login-form" aria-busy={submitting}>
          <div className="login-field">
            <label htmlFor="login-email">E-mail</label>

            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              required
              disabled={submitting}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitMessage("");
              }}
            />
          </div>

          <div className="login-field">
            <div className="login-field-heading">
              <label htmlFor="login-password">Senha</label>

            </div>

            <div className="login-password-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                disabled={submitting}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setSubmitMessage("");
                }}
              />

              <button
                type="button"
                disabled={submitting}
                className="login-password-toggle"
                aria-label={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
                aria-pressed={showPassword}
                aria-controls="login-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? <><LoaderCircle size={19} className="auth-spinner" aria-hidden="true" />Entrando…</> : <>Entrar na minha biblioteca<ArrowRight size={19} aria-hidden="true" /></>}
          </button>
          <p className="login-submit-message" role="alert" aria-live="polite">
            {submitMessage}
          </p>
        </form>

        <div className="login-divider">
          <span />
          <span>OU</span>
          <span />
        </div>

        <p className="login-register">
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro">Cadastre-se gratuitamente</Link>
        </p>
      </section>
    </AuthLayout>
  );
}

