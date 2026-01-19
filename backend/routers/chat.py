from fastapi import APIRouter, Depends
from services.chat_service import save_chat, get_chat_history
from dependencies import get_current_user

router = APIRouter()

# -------- SAVE CHAT ----------
@router.post("/save")
def save_chat_api(payload: dict, user=Depends(get_current_user)):
    return save_chat(
        user.id,                     # ✅ FIXED
        payload["workflow_id"],
        payload["query"],
        payload["answer"]
    )

# -------- GET CHAT HISTORY ----------
@router.get("/{workflow_id}")
def get_chat_api(workflow_id: str, user=Depends(get_current_user)):
    return get_chat_history(
        user.id,                     # ✅ FIXED
        workflow_id
    )
