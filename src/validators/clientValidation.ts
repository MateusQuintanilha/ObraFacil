import { Client } from '../models/Client';

export function validateClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): void {
  if (!data.name || data.name.trim() === '') {
    throw new Error('Nome do cliente é obrigatório');
  }
  if (!data.phone || data.phone.trim() === '') {
    throw new Error('Nome do cliente é obrigatório');
  }
  if (data.email && !validateEmail(data.email)) {
    throw new Error('E-mail inválido');
  }
  if (data.phone && !validatePhone(data.phone)) {
    throw new Error('Telefone inválido');
  }
  // Você pode adicionar outras validações específicas aqui
}

// Validação simples de e-mail (regex básica)
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validação simples de telefone (apenas números, 10-11 dígitos)
function validatePhone(phone: string): boolean {
  const re = /^\d{10,11}$/;
  return re.test(phone.replace(/\D/g, '')); // remove não dígitos antes de validar
}
