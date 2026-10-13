import { Link } from "react-router-dom";
import DitherReveal from "./DitherReveal";
import "../style/login.css";

export default function AuthLayout({ children, className = "" }) {
  return (
    <div className={`readflow-login ${className}`}>
      <div className="login-dither-background" aria-hidden="true">
        <DitherReveal
          image={{ src: "https://plus.unsplash.com/premium_photo-1726099913477-291d8ca697f8?w=600&auto=format&fit=crop&q=60" }}
          fit="cover" focusX={50} focusY={65} ditherStyle="bayer8" dotSize={5}
          revealRadius={220} revealSoftness={60} wave={true} waveSpeed={45} waveDensity={25}
        />
      </div>
      <div className="login-background-overlay" aria-hidden="true" />
      <header className="login-header">
        <Link to="/" className="login-brand" aria-label="Biblioteca Virtual, página inicial">
          Biblioteca<span>Virtual.</span>
        </Link>
        <Link to="/" className="login-back-link"><span aria-hidden="true">←</span>Voltar ao início</Link>
      </header>
      <main className="login-main"><section className="login-content">{children}</section></main>
      <footer className="login-footer">
        <span>© {new Date().getFullYear()} Biblioteca Virtual.</span>
        <span>Um universo de histórias espera por você.</span>
      </footer>
    </div>
  );
}
