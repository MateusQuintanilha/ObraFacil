import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Estimate } from '@/models/Estimate';
import EstimateController from '@/controllers/EstimateController';

interface EstimateContextData {
  estimates: Estimate[];
  loading: boolean;
  error: string | null;
  loadEstimates: () => Promise<void>;
  addEstimate: (estimate: Estimate) => Promise<void>;
  updateEstimate: (estimate: Estimate) => Promise<void>;
  deleteEstimate: (id: string) => Promise<void>;
  getEstimateById: (id: string) => Promise<Estimate | null>;
}

const EstimateContext = createContext<EstimateContextData | undefined>(undefined);

export const EstimateProvider = ({ children }: { children: ReactNode }) => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEstimates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EstimateController.getAllEstimates();
      setEstimates(data);
    } catch (err) {
      setError('Falha ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const addEstimate = async (estimate: Estimate) => {
    setLoading(true);
    setError(null);
    try {
      await EstimateController.addEstimate(estimate);
      await loadEstimates();
    } catch (err) {
      setError('Falha ao adicionar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const updateEstimate = async (estimate: Estimate) => {
    setLoading(true);
    setError(null);
    try {
      await EstimateController.updateEstimate(estimate);
      await loadEstimates();
    } catch (err) {
      setError('Falha ao atualizar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const deleteEstimate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await EstimateController.deleteEstimate(id);
      await loadEstimates();
    } catch (err) {
      setError('Falha ao deletar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const getEstimateById = async (id: string): Promise<Estimate | null> => {
    setLoading(true);
    setError(null);
    try {
      const estimate = await EstimateController.getEstimateById(id);
      return estimate;
    } catch (err) {
      setError('Falha ao buscar orçamento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  return (
    <EstimateContext.Provider
      value={{
        estimates,
        loading,
        error,
        loadEstimates,
        addEstimate,
        updateEstimate,
        deleteEstimate,
        getEstimateById,
      }}
    >
      {children}
    </EstimateContext.Provider>
  );
};

export const useEstimate = () => {
  const context = useContext(EstimateContext);
  if (!context) {
    throw new Error('useEstimate deve ser usado dentro de EstimateProvider');
  }
  return context;
};
