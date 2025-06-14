import { Item } from './shared/items';
import { ExtraFee } from './shared/extraFee';
import { PaymentInfo } from './shared/payment';
import { ServiceType } from './shared/serviceTypes';
import { ExecutionPeriod } from './shared/executionPeriod';

export const ServiceStatus = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus];

export interface Service {
  id: string;                  // UUID único do serviço
  clientId: string;            // ID do cliente associado ao orçamento
  estimateId: string;          // ID do orçamento associado ao serviço

  title: string;               // Título descritivo do serviço
  description?: string;        // Descrição adicional (opcional)

  createdAt: string;           // Data de criação (formato ISO)
  updatedAt?: string;          // Data da última atualização (opcional)

  status: ServiceStatus;       // Status atual do serviço
  serviceTypes: ServiceType[];

  items: Item[];               // Lista de materiais utilizados
  extraFees?: ExtraFee[];      // Taxas adicionais aplicadas (ex.: frete, deslocamento)
  discount?: number;           // Valor de desconto aplicado ao total (opcional)

  clientMaterial?: boolean;    // Indica se o material será fornecido pelo cliente
  showRefCost?: boolean;       // Indica se os valores dos materiais são apenas de referência

  total?: number;               // Valor total calculado do serviço

  payment: PaymentInfo;        // Informações de pagamento (método e parcelas)

  deadline?: ExecutionPeriod;  // Prazo estimado de execução
  notes?: string;              // Observações adicionais (opcional)
}
