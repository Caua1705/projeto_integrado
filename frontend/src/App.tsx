import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function App() {
  const [resposta, setResposta] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function verificarApi() {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/health`);
      const dados = await res.json();
      setResposta(JSON.stringify(dados));
    } catch (erro) {
      setResposta(`Erro ao conectar com a API: ${String(erro)}`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "4rem" }}>
      <h1>Biblioteca Virtual</h1>
      <button onClick={verificarApi} disabled={carregando}>
        {carregando ? "Verificando..." : "Verificar API"}
      </button>
      {resposta && <pre>{resposta}</pre>}
    </main>
  );
}
