# Entrega 2 — Autenticação e Perfis

RF001 cadastro · RF006 login · RF010 perfis de acesso

---

# Passo 1 — Model

`models/usuario.py`

Classe `Usuario` = tabela no banco. Cada atributo é uma coluna.

Email único, por causa da RN001.

Classe `Perfil` = os três níveis de acesso.

---

# Passo 2 — Schemas

`schemas/usuario.py`

Definem o que entra e sai da API.

A tabela guarda a senha com hash. O schema de resposta não devolve senha.

É daqui que sai a documentação automática.

---

# Passo 3 — Rotas

`routers/auth.py`

Rotas de cadastrar, login e usuário logado. Depois, no passo 5, entra a de listar usuários.

Publiquei primeiro com dados fixos, para o frontend começar sem esperar o backend.

A tabela passa a ser criada sozinha quando a aplicação sobe.

---

# Passo 4 — Cadastro e login reais

`seguranca.py` + `routers/auth.py`

A senha nunca é salva. O que fica no banco é o hash feito com bcrypt.

Cadastro: verifica se o email já existe.

Login: confere a senha e devolve o token JWT.

---

# Passo 5 — Perfis de acesso (RF010)

`dependencias.py`

Uma dependência lê o token e identifica o usuário.

Outra bloqueia quem não tem o perfil permitido.

Demonstração: rota de listar usuários só para administrador. Aluno recebe 403.

---

# Próxima entrega

Recuperação de senha (RF011), adiada por depender de envio de email.