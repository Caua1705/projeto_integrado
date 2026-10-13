import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LoaderCircle, BookOpen } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { registerStudent } from "../services/auth";
import {
  maskCpf,
  maskPhone,
  registrationFields,
  validateRegistration,
  registrationError,
} from "../utils/registration";
import "../style/register.css";

const initialValues = {
  //Estado inicial do formulário
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  senha: "",
  confirmacao: "",
};

function Field({
  name,
  label,
  error,
  value,
  onChange,
  inputRef,
  secret = false,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const id = `register-${name}`;
  return (
    <div className={`login-field register-field register-field-${name}`}>
      <label htmlFor={id}>{label}</label>
      <div className={secret ? "login-password-wrapper" : undefined}>
        <input
          {...props}
          ref={inputRef}
          id={id}
          name={name}
          required
          type={secret ? (visible ? "text" : "password") : props.type || "text"}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {secret && (
          <button
            type="button"
            className="login-password-toggle"
            aria-label={`${visible ? "Ocultar" : "Mostrar"} ${name === "confirmacao" ? "confirmação de senha" : "senha"}`}
            aria-pressed={visible}
            aria-controls={id}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? (
              <EyeOff size={19} aria-hidden="true" />
            ) : (
              <Eye size={19} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="register-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef({});
  const pending = useRef(false);
  const controller = useRef(null);
  const navigate = useNavigate();
  useEffect(() => () => controller.current?.abort(), []);

  const change = (name, value) => {
    const formatted =
      name === "cpf"
        ? maskCpf(value)
        : name === "telefone"
          ? maskPhone(value)
          : value;
    setValues((current) => ({ ...current, [name]: formatted }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "senha" ? { confirmacao: undefined } : {}),
    }));
    setMessage("");
  };

  const focusFirstError = (fields) => {
    const first = registrationFields.find((name) => fields[name]);
    if (first) requestAnimationFrame(() => inputRefs.current[first]?.focus());
  };

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current) return;
    const validation = validateRegistration(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      setMessage("Confira os campos destacados antes de continuar.");
      focusFirstError(validation);
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setMessage("");
    const request = new AbortController();
    controller.current = request;
    try {
      await registerStudent(values, request.signal);
      if (!request.signal.aborted) {
        setValues(initialValues);
        navigate("/login", {
          replace: true,
          state: { registrationComplete: true },
        });
      }
    } catch (error) {
      if (request.signal.aborted) return;
      const failure = registrationError(error);
      setErrors(failure.fields);
      setMessage(failure.message);
      focusFirstError(failure.fields);
    } finally {
      pending.current = false;
      if (!request.signal.aborted) setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <Field
      name={name}
      label={label}
      value={values[name]}
      error={errors[name]}
      onChange={change}
      inputRef={(element) => {
        inputRefs.current[name] = element;
      }}
      {...props}
    />
  );

  return (
    <AuthLayout className="readflow-register">
      <div className="login-intro animate-login">
        <span className="login-eyebrow">
          <span className="login-eyebrow-line" />
          SEU ESPAÇO DE LEITURA
        </span>
        <h1 className="login-title">
          Sua biblioteca <em>começa aqui.</em>
        </h1>
        <p className="login-description">
          Crie sua conta de estudante e descubra livros, ideias e histórias para
          acompanhar seu aprendizado.
        </p>
      </div>
      <section
        className="login-card register-card animate-login"
        aria-labelledby="register-title"
      >
        <div className="login-card-heading">
          <div className="login-card-icon">
            <BookOpen size={23} strokeWidth={1.6} aria-hidden="true" />
          </div>
          <h2 id="register-title">Crie sua conta</h2>
          <p>Cadastro público para alunos.</p>
        </div>
        <form
          className="login-form"
          onSubmit={submit}
          noValidate
          aria-busy={submitting}
        >
          <fieldset className="register-fields" disabled={submitting}>
            <legend className="register-sr-only">
              Dados para criar sua conta
            </legend>
            {field("nome", "Nome completo", {
              autoComplete: "name",
              placeholder: "Seu nome completo",
            })}
            {field("cpf", "CPF", {
              inputMode: "numeric",
              maxLength: 14,
              autoComplete: "off",
              placeholder: "000.000.000-00",
            })}
            {field("telefone", "Telefone", {
              type: "tel",
              inputMode: "tel",
              maxLength: 15,
              autoComplete: "tel-national",
              placeholder: "(00) 00000-0000",
            })}
            {field("email", "E-mail", {
              type: "email",
              autoComplete: "email",
              placeholder: "seuemail@exemplo.com",
            })}
            {field("senha", "Senha", {
              secret: true,
              autoComplete: "new-password",
              placeholder: "Crie uma senha",
            })}
            {field("confirmacao", "Confirmar senha", {
              secret: true,
              autoComplete: "new-password",
              placeholder: "Repita sua senha",
            })}
          </fieldset>
          <p className="register-error" role="alert" aria-live="polite">
            {message}
          </p>
          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle
                  size={19}
                  className="register-spinner"
                  aria-hidden="true"
                />
                Criando sua conta…
              </>
            ) : (
              <>
                Criar minha conta
                <ArrowRight size={19} aria-hidden="true" />
              </>
            )}
          </button>
          <p className="register-sr-only" role="status">
            {submitting
              ? "Cadastro em andamento. Aguarde a resposta do serviço."
              : ""}
          </p>
        </form>
        <div className="login-divider">
          <span />
          <span>OU</span>
          <span />
        </div>
        <p className="login-register">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </AuthLayout>
  );
}
