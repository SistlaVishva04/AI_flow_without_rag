import uuid
import json
from db.database import SessionLocal
from db.models import Workflow


# ---------------- SAVE WORKFLOW ----------------
def save_workflow(user_id: str, name: str, data: dict):
    db = SessionLocal()

    wf = Workflow(
        id=str(uuid.uuid4()),
        user_id=user_id,           # 👈 important
        name=name,
        data=json.dumps(data)
    )

    db.add(wf)
    db.commit()
    db.refresh(wf)
    db.close()

    return wf


# ---------------- LIST WORKFLOWS ----------------
def list_workflows(user_id: str):
    db = SessionLocal()

    workflows = (
        db.query(Workflow)
        .filter(Workflow.user_id == user_id)
        .order_by(Workflow.created_at.desc())
        .all()
    )

    db.close()
    return workflows


# ---------------- GET SINGLE WORKFLOW ----------------
def get_workflow(user_id: str, wf_id: str):
    db = SessionLocal()

    wf = (
        db.query(Workflow)
        .filter(
            Workflow.id == wf_id,
            Workflow.user_id == user_id
        )
        .first()
    )

    db.close()
    return wf
