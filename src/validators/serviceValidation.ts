import { Service, ServiceStatus } from '../models/Service';
import { ServiceType } from '../models/shared/serviceTypes';
import { PaymentMethod } from '../models/shared/payment';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export function validateService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): void {
  if (!isNonEmptyString(data.clientId)) {
    throw new Error('ID do cliente é obrigatório');
  }
  if (!isNonEmptyString(data.estimateId)) {
    throw new Error('ID do orçamento associado é obrigatório');
  }
  if (!isNonEmptyString(data.title)) {
    throw new Error('Título do serviço é obrigatório');
  }
  if (!Object.values(ServiceStatus).includes(data.status)) {
    throw new Error('Status do serviço inválido');
  }
  if (!Array.isArray(data.serviceTypes) || data.serviceTypes.length === 0) {
    throw new Error('Pelo menos um tipo de serviço deve ser informado');
  }
  for (const st of data.serviceTypes) {
    if (!Object.values(ServiceType).includes(st)) {
      throw new Error(`Tipo de serviço inválido: ${st}`);
    }
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Ao menos um item deve ser informado');
  }
  for (const item of data.items) {
    if (!isNonEmptyString(item.description)) {
      throw new Error('Descrição do item é obrigatória');
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Quantidade do item deve ser maior que zero');
    }
    if (typeof item.value !== 'number' || item.value < 0) {
      throw new Error('Preço unitário do item inválido');
    }
  }
  if (data.total !== undefined && (typeof data.total !== 'number' || data.total < 0)) {
    throw new Error('Total do serviço inválido');
  }
  if (!data.payment || !Object.values(PaymentMethod).includes(data.payment.method)) {
    throw new Error('Forma de pagamento inválida ou ausente');
  }
}
