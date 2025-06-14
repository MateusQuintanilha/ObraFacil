import { Client } from '../models/Client';
import AsyncStorageService from '../services/AsyncStorageService';
import uuid from 'react-native-uuid';
import { validateClient } from '../validators/clientValidation';

const STORAGE_KEY = '@clients';

export default class ClientController {
  static async getAllClients(): Promise<Client[]> {
    try {
      const clients = await AsyncStorageService.getData<Client[]>(STORAGE_KEY);
      return clients || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  static async getClientById(id: string): Promise<Client | null> {
    try {
      const clients = await this.getAllClients();
      return clients.find(client => client.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      throw error;
    }
  }

  static async addClient(data: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    try {
      validateClient(data);

      const newClient: Client = {
        ...data,
        id: uuid.v4().toString(),
        createdAt: new Date().toISOString(),
      };

      const clients = await this.getAllClients();
      clients.push(newClient);
      await AsyncStorageService.saveData(STORAGE_KEY, clients);

      return newClient;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      throw error;
    }
  }

  static async updateClient(updatedClient: Client): Promise<void> {
    try {
      validateClient(updatedClient);

      const clients = await this.getAllClients();
      const index = clients.findIndex(client => client.id === updatedClient.id);

      if (index !== -1) {
        updatedClient.updatedAt = new Date().toISOString();
        clients[index] = updatedClient;
        await AsyncStorageService.saveData(STORAGE_KEY, clients);
      } else {
        throw new Error('Cliente não encontrado para atualização');
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  static async deleteClient(id: string): Promise<void> {
    try {
      const clients = await this.getAllClients();
      const filtered = clients.filter(client => client.id !== id);
      await AsyncStorageService.saveData(STORAGE_KEY, filtered);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }

  static async clearClients(): Promise<void> {
    try {
      await AsyncStorageService.removeData(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar clientes:', error);
      throw error;
    }
  }

  static async clientExists(id: string): Promise<boolean> {
    try {
      const client = await this.getClientById(id);
      return !!client;
    } catch (error) {
      console.error('Erro ao verificar existência do cliente:', error);
      throw error;
    }
  }
}
