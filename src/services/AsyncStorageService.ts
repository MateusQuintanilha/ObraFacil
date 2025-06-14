import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageService {
  static async saveData<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar dados em ${key}:`, error);
    }
  }

  static async getData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
      console.error(`Erro ao recuperar dados de ${key}:`, error);
      return null;
    }
  }

  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover dados de ${key}:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage:', error);
    }
  }

  static async keyExists(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Erro ao verificar existência da chave ${key}:`, error);
      return false;
    }
  }
}
