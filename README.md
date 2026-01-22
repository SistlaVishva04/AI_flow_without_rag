# AI Flow Studio – LLM Workflow Orchestrator
## 📌 Overview
AI Workflow Builder is a visual workflow orchestration platform that allows users to design AI pipelines, upload knowledge documents, and interact with LLMs. A no-RAG baseline system for building and executing LLM pipelines with document context.

The system supports authenticated users, persistent workflows, chat history, and document-based question answering.

---
## 🚀 Features

- Supabase Email Authentication
- Visual Workflow Builder (React Flow)
- Knowledge Base PDF Upload
- RAG-based Question Answering
- Workflow History Management
- Chat History Persistence
- PostgreSQL Storage
- Gemini LLM Integration
- Dockerized Deployment
---
## 🧠 System Architecture

Frontend communicates with the FastAPI backend.
Backend handles authentication validation, workflow execution, RAG logic, and database persistence.

**Components**:
- Component	Purpose
- React Frontend	UI and workflow design
- FastAPI Backend	API layer
- PostgreSQL	Stores workflows, chats, documents
- Supabase Auth	User authentication only
- Gemini API	LLM responses
- ChromaDB	Vector embeddings store
---
## 🔐 Authentication Flow

User signs in using Supabase Auth.

Frontend receives JWT access token.

Token is sent to backend in Authorization header.

Backend validates token using Supabase Admin SDK.

User ID is extracted and used for all DB operations.

---
## 📄 Database Tables
**documents**

Stores uploaded PDF content.
Column
``` bash
id, user_id, filename, content, created_at
```
**workflows**

Stores workflow structure.
Column
```
id, user_id, name, data, created_at
```
**chat_logs**

Stores chat history.
Column
```
id, user_id, workflow_id, query, answer, created_at
```

---
## 🔁 Workflow Execution Flow

User builds workflow in UI.

Workflow is saved in PostgreSQL.

User uploads PDF document.

User asks question.

Backend retrieves document.

Gemini LLM is called with context.

Answer is returned.

Chat history is stored.

---
## 🔧 Environment Variables
**Backend (.env)**
```
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```
**Frontend (.env)**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---
## 📦 Docker Support

The project is fully dockerized using:

Backend Dockerfile

Frontend Dockerfile

docker-compose.yml

This allows one-command startup.
```
docker compose up
```
---

## 👤 Author

Vishnu Vamsi
Email: vishnuvamsi04@gmail.com
