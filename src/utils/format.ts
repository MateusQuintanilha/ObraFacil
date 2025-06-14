import { capitalizeFirst } from './formatStrings';

export const formatCurrency = (value: number | string): string => {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(number)
    ? 'R$ 0,00'
    : number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
};

export const formatDate = (date?: string | Date): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR');
};

export const formatTime = (date?: string | Date): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
};

export const formatDateTime = (date?: string | Date): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? '' : `${formatDate(d)} ${formatTime(d)}`;
};

export const formatDateLabel = (dateStr?: string): string => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) {
    return 'Hoje, ' + formatTime(date);
  }

  if (isSameDay(date, tomorrow)) {
    return 'Amanhã, ' + formatTime(date);
  }

  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  return `${capitalizeFirst(weekday)}, ${formatTime(date)}`;
};