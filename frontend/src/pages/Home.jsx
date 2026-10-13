import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RoundCarousel from "../components/RoundCarousel";
import DitherReveal from "../components/DitherReveal";
import "../style/home.css";

import livroArcosVermelho from "../assets/livro-arcos-vermelho.png";
import livroFolhasVerde from "../assets/livro-folhas-verde.png";
import livroGeometricoAzul from "../assets/livro-geometrico-azul.png";
import livroTipografiaBege from "../assets/livro-tipografia-bege.png";
import livroOndasTurquesa from "../assets/livro-ondas-turquesa.png";
import livroVerdeLaranjaTopo from "../assets/livro-verde-laranja-topo.png";

const carouselImages = [
  { src: livroArcosVermelho },
  { src: livroFolhasVerde },
  { src: livroGeometricoAzul },
  { src: livroTipografiaBege },
  { src: livroOndasTurquesa },
  { src: livroVerdeLaranjaTopo },
];

export default function Home() {
  const galleryRef = useRef(null);
  const [carouselSize, setCarouselSize] = useState({ width: 300, spacing: 3 });

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const resize = () => {
      const width = Math.round(
        Math.max(
          100,
          Math.min(380, gallery.clientWidth * 0.5, gallery.clientHeight * 0.64),
        ),
      );
      const spacing = Math.min(3.6, Math.max(2, gallery.clientWidth / 330));
      setCarouselSize((current) =>
        current.width === width && current.spacing === spacing
          ? current
          : { width, spacing },
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="readflow-home relative isolate">
      <div className="home-dither-background" aria-hidden="true">
        <DitherReveal
          image={{
            src: "https://plus.unsplash.com/premium_photo-1726099913477-291d8ca697f8?w=600&auto=format&fit=crop&q=60",
          }}
          fit="cover"
          focusX={50}
          focusY={65}
          ditherStyle="bayer8"
          dotSize={5}
          revealRadius={220}
          revealSoftness={60}
          wave={true}
          waveSpeed={45}
          waveDensity={25}
        />
      </div>

      <div className="home-background-overlay" aria-hidden="true" />

      <main className="relative z-10">
        <section className="home-section relative">
          <header className="home-header relative z-10 flex w-full items-center justify-between">
            <Link
              to="/"
              className="brand text-2xl font-semibold tracking-tight"
              aria-label="Biblioteca Virtual, página inicial"
            >
              Biblioteca<span>Virtual.</span>
            </Link>

            <nav
              aria-label="Acesso"
              className="flex items-center gap-3 text-sm font-medium sm:gap-5"
            >
              <Link to="/login" className="login-link">
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="signup-link rounded-full px-5 py-3"
              >
                Cadastrar-se
                <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </header>

          <div className="home-content relative z-10 mx-auto w-full">
            <div className="hero-content">
              <h1 className="hero-headline animate-fade-in max-w-5xl font-normal tracking-tighter">
                Curate your <em>mental library.</em>
              </h1>

              <p className="hero-description animate-fade-in">
                Descubra livros, explore novas ideias e encontre um espaço para
                fazer do conhecimento parte do seu dia.
              </p>

              <div className="hero-actions animate-fade-in flex flex-wrap">
                <Link
                  to="/cadastro"
                  className="primary-cta rounded-full font-semibold"
                >
                  Começar agora
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/login"
                  className="secondary-cta rounded-full font-semibold"
                >
                  Já tenho uma conta
                </Link>
              </div>
            </div>

            <div className="gallery-zone relative w-full">
              <div
                ref={galleryRef}
                className="round-carousel-container"
                aria-label="Carrossel tridimensional de livros"
              >
                <RoundCarousel
                  images={carouselImages}
                  imageWidth={carouselSize.width}
                  imageHeight={carouselSize.width * 1.5}
                  spacing={carouselSize.spacing}
                  speed={2.5}
                  direction="right"
                  drag={true}
                  sensitivity={2}
                  tilt={-7}
                  perspective={1600}
                  cornerRadius={5}
                  innerDim={3.5}
                  background="transparent"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
