export const registrationFields = [
  "nome",
  "cpf",
  "telefone",
  "email",
  "senha",
  "confirmacao",
];

const digits = (value) => value.replace(/\D/g, "");

export function maskCpf(value) {
  return digits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\.\d{3})(\d)/, "$1-$2");
}

export function maskPhone(value) {
  const number = digits(value).slice(0, 11);
  if (!number) return "";
  if (number.length <= 2) return `(${number}`;
  const local = number.slice(2);
  const split = number.length > 10 ? 5 : 4;
  return `(${number.slice(0, 2)}) ${local.slice(0, split)}${local.length > split ? `-${local.slice(split)}` : ""}`;
}

export function validCpf(value) {
  const number = digits(value);
  if (number.length !== 11 || new Set(number).size === 1) return false;
  for (const length of [9, 10]) {
    let sum = 0;
    for (let index = 0; index < length; index++)
      sum += Number(number[index]) * (length + 1 - index);
    if (((sum * 10) % 11) % 10 !== Number(number[length])) return false;
  }
  return true;
}

export function validateRegistration(values) {
  const errors = {};
  if (values.nome.trim().split(/\s+/).filter(Boolean).length < 2)
    errors.nome = "Informe seu nome completo.";
  if (!validCpf(values.cpf)) errors.cpf = "Informe um CPF válido.";
  if (![10, 11].includes(digits(values.telefone).length))
    errors.telefone = "Informe o telefone com DDD (10 ou 11 dígitos).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Informe um e-mail válido.";
  if (!values.senha.trim()) errors.senha = "Crie uma senha.";
  if (!values.confirmacao) errors.confirmacao = "Confirme sua senha.";
  else if (values.confirmacao !== values.senha)
    errors.confirmacao = "As senhas precisam ser iguais.";
  return errors;
}

export function registrationError(error) {
  const fields = {};
  if (!error.response) {
    return {
      fields,
      message:
        error.code === "ECONNABORTED"
          ? "O servidor demorou para responder. Tente novamente."
          : "Não foi possível conectar ao serviço de cadastro. Confira sua conexão e tente novamente.",
    };
  }
  const { status, data } = error.response;
  if (status >= 500)
    return {
      fields,
      message:
        "O serviço de cadastro está indisponível. Tente novamente mais tarde.",
    };
  if ([404, 405].includes(status))
    return {
      fields,
      message: "O serviço de cadastro não está disponível no momento.",
    };
  const detail = data?.detail ?? data?.message;
  const details = Array.isArray(detail)
    ? detail
    : [{ msg: typeof detail === "string" ? detail : "" }];
  for (const item of details) {
    const text = String(item?.msg || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const duplicate =
      /cadastrad|duplicad|ja existe|already|unique|taken|em uso/.test(text) ||
      (status === 409 && /e-?mail|cpf/.test(text));
    const field = Array.isArray(item?.loc) ? item.loc.at(-1) : undefined;
    if (duplicate && (/e-?mail/.test(text) || field === "email"))
      fields.email = "Este e-mail já está cadastrado.";
    else if (duplicate && (/cpf/.test(text) || field === "cpf"))
      fields.cpf = "Este CPF já está cadastrado.";
    else if (registrationFields.includes(field) && field !== "confirmacao") {
      fields[field] =
        item.type === "missing"
          ? "Preencha este campo."
          : "Confira este campo. O serviço não aceitou o valor informado.";
    }
  }

  return {
    fields,
    message: Object.keys(fields).length
      ? "Não foi possível criar sua conta. Confira os campos destacados."
      : status === 409
        ? "Não foi possível cadastrar. Confira se o e-mail ou CPF já estão cadastrados."
        : "Não foi possível criar sua conta. Confira os dados e tente novamente.",
  };
}
