const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'done';

export interface Task {
    id: number;
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    due_date?: string;
    created_at: string;
}

export interface CreateTaskPayload {
    title: string;
    description?: string;
    priority?: Priority;
    due_date?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || json.errors?.[0]?.msg || 'Request failed');
    }
    return json.data as T;
}

export async function fetchTasks(): Promise<Task[]> {
    const res = await fetch(`${BASE}/tasks`);
    return handleResponse<Task[]>(res);
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const res = await fetch(`${BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse<Task>(res);
}

export async function deleteTask(id: number): Promise<void> {
    const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
    await handleResponse<unknown>(res);
}

export async function updateTaskStatus(id: number, status: Status): Promise<Task> {
    const res = await fetch(`${BASE}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    return handleResponse<Task>(res);
}

export async function fetchSummary(): Promise<string> {
    const res = await fetch(`${BASE}/tasks/summary`);
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate briefing');
    }
    return json.data.briefing as string;
}