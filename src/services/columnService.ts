import { api } from '../utils/axios';
import { Column } from '../@types/Column';

export class ColumnService {

  static async getAllColumns(boardId: number): Promise<Column[]> {
    try {
      const response = await api.get(`/boards/${boardId}/columns`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching columns for board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async getColumnById(boardId: number, columnId: number): Promise<Column> {
    try {
      const response = await api.get(`/boards/${boardId}/columns/${columnId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching column with ID ${columnId} for board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async createColumn(boardId: number, columnData: Omit<Column, 'id'>): Promise<Column> {
    try {
      const response = await api.post(`/boards/${boardId}/columns`, columnData);
      return response.data;
    } catch (error) {
      console.error(`Error creating column for board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async updateColumn(boardId: number, columnId: number, columnData: Partial<Column>): Promise<Column> {
    try {
      const response = await api.put(`/boards/${boardId}/columns/${columnId}`, columnData);
      return response.data;
    } catch (error) {
      console.error(`Error updating column with ID ${columnId} for board ID ${boardId}:`, error);
      throw error;
    }
  }

  static async deleteColumn(boardId: number, columnId: number): Promise<void> {
    try {
      await api.delete(`/boards/${boardId}/columns/${columnId}`);
    } catch (error) {
      console.error(`Error deleting column with ID ${columnId} for board ID ${boardId}:`, error);
      throw error;
    }
  }
}
