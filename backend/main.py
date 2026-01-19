from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.workflow import router as workflow_router
from routers.chat import router as chat_router


app = FastAPI(title="AI Flow Studio Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workflow_router, prefix="/workflow")
app.include_router(chat_router, prefix="/chat")


@app.get("/")
def root():
    return {"status": "Backend running"}
