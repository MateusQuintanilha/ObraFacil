import { cleanNumber } from './validation';

/**
 * Formata um número de telefone no padrão brasileiro.
 * Exemplos:
 *  - 27999999999 → (27) 9 9999-9999
 *  - 2799999999 → (27) 9999-9999
 *  - 999999999 → 9 9999-9999
 *  - 99999999 → 9999-9999
 */
export const formatPhoneNumber = (value: string) => {
  const numbers = cleanNumber(value);

  // Com DDD e 9
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  }

  // Com DDD sem 9
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Sem DDD, com 9
  if (numbers.length === 9) {
    return numbers.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3');
  }

  // Sem DDD, sem 9
  if (numbers.length === 8) {
    return numbers.replace(/(\d{4})(\d{4})/, '$1-$2');
  }

  // Caso não bata com nenhum padrão retorna o valor limpo
  return numbers;
};

