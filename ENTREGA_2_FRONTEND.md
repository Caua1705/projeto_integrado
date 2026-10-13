# Entrega 2 — Frontend | Biblioteca Virtual

**Roteiro de apresentação:** aproximadamente 8 minutos, mostrando o código no VS Code e as telas no navegador.

## Requisitos

- Cadastro público de alunos (RF001), autenticação (RF006) e controle de perfis (RF010).
- Somente ALUNO pode se cadastrar publicamente; perfis privilegiados são responsabilidade do administrador (RN001).
- Preservar o frontend React + Vite, o Design System da Home e os serviços existentes.
- Recuperação de senha adiada. Integração com FastAPI ainda não homologada.

Todos os caminhos abaixo partem da raiz do repositório.

---

## 1. Configuração do React Router e Axios — 1 minuto

**Arquivos:** `frontend/src/App.tsx`, `frontend/src/utils/axios.js`, `frontend/.env.example` e `frontend/package.json`.

O React Router organiza a navegação: `/` é a Home, `/login` é o Login e `/cadastro` é o Cadastro. As áreas `/biblioteca` e `/admin` possuem proteção de acesso.

O cliente Axios centraliza a URL da API em `VITE_API_URL`, com padrão `http://localhost:8000` e timeout de 15 segundos. `frontend/src/services/auth.js` concentra as chamadas de autenticação e cadastro.

**Mostrar:** as rotas no VS Code e a navegação entre Home, Login e Cadastro.

---

## 2. Desenvolvimento da tela de Cadastro — 1 minuto e 30 segundos

**Arquivos:** `frontend/src/pages/Register.jsx`, `frontend/src/utils/registration.js` e `frontend/src/services/auth.js`.

O formulário recebe nome, CPF, telefone, e-mail, senha e confirmação. O utilitário aplica máscaras, verifica CPF, campos obrigatórios, e-mail e igualdade das senhas. A tela apresenta erros acessíveis e bloqueia envios simultâneos durante o carregamento.

O serviço envia `POST /auth/registrar` com apenas `nome`, `cpf`, `telefone`, `email` e `senha`; CPF e telefone seguem sem máscara. Não envia confirmação nem perfil. Somente após sucesso HTTP navega ao Login com a mensagem de cadastro concluído.

`frontend/src/components/AuthLayout.jsx` e os estilos `frontend/src/style/global.css`, `login.css` e `register.css` compartilham a identidade visual, o header e o DitherReveal.

**Mostrar:** as máscaras e os erros de um formulário incompleto. Cadastro real depende da API.

---

## 3. Desenvolvimento da tela de Login e armazenamento do JWT — 1 minuto e 30 segundos

**Arquivos:** `frontend/src/pages/Login.jsx`, `frontend/src/services/auth.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/utils/authSession.js`, `frontend/src/utils/session.js` e `frontend/src/utils/auth.js`.

O Login possui e-mail, senha, mostrar/ocultar, carregamento e mensagens de erro. O serviço chama `POST /auth/login`; a sessão exige `access_token` e `token_type` Bearer e consulta `GET /usuarios/eu` antes de liberar acesso.

`session.js` guarda somente o token em `sessionStorage`, com alternativa em memória se o armazenamento não estiver disponível. Senhas e perfis não são persistidos. `AuthContext` disponibiliza a sessão ao React; `authSession.js` cuida da restauração, cancelamento, nova tentativa e logout. Respostas antigas não podem restaurar uma sessão encerrada.

**Mostrar:** a tela, o controle da senha e o fluxo no código. Não demonstrar Login bem-sucedido sem confirmação da API real.

---

## 4. Implementação do interceptor Axios — 1 minuto

**Arquivo:** `frontend/src/utils/axios.js`.

O interceptor adiciona `Authorization: Bearer <token>` às chamadas privadas. Login e Cadastro não recebem esse cabeçalho. Uma resposta 401 de uma requisição da sessão atual elimina o token e informa a expiração ao gerenciamento de sessão.

O interceptor não faz navegação diretamente: a proteção de rotas conduz ao Login. Um 401 atrasado de outra sessão não encerra a sessão nova.

**Mostrar:** os interceptores de requisição e resposta e os testes em `frontend/tests/auth.test.mjs`.

---

## 5. Implementação das rotas protegidas — 1 minuto

**Arquivos:** `frontend/src/components/ProtectedRoute.jsx`, `frontend/src/App.tsx` e `frontend/src/pages/Access.jsx`.

Visitantes são encaminhados ao Login. Durante a verificação da identidade, o conteúdo privado permanece bloqueado; falhas de conexão permitem tentar novamente. Após autenticação, a guarda confere os perfis permitidos para cada rota.

`Access.jsx` contém as estruturas mínimas da biblioteca e da administração, com navegação e logout. Consulta de livros, favoritos, downloads e gestão ainda são funcionalidades futuras.

**Mostrar:** abrir `/biblioteca` e `/admin` sem sessão e conferir o redirecionamento ao Login.

---

## 6. Recuperação de senha — ADIADA — 15 segundos

**Arquivos de referência:** `frontend/src/pages/Login.jsx` e `frontend/src/App.tsx`.

Não há tela, rota ou chamada de recuperação de senha. Essa funcionalidade fica para uma entrega posterior, após definição do contrato com o backend.

**Mostrar:** a ausência desse fluxo nas rotas atuais.

---

## 7. Controle dos perfis ALUNO, PROFESSOR e ADMINISTRADOR — 1 minuto

**Arquivos:** `frontend/src/utils/auth.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/components/ProtectedRoute.jsx`, `frontend/src/App.tsx` e `frontend/src/pages/Access.jsx`.

O perfil vem da resposta de `/usuarios/eu`; valores desconhecidos são rejeitados. ALUNO e PROFESSOR compartilham o acesso básico à `/biblioteca`. ADMINISTRADOR também pode acessar `/admin` e visualizar o link de administração.

O Cadastro não oferece seleção de perfil: a API deve atribuir ALUNO. A proteção visual não substitui a autorização do servidor; toda operação privada precisa validar JWT e permissões no backend.

**Mostrar:** as listas de perfis das rotas e a condição do link administrativo. A demonstração com usuários reais dos três perfis depende da integração.

---

## Verificações e pendências — encerramento

- `npm test` em `frontend`: 18 testes aprovados, cobrindo cadastro, máscaras, sessão, cabeçalhos, expiração e redirecionamentos. Usam dados controlados, sem integração real.
- `npm run build` em `frontend`: aprovado, incluindo `tsc --noEmit` e build Vite.
- Navegador: Home, Login e Cadastro verificados em 1920×1080, 1366×768 e 390×844, sem overflow horizontal; máscaras, validação, controle da senha, navegação e bloqueio de visitantes conferidos.
- Lint não executado: não há script nem configuração disponível.
- Nenhum arquivo do backend foi modificado. Nenhuma API fictícia foi criada.

**Situação:** frontend estruturalmente preparado para integração futura, mas sem homologação de ponta a ponta com FastAPI.

**Pendências do backend:** disponibilizar os endpoints e confirmar o Login atual em formulário `username`/`password`, a resposta `access_token`/`token_type`, o campo `perfil` de `/usuarios/eu`, CORS, regras de senha e erros reais. Validar cadastro público como ALUNO, duplicidades, expiração e autorização com contas reais dos três perfis. O logout atual remove a sessão local; revogação remota depende de contrato da API.
