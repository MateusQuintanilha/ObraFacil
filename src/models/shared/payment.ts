export const PaymentMethod = {
  CASH: 'cash',
  PIX: 'pix',
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  INSTALLMENTS: 'installments',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PEDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
} as const;

export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export interface PaymentBase {
  method: PaymentMethod;   // Método de pagamento (dinheiro, Pix ou parcelado)
  installments?: number;   // Número de parcelas (se o método for parcelado)
}

export interface PaymentInfo extends PaymentBase {
  dueDate?: string;        // Data de vencimento do pagamento
  paidDate?: string;       // Data em que o pagamento foi efetuado
  status?: PaymentStatus;  // Situação do pagamento
}
