from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.usuario import Perfil


class UsuarioCriar(BaseModel):
    nome: str
    cpf: str
    telefone: str
    email: EmailStr
    senha: str


class UsuarioResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    cpf: str
    telefone: str
    email: str
    perfil: Perfil
    ativo: bool


class LoginEntrada(BaseModel):
    email: str
    senha: str


class TokenResposta(BaseModel):
    access_token: str
    token_type: str = "bearer"
