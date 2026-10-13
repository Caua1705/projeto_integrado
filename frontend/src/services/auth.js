import api from "../utils/axios";

export async function loginWithPassword({ email, password }, signal) {
  const form = new URLSearchParams({ username: email.trim(), password });
  const response = await api.post("/auth/login", form, { signal });
  return response.data;
}

export async function currentUser(signal) {
  const response = await api.get("/usuarios/eu", { signal });
  return response.data;
}

export async function registerStudent(values, signal) {
  const payload = {
    nome: values.nome.trim().replace(/\s+/g, " "),
    cpf: values.cpf.replace(/\D/g, ""),
    telefone: values.telefone.replace(/\D/g, ""),
    email: values.email.trim(),
    senha: values.senha,
  };
  return api.post("/auth/registrar", payload, { signal });
}
