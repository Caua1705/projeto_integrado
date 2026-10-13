export const PROFILES = Object.freeze(["ALUNO", "PROFESSOR", "ADMINISTRADOR"]);

export function readUser(data) {
  if (!data || !PROFILES.includes(data.perfil))
    throw new Error("INVALID_USER_RESPONSE");

  return Object.freeze({
    perfil: data.perfil,
    nome: typeof data.nome === "string" ? data.nome : "",
  });
}

export function readToken(data) {
  if (
    typeof data?.access_token !== "string" ||
    !data.access_token.trim() ||
    typeof data.token_type !== "string" ||
    data.token_type.toLowerCase() !== "bearer"
  ) {
    throw new Error("INVALID_TOKEN_RESPONSE");
  }
  return data.access_token;
}

export function loginDestination(from, profile) {
  if (from === "/admin" && profile === "ADMINISTRADOR") return "/admin";
  return "/biblioteca";
}

export function authErrorMessage(error) {
  if (
    ["INVALID_TOKEN_RESPONSE", "INVALID_USER_RESPONSE"].includes(error?.message)
  ) {
    return "Não foi possível confirmar seu acesso. Tente novamente mais tarde.";
  }
  if (!error?.response)
    return error?.code === "ECONNABORTED"
      ? "O servidor demorou para responder. Tente novamente."
      : "Não foi possível conectar ao serviço. Confira sua conexão e tente novamente.";
  if (error.response.status === 401)
    return "E-mail ou senha inválidos, ou sessão expirada. Entre novamente.";
  if (error.response.status === 403)
    return "O serviço não permitiu o acesso a esta conta.";
  if (error.response.status === 422)
    return "Confira seu e-mail e senha e tente novamente.";
  return "O serviço de autenticação está indisponível. Tente novamente mais tarde.";
}
