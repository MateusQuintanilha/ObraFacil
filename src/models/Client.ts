import { Address } from './shared/address';

export interface Client {
  id: string;              // UUID
  name: string;            // Nome do cliente
  phone: string;          // Telefone (opcional)
  email?: string;          // E-mail (opcional)
  address?: Address;       // Endereço (opcional)
  notes?: string;          // Observações (opcional)

  createdAt: string;       // Data de cadastro
  updatedAt?: string;       // Última atualização (opcional)
}
