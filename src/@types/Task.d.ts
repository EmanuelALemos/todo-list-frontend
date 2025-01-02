export interface Task {
    id: number;
    title: string;
    description: string;
    priority: number;
    due_date: Date;
    column_id?: number;
}