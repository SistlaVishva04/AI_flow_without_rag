from fastapi import APIRouter, UploadFile, File, Depends
import uuid
import fitz

from models.workflow_models import WorkflowRequest

from services.workflow_service import save_workflow, list_workflows, get_workflow

from db.database import SessionLocal
from db.models import Document

from dependencies import get_current_user

router = APIRouter()

from services.llm_service import call_llm

@router.post("/execute")
def execute_workflow(req: WorkflowRequest, user=Depends(get_current_user)):
    db = SessionLocal()

    # ✅ correct access
    file_id = None

    for node in req.nodes:
        if node.type == "knowledgeBase":
            file_id = node.data.get("config", {}).get("fileId")
            break
    if not file_id:
        return {"answer": "No document uploaded for this workflow."}


    doc = db.query(Document).filter(
        Document.id == file_id,
        Document.user_id == user.id
    ).first()

    db.close()

    if not doc:
        return {"answer": "Document not found"}

    answer = call_llm(req.query, doc.content)

    return {"answer": answer}

# ---------------- UPLOAD PDF ----------------
@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), user=Depends(get_current_user)):
    file_id = str(uuid.uuid4())

    content = await file.read()
    pdf = fitz.open(stream=content, filetype="pdf")

    text = ""
    for page in pdf:
        text += page.get_text()

    db = SessionLocal()
    doc = Document(
        id=file_id,
        user_id=user.id,
        filename=file.filename,
        content=text
    )
    db.add(doc)
    db.commit()
    db.close()

    return {
        "fileId": file_id,
        "fileName": file.filename
    }


# ---------------- SAVE WORKFLOW ----------------
@router.post("/save")
def save_workflow_api(payload: dict, user=Depends(get_current_user)):
    return save_workflow(
        user.id,        # 👈 Supabase user id
        payload["name"],
        payload["data"]
    )


# ---------------- LIST WORKFLOWS ----------------
@router.get("/list")
def list_workflow_api(user=Depends(get_current_user)):
    return list_workflows(user.id)


# ---------------- GET WORKFLOW ----------------
@router.get("/{wf_id}")
def get_workflow_api(wf_id: str, user=Depends(get_current_user)):
    return get_workflow(user.id, wf_id)
