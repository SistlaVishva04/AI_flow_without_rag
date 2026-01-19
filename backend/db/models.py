from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime
from db.database import Base
from sqlalchemy import ForeignKey
class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    filename = Column(String)
    content = Column(Text)   # 🔥 ADD
    created_at = Column(DateTime, default=datetime.utcnow)



class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    name = Column(String)
    data = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    query = Column(Text)
    answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
