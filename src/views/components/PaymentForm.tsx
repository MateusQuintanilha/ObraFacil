import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formStyles as styles } from '../styles/formStyles';
import { PaymentMethod } from '@/models/shared/payment';

const PAYMENT_METHODS: { label: string; value: PaymentMethod }[] = [
  { label: 'Dinheiro', value: PaymentMethod.CASH },
  { label: 'Cartão de Crédito', value: PaymentMethod.CREDIT_CARD },
  { label: 'Cartão de Débito', value: PaymentMethod.DEBIT_CARD },
  { label: 'Pix', value: PaymentMethod.PIX },
  { label: 'Parcelado', value: PaymentMethod.INSTALLMENTS },
];

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.PIX]: 'Pix',
  [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentMethod.INSTALLMENTS]: 'Parcelado',
};

type Props = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  installments: string;
  setInstallments: Dispatch<SetStateAction<string>>;
};

export default function PaymentForm({ paymentMethod, setPaymentMethod, installments, setInstallments }: Props) {
  const [showPaymentList, setShowPaymentList] = useState(false);

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>Forma de Pagamento</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowPaymentList(!showPaymentList)}
        accessibilityRole="button"
        accessibilityLabel="Selecionar forma de pagamento"
        accessibilityHint="Abre a lista de formas de pagamento"
      >
        <Text>{paymentMethodLabels[paymentMethod]}</Text>
        <Ionicons name={showPaymentList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
      </TouchableOpacity>

      {showPaymentList && (
        <ScrollView style={[styles.dropdownList, { maxHeight: 150, zIndex: 1000 }]} nestedScrollEnabled={true}>
          {PAYMENT_METHODS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setPaymentMethod(option.value);
                setShowPaymentList(false);
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {paymentMethod === PaymentMethod.INSTALLMENTS && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>Número de Parcelas</Text>
          <TextInput
            style={styles.input}
            value={installments}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setInstallments(onlyNumbers);
            }}
            keyboardType="numeric"
            placeholder="Ex: 3"
            maxLength={2}
          />
        </>
      )}
    </View>
  );
}
