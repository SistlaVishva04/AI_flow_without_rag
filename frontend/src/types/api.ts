export async function fetchWorkflows() {
  const res = await fetch("http://127.0.0.1:8000/workflow/list");
  return res.json();
}

export async function fetchWorkflowById(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/workflow/${id}`);
  return res.json();
}
