from contextlib import asynccontextmanager

from fastapi import FastAPI
from langgraph.checkpoint.mongodb import MongoDBSaver

from app.api.routes import router
from app.config import settings
from app.graph.builder import compile_graph
from app.integrations.mongo import get_mongo_client
from app.memory.long_term_store import MongoLongTermStore


@asynccontextmanager
async def lifespan(app: FastAPI):
    checkpointer = MongoDBSaver(get_mongo_client(), db_name=settings.interview_db_name)
    store = MongoLongTermStore()
    app.state.store = store
    app.state.graph = compile_graph(checkpointer, store=store)
    yield


app = FastAPI(title="Interview Service", lifespan=lifespan)
app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
