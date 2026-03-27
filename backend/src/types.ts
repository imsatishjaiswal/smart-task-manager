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

export interface CreateTaskBody {
    title: string;
    description?: string;
    priority?: Priority;
    due_date?: string;
}