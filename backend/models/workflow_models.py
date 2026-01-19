from typing import List, Dict, Any
from pydantic import BaseModel

class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class WorkflowRequest(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    query: str
