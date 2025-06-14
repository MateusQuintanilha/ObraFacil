import { Estimate } from '../models/Estimate';
import AsyncStorageService from '../services/AsyncStorageService';
import uuid from 'react-native-uuid';
import { validateEstimate } from '../validators/estimateValidation';

const STORAGE_KEY = '@estimates';

export default class EstimateController {
  static async getAllEstimates(): Promise<Estimate[]> {
    try {
      const estimates = await AsyncStorageService.getData<Estimate[]>(STORAGE_KEY);
      return estimates || [];
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      throw error;
    }
  }

  static async getEstimateById(id: string): Promise<Estimate | null> {
    try {
      const estimates = await this.getAllEstimates();
      return estimates.find(e => e.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar orçamento por ID:', error);
      throw error;
    }
  }

  static async addEstimate(data: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Estimate> {
    try {
      validateEstimate(data);

      const newEstimate: Estimate = {
        ...data,
        id: uuid.v4().toString(),
        createdAt: new Date().toISOString(),
      };

      const estimates = await this.getAllEstimates();
      estimates.push(newEstimate);
      await AsyncStorageService.saveData(STORAGE_KEY, estimates);

      return newEstimate;
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
      throw error;
    }
  }

  static async updateEstimate(updatedEstimate: Estimate): Promise<void> {
    try {
      validateEstimate(updatedEstimate);

      const estimates = await this.getAllEstimates();
      const index = estimates.findIndex(e => e.id === updatedEstimate.id);

      if (index !== -1) {
        updatedEstimate.updatedAt = new Date().toISOString();
        estimates[index] = updatedEstimate;
        await AsyncStorageService.saveData(STORAGE_KEY, estimates);
      } else {
        throw new Error('Orçamento não encontrado para atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  }

  static async deleteEstimate(id: string): Promise<void> {
    try {
      const estimates = await this.getAllEstimates();
      const filtered = estimates.filter(e => e.id !== id);
      await AsyncStorageService.saveData(STORAGE_KEY, filtered);
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }

  static async clearEstimates(): Promise<void> {
    try {
      await AsyncStorageService.removeData(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar orçamentos:', error);
      throw error;
    }
  }

  static async estimateExists(id: string): Promise<boolean> {
    try {
      const estimate = await this.getEstimateById(id);
      return !!estimate;
    } catch (error) {
      console.error('Erro ao verificar existência do orçamento:', error);
      throw error;
    }
  }
}
