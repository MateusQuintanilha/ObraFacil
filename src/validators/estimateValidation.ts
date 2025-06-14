import { Estimate, EstimateStatus } from '../models/Estimate';
import { ServiceType } from '../models/shared/serviceTypes';

export function validateEstimate(data: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>): void {
  if (!data.clientId || data.clientId.trim() === '') {
    throw new Error('ID do cliente é obrigatório');
  }
  if (!data.title || data.title.trim() === '') {
    throw new Error('Título do orçamento é obrigatório');
  }
  if (!data.validityDate || isNaN(Date.parse(data.validityDate))) {
    throw new Error('Data de validade inválida ou ausente');
  }
  if (!Object.values(EstimateStatus).includes(data.status)) {
    throw new Error('Status do orçamento inválido');
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
    if (!item.description || item.description.trim() === '') {
      throw new Error('Descrição do item é obrigatório');
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Quantidade do item deve ser maior que zero');
    }
    if (typeof item.value !== 'number' || item.value < 0) {
      throw new Error('Preço unitário do item inválido');
    }
  }
  if (typeof data.total !== 'number' || data.total < 0) {
    throw new Error('Total do orçamento inválido');
  }
  if (!data.payment || !['cash', 'pix', 'installments'].includes(data.payment.method)) {
    throw new Error('Pagamento inválido ou ausente');
  }
  // Pode incluir outras validações específicas conforme necessário
}
