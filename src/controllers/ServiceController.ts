import { Service } from '../models/Service';
import AsyncStorageService from '../services/AsyncStorageService';
import uuid from 'react-native-uuid';
import { validateService } from '../validators/serviceValidation';

const STORAGE_KEY = '@services';

export default class ServiceController {
  static async getAllServices(): Promise<Service[]> {
    try {
      const services = await AsyncStorageService.getData<Service[]>(STORAGE_KEY);
      return services || [];
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  }

  static async getServiceById(id: string): Promise<Service | null> {
    try {
      const services = await this.getAllServices();
      return services.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar serviço por ID:', error);
      throw error;
    }
  }

  static async addService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    try {
      validateService(data);

      const newService: Service = {
        ...data,
        id: uuid.v4().toString(),
        createdAt: new Date().toISOString(),
      };

      const services = await this.getAllServices();
      services.push(newService);
      await AsyncStorageService.saveData(STORAGE_KEY, services);

      return newService;
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      throw error;
    }
  }

  static async updateService(updatedService: Service): Promise<void> {
    try {
      validateService(updatedService);

      const services = await this.getAllServices();
      const index = services.findIndex(s => s.id === updatedService.id);

      if (index !== -1) {
        updatedService.updatedAt = new Date().toISOString();
        services[index] = updatedService;
        await AsyncStorageService.saveData(STORAGE_KEY, services);
      } else {
        throw new Error('Serviço não encontrado para atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  }

  static async deleteService(id: string): Promise<void> {
    try {
      const services = await this.getAllServices();
      const filtered = services.filter(s => s.id !== id);
      await AsyncStorageService.saveData(STORAGE_KEY, filtered);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  }

  static async clearServices(): Promise<void> {
    try {
      await AsyncStorageService.removeData(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar serviços:', error);
      throw error;
    }
  }

  static async serviceExists(id: string): Promise<boolean> {
    try {
      const service = await this.getServiceById(id);
      return !!service;
    } catch (error) {
      console.error('Erro ao verificar existência do serviço:', error);
      throw error;
    }
  }
}
