/**
 * Verifica se um nome tem no mínimo X caracteres (padrão 3).
 */
export const validateName = (name: string, minLength = 3) => {
  return name.trim().length >= minLength;
};

/**
 * Remove todos os caracteres que não sejam números.
 */
export const cleanNumber = (value: string) => {
  return value.replace(/\D/g, '');
};

/**
 * Valida se o telefone possui entre 8 e 11 dígitos.
 * Remove caracteres como traços, parênteses e espaços antes de validar.
 */
export const validatePhone = (phone: string) => {
  const onlyNumbers = phone.replace(/\D/g, '');
  return onlyNumbers.length >= 8 && onlyNumbers.length <= 11;
};

/**
 * Valida um e-mail com uma expressão regular simples.
 * Verifica se possui padrão texto@texto.dominio
 */
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.toLowerCase());
};

/**
 * Valida se valor não está vazio (string, array, number, etc.).
 */
export const isRequired = (value: any) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'number') return !isNaN(value);
  return !!value;
};

/**
 * Valida se um número é positivo.
 */
export const validatePositive = (value: number) => {
  return typeof value === 'number' && value >= 0;
};

export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export const sanitizePhone = (phone: string) => phone.replace(/\D/g, '');