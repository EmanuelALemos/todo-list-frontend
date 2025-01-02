import { api } from '../utils/axios';
import { Task } from '../@types/Task';

export class TaskService {

  static async getAllTasks(boardId: number, columnId: number): Promise<Task[]> {
    try {
      const response = await api.get(`/boards/${boardId}/columns/${columnId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async getTaskById(boardId: number, columnId: number, taskId: number): Promise<Task> {
    try {
      const response = await api.get(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId} for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async createTask(boardId: number, columnId: number, taskData: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await api.post(`/boards/${boardId}/columns/${columnId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error creating task for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async updateTask(boardId: number, columnId: number, taskId: number, taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await api.put(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${taskId} for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async moveTask(boardId: number, columnId: number, taskId: number, newColumnId: number): Promise<Task> {
    try {
      const response = await api.patch(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}/move`, { new_column_id: newColumnId });
      return response.data;
    } catch (error) {
      console.error(`Error moving task with ID ${taskId} for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async deleteTask(boardId: number, columnId: number, taskId: number): Promise<void> {
    try {
      await api.delete(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId} for column ID ${columnId} in board ID ${boardId}:`, error);
      throw error;
    }
  }
}
