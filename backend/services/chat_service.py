import uuid
from db.database import SessionLocal
from db.models import ChatLog

# -------- SAVE CHAT ----------
def save_chat(user_id: str, workflow_id: str, query: str, answer: str):
    db = SessionLocal()

    log = ChatLog(
        id=str(uuid.uuid4()),
        user_id=user_id,           # 👈 important
        workflow_id=workflow_id,
        query=query,
        answer=answer
    )

    db.add(log)
    db.commit()
    db.refresh(log)
    db.close()

    return log


# -------- GET CHAT HISTORY ----------
def get_chat_history(user_id: str, workflow_id: str):
    db = SessionLocal()

    logs = (
        db.query(ChatLog)
        .filter(
            ChatLog.user_id == user_id,
            ChatLog.workflow_id == workflow_id
        )
        .order_by(ChatLog.created_at.asc())
        .all()
    )

    db.close()
    return logs
