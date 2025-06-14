import type { EstimateStatus } from '@/models/Estimate';
import type { ServiceStatus } from '@/models/Service';

export const EstimateStatusColors: Record<EstimateStatus, string> = {
  pending: '#FFA500', // Laranja (aguardando ação)
  approved: '#388E3C', // Verde (aprovado)
  rejected: '#D32F2F', // Vermelho (recusado)
  expired: '#757575', // Cinza (expirado/inativo)
};

export const getEstimateStatusLabel = (status: EstimateStatus) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovado';
    case 'rejected':
      return 'Recusado';
    case 'expired':
      return 'Expirado';
    default:
      return 'Desconhecido';
  }
};

export const ServiceStatusColors: Record<string, { background: string; text: string }> = {
  pending: { background: '#F0AD4E', text: '#FFF' },
  scheduled: { background: '#5BC0DE', text: '#FFF' },
  in_progress: { background: '#0275D8', text: '#FFF' },
  completed: { background: '#5CB85C', text: '#FFF' },
  cancelled: { background: '#D9534F', text: '#FFF' },
};

export const getServiceStatusLabel = (status: ServiceStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'scheduled':
      return 'Agendado';
    case 'in_progress':
      return 'Em andamento';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};
