import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Client } from '@/models/Client';
import ClientController from '@/controllers/ClientController';

interface ClientContextData {
  clients: Client[];
  loading: boolean;
  error: string | null;
  loadClients: () => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Promise<Client | null>;
}

const ClientContext = createContext<ClientContextData | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClientController.getAllClients();
      setClients(data);
    } catch (err) {
      setError('Falha ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Client) => {
    setLoading(true);
    setError(null);
    try {
      await ClientController.addClient(client);
      await loadClients();
    } catch (err) {
      setError('Falha ao adicionar cliente');
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (client: Client) => {
    setLoading(true);
    setError(null);
    try {
      await ClientController.updateClient(client);
      await loadClients();
    } catch (err) {
      setError('Falha ao atualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ClientController.deleteClient(id);
      await loadClients();
    } catch (err) {
      setError('Falha ao deletar cliente');
    } finally {
      setLoading(false);
    }
  };

  const getClientById = async (id: string): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const client = await ClientController.getClientById(id);
      return client;
    } catch (err) {
      setError('Falha ao buscar cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        loadClients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient deve ser usado dentro de ClientProvider');
  }
  return context;
};
