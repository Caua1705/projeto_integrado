from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencias import exigir_perfil, usuario_logado
from app.models.usuario import Perfil, Usuario
from app.repositories import usuario as usuario_repositorio
from app.schemas.usuario import LoginEntrada, TokenResposta, UsuarioCriar, UsuarioResposta
from app.seguranca import conferir_senha, criar_token, gerar_hash

router = APIRouter()


@router.post("/auth/registrar", response_model=UsuarioResposta)
def registrar(dados: UsuarioCriar, db: Session = Depends(get_db)):
    if usuario_repositorio.buscar_por_email(db, dados.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    usuario = Usuario(
        nome=dados.nome,
        cpf=dados.cpf,
        telefone=dados.telefone,
        email=dados.email,
        senha_hash=gerar_hash(dados.senha),
    )
    return usuario_repositorio.criar(db, usuario)


@router.post("/auth/login", response_model=TokenResposta)
def login(dados: LoginEntrada, db: Session = Depends(get_db)):
    usuario = usuario_repositorio.buscar_por_email(db, dados.email)
    if not usuario or not conferir_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    return {"access_token": criar_token(usuario.id)}


@router.get("/usuarios/eu", response_model=UsuarioResposta)
def usuario_atual(usuario: Usuario = Depends(usuario_logado)):
    return usuario


@router.get(
    "/usuarios",
    response_model=list[UsuarioResposta],
    dependencies=[Depends(exigir_perfil([Perfil.ADMINISTRADOR]))],
)
def listar_usuarios(db: Session = Depends(get_db)):
    return usuario_repositorio.listar(db)
