import { api } from '../utils/axios';
import { Board } from '../@types/Board';

export class BoardService {

  static async getAllBoards(): Promise<Board[]> {
    try {
      const response = await api.get('/boards');
      return response.data;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }

  static async getBoardById(id: number): Promise<Board> {
    try {
      const response = await api.get(`/boards/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching board with ID ${id}:`, error);
      throw error;
    }
  }

  static async createBoard(boardData: Omit<Board, 'id'>): Promise<Board> {
    try {
      const response = await api.post('/boards', boardData);
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }

  static async updateBoard(id: number, boardData: Partial<Board>): Promise<Board> {
    try {
      const response = await api.put(`/boards/${id}`, boardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating board with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteBoard(id: number): Promise<void> {
    try {
      await api.delete(`/boards/${id}`);
    } catch (error) {
      console.error(`Error deleting board with ID ${id}:`, error);
      throw error;
    }
  }
}
