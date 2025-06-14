import { Item } from './shared/items';
import { ExtraFee } from './shared/extraFee';
import { PaymentBase } from './shared/payment';
import { ServiceType } from './shared/serviceTypes';
import { ExecutionPeriod } from './shared/executionPeriod';

export enum EstimateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface Estimate {
  id: string;              // UUID único do orçamento
  clientId: string;        // ID do cliente associado ao orçamento

  title: string;           // Título descritivo do orçamento
  description?: string;    // Descrição adicional (opcional)

  createdAt: string;       // Data de criação (formato ISO)
  updatedAt?: string;      // Data da última atualização (opcional)
  validityDate: string;    // Data limite para aprovação (formato ISO)

  status: EstimateStatus;  // Status atual do orçamento
  serviceTypes: ServiceType[];

  items: Item[];           // Lista de materiais utilizados
  extraFees?: ExtraFee[];  // Taxas adicionais aplicadas (ex.: frete, deslocamento)
  discount?: number;       // Valor de desconto aplicado ao total (opcional)

  clientMaterial?: boolean;   // Indica se o material será fornecido pelo cliente
  showRefCost?: boolean;      // Indica se os valores dos materiais são apenas de referência

  total: number;           // Valor total calculado do orçamento
  payment: PaymentBase;    // Informações de pagamento (método e parcelas)

  deadline?: Omit<ExecutionPeriod, 'startDate' | 'endDate'>;  // Prazo estimado de execução (apenas duração)
  notes?: string;          // Observações adicionais (opcional)
  hasServiceCreated?: boolean;
}
