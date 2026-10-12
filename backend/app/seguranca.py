from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.config import settings

contexto_senha = CryptContext(schemes=["bcrypt"])


def gerar_hash(senha):
    return contexto_senha.hash(senha)


def conferir_senha(senha, senha_hash):
    return contexto_senha.verify(senha, senha_hash)


def criar_token(usuario_id):
    expira_em = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    dados = {"sub": str(usuario_id), "exp": expira_em}
    return jwt.encode(dados, settings.SECRET_KEY, algorithm="HS256")


def ler_token(token):
    dados = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    return int(dados["sub"])