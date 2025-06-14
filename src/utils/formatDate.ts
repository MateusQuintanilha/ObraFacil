import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Retorna uma instância de Date válida ou null
export function parseDate(dateStr: string): Date | null {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Retorna uma instância de Date ou uma nova data atual se inválida
export function parseISODate(str: string): Date {
  const date = new Date(str);
  return isNaN(date.getTime()) ? new Date() : date;
}

// Formata uma string ISO para "dd/MM/yyyy"
export function formatDatePtBR(dateStr: string): string {
  const parsed = parseISO(dateStr);
  return isNaN(parsed.getTime()) ? '' : format(parsed, 'dd/MM/yyyy', { locale: ptBR });
}

// Formata uma string de data para "dd/MM/yyyy"
export function formatDateBR(dateStr: string): string {
  const parsed = parseDate(dateStr);
  return parsed ? format(parsed, 'dd/MM/yyyy', { locale: ptBR }) : '';
}

// Converte Date para string ISO (apenas data)
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Aliases reutilizáveis (caso queira manter por legibilidade)
export const formatToISO = toISODate;
export const toISODateString = toISODate;
export const formatISODate = toISODate;
