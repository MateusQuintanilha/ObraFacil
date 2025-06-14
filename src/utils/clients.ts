import { Client } from '@/models/Client';

export function getClientNameById(clientId: string, clients: Client[]): string {
  const clientMap = new Map(clients.map(c => [c.id, c.name]));
  return clientMap.get(clientId) ?? 'Cliente não encontrado';
}
