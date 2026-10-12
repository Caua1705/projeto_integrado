from sqlalchemy.orm import Session

from app.models.usuario import Usuario


def buscar_por_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()


def buscar_por_id(db: Session, usuario_id: int):
    return db.get(Usuario, usuario_id)


def criar(db: Session, usuario: Usuario):
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def listar(db: Session):
    return db.query(Usuario).all()
