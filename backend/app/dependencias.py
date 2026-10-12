from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Perfil, Usuario
from app.repositories import usuario as usuario_repositorio
from app.seguranca import ler_token


def usuario_logado(
    authorization: str = Header(default=""),
    db: Session = Depends(get_db),
):
    token = authorization.replace("Bearer ", "")
    usuario_id = ler_token(token)
    usuario = usuario_repositorio.buscar_por_id(db, usuario_id)

    if not usuario:
        raise HTTPException(status_code=401, detail="Não autorizado")

    if not usuario.ativo:
        raise HTTPException(status_code=403, detail="Usuário inativo")

    return usuario


def exigir_perfil(perfis: list[Perfil]):
    def verificar_perfil(usuario: Usuario = Depends(usuario_logado)):
        if usuario.perfil not in perfis:
            raise HTTPException(status_code=403, detail="Acesso negado")
        return usuario

    return verificar_perfil