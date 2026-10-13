import { useEffect, useRef } from "react";

import livroArcosVermelho from "../assets/livro-arcos-vermelho.png";
import livroFolhasVerde from "../assets/livro-folhas-verde.png";
import livroGeometricoAzul from "../assets/livro-geometrico-azul.png";
import livroTipografiaBege from "../assets/livro-tipografia-bege.png";
import livroOndasTurquesa from "../assets/livro-ondas-turquesa.png";
import livroVerdeLaranjaTopo from "../assets/livro-verde-laranja-topo.png";

const fallbackImages = [
  { src: livroArcosVermelho },
  { src: livroFolhasVerde },
  { src: livroGeometricoAzul },
  { src: livroTipografiaBege },
  { src: livroOndasTurquesa },
  { src: livroVerdeLaranjaTopo },
];

export default function RoundCarousel({
  images = fallbackImages,
  imageWidth = 210,
  imageHeight = 315,
  spacing = 3.5,
  speed = 2.5,
  direction = "right",
  drag = true,
  sensitivity = 2,
  tilt = -5,
  perspective = 1800,
  innerDim = 3.5,
  background = "transparent",
  style = {},
}) {
  const items = images.length ? images : fallbackImages;
  const count = items.length;
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0, pointerId: null });
  const hoverRef = useRef(false);
  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 6 * (direction === "left" ? -1 : 1);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;
    // Project every corner through a full rotation. The tilted ring's visible
    // center differs from its transform origin, so fit and center its bounds.
    const radians = tilt * Math.PI / 180;
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let degrees = 0; degrees < 360; degrees++) {
      const angle = degrees * Math.PI / 180;
      for (const x of [-imageWidth / 2, imageWidth / 2]) {
        for (const y of [-imageHeight / 2, imageHeight / 2]) {
          const projectedX = x * Math.cos(angle) + radius * Math.sin(angle);
          const z = -x * Math.sin(angle) + radius * Math.cos(angle) - radius;
          const projectedY = y * cos - z * sin;
          const projectedZ = y * sin + z * cos;
          const factor = perspective / Math.max(1, perspective - projectedZ);
          minX = Math.min(minX, projectedX * factor);
          maxX = Math.max(maxX, projectedX * factor);
          minY = Math.min(minY, projectedY * factor);
          maxY = Math.max(maxY, projectedY * factor);
        }
      }
    }
    // Safety margin covers extrema between samples and the book shadows.
    const boundsWidth = maxX - minX + 64;
    const boundsHeight = maxY - minY + 64;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const fit = () => {
      // Leave room for shadows as well as the book faces. Never enlarge covers.
      const scale = Math.max(0, Math.min(1,
        container.clientWidth / boundsWidth,
        container.clientHeight / boundsHeight,
      ));
      stage.style.transform = `translate(${-centerX * scale}px, ${-centerY * scale}px) scale(${scale})`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [radius, imageWidth, imageHeight, tilt, perspective]);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };
    apply();
    const draw = (now) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      if (!motion.matches && !dragRef.current.active && !hoverRef.current) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= Math.pow(0.94, f * 60);
        } else {
          rotYRef.current += degPerSec * f;
        }
      }
      apply();
      rafRef.current = requestAnimationFrame(draw);
    };
    const onMotionChange = () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
      velRef.current = 0;
      if (!motion.matches) rafRef.current = requestAnimationFrame(draw);
    };
    motion.addEventListener("change", onMotionChange);
    onMotionChange();
    return () => {
      cancelAnimationFrame(rafRef.current);
      motion.removeEventListener("change", onMotionChange);
      lastRef.current = 0;
    };
  }, [radius, degPerSec, count]);

  const onPointerDown = (e) => {
    if (!drag || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { active: true, x: e.clientX, pointerId: e.pointerId };
    velRef.current = 0;
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
    // Manual dragging also works when automatic motion is disabled.
    if (ringRef.current)
      ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
  };
  const onPointerUp = (e) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
  };
  const faceBase = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    backgroundColor: "transparent",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
  return (
    <div
      ref={containerRef}
      className="round-carousel"
      aria-label="Carrossel tridimensional de livros. Arraste para girar."
      style={{
        ...style,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        minHeight: 0,
        background,
        cursor: drag ? "grab" : "default",
        touchAction: "pan-y",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <div
        ref={stageRef}
        style={{
          width: imageWidth,
          height: imageHeight,
          flexShrink: 0,
          perspective: `${perspective}px`,
          transformOrigin: "center",
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt}deg)`,
          }}
        >
          <div
            ref={ringRef}
            style={{
              position: "relative",
              width: imageWidth,
              height: imageHeight,
              transformStyle: "preserve-3d",
            }}
          >
            {items.map((img, i) => {
              const src = img?.src;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    style={{
                      ...faceBase,
                      backgroundImage: src ? `url("${src}")` : undefined,
                      filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.28))",
                    }}
                  />
                  <div
                    style={{
                      ...faceBase,
                      transform: "rotateY(180deg)",
                      backgroundImage: src ? `url("${src}")` : undefined,
                      filter: `brightness(${innerDim / 10}) drop-shadow(0 6px 8px rgba(0,0,0,0.28))`,
                    }}
                  />
                </div>
              );
            })}
          </div>
      </div>
      </div>
    </div>
  );
}

