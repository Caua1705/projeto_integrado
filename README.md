# Biblioteca Virtual

A **Biblioteca Virtual** é uma biblioteca totalmente digital para escolas públicas, sem empréstimo nem acervo físico. Pelo próprio sistema, o aluno consulta o acervo, favorita livros e baixa cada um em PDF.

## Stack

- Python + FastAPI (backend)
- PostgreSQL (banco de dados)
- React + TypeScript com Vite (frontend)
- Docker Compose (ambiente local)

## Estrutura de pastas

```
biblioteca-virtual/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .env.example
├── docker-compose.yml
└── README.md
```

## Como rodar

Pré-requisitos: Docker com Docker Compose e Node.js 20 ou mais recente.

1. Crie o `.env` e troque a senha do banco:

   ```bash
   cp .env.example .env
   ```

2. Suba o banco e o backend:

   ```bash
   docker compose up -d --build
   ```

3. Confira se a API responde `{"status":"ok"}`:

   ```bash
   curl http://localhost:8000/health
   ```

4. Instale as dependências do frontend:

   ```bash
   npm install --prefix frontend
   ```

5. Rode o frontend e abra http://localhost:5173:

   ```bash
   npm run dev --prefix frontend
   ```
