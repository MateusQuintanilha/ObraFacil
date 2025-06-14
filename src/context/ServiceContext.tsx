import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Service } from '@/models/Service';
import ServiceController from '@/controllers/ServiceController';

interface ServiceContextData {
  services: Service[];
  loading: boolean;
  error: string | null;
  loadServices: () => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Promise<Service | null>;
}

const ServiceContext = createContext<ServiceContextData | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ServiceController.getAllServices();
      setServices(data);
    } catch (err) {
      setError('Falha ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Service) => {
    setLoading(true);
    setError(null);
    try {
      await ServiceController.addService(service);
      await loadServices();
    } catch (err) {
      setError('Falha ao adicionar serviço');
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (service: Service) => {
    setLoading(true);
    setError(null);
    try {
      await ServiceController.updateService(service);
      await loadServices();
    } catch (err) {
      setError('Falha ao atualizar serviço');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ServiceController.deleteService(id);
      await loadServices();
    } catch (err) {
      setError('Falha ao deletar serviço');
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = async (id: string): Promise<Service | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = await ServiceController.getServiceById(id);
      return service;
    } catch (err) {
      setError('Falha ao buscar serviço');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        loading,
        error,
        loadServices,
        addService,
        updateService,
        deleteService,
        getServiceById,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService deve ser usado dentro de ServiceProvider');
  }
  return context;
};
