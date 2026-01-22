export async function fetchWorkflows() {
  const res = await fetch("https://ai-flow-without-rag.onrender.com/workflow/list");
  return res.json();
}

export async function fetchWorkflowById(id: string) {
  const res = await fetch(`https://ai-flow-without-rag.onrender.com/workflow/${id}`);
  return res.json();
}
