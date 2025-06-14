import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ExtraFee } from '@/models/shared/extraFee';
import { formStyles as styles } from '@/views/styles/formStyles';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

interface Props {
  initialFees?: ExtraFee[];
  onChange: (fees: ExtraFee[]) => void;
  debounceDelay?: number; // delay em ms (opcional, padrão 500ms)
}

export function ExtraFeeForm({ initialFees = [], onChange, debounceDelay = 500 }: Props) {
  const [fees, setFees] = useState<ExtraFee[]>(initialFees);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza o estado interno quando initialFees mudar
  useEffect(() => {
    setFees(initialFees);
  }, [initialFees]);

  // Debounce onChange para evitar chamadas imediatas em cada digitação
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onChange(fees);
    }, debounceDelay);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [fees, onChange, debounceDelay]);

  function addFee() {
    const newFee: ExtraFee = {
      id: uuid.v4().toString(),
      description: '',
      value: 0,
    };
    setFees((prev) => [...prev, newFee]);
  }

  function updateFee(id: string, field: keyof ExtraFee, value: string) {
    setFees((prev) =>
      prev.map((fee) =>
        fee.id === id
          ? {
              ...fee,
              [field]: field === 'value' ? parseFloat(value) || 0 : value,
            }
          : fee,
      ),
    );
  }

  function removeFee(id: string) {
    setFees((prev) => prev.filter((fee) => fee.id !== id));
  }

  const total = fees.reduce((sum, fee) => sum + fee.value, 0);

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Taxas adicionais</Text>

      {fees.map((fee) => (
        <View key={fee.id} style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={styles.smallLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Frete"
              value={fee.description}
              onChangeText={(text) => updateFee(fee.id, 'description', text)}
              autoCorrect={false}
              autoCapitalize="sentences"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.smallLabel}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="R$"
              keyboardType="numeric"
              value={String(fee.value)}
              onChangeText={(text) => updateFee(fee.id, 'value', text)}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            onPress={() => removeFee(fee.id)}
            style={{ paddingHorizontal: 8, justifyContent: 'center' }}
            accessibilityLabel="Remover taxa"
            accessibilityHint={`Remove a taxa ${fee.description || 'sem descrição'}`}
          >
            <Ionicons name="trash-outline" size={22} color="#a00" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addFee} accessibilityRole="button">
        <Text style={styles.addButtonText}>+ Adicionar taxa</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Total taxas: R$ {total.toFixed(2)}</Text>
    </View>
  );
}
