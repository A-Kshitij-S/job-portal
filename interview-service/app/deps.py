from fastapi import Header, HTTPException, Request

from app.config import settings


def verify_internal_key(x_internal_key: str = Header(...)) -> None:
    if x_internal_key != settings.internal_service_key:
        raise HTTPException(status_code=401, detail="invalid internal key")


def get_graph(request: Request):
    return request.app.state.graph


def get_store(request: Request):
    return request.app.state.store
