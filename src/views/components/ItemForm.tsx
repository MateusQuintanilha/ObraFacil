import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { Item } from '@/models/shared/items';
import { formStyles as styles } from '@/views/styles/formStyles';

interface Props {
  initialItems?: Item[];
  onChange: (items: Item[]) => void;
  debounceDelay?: number; // delay em ms para debounce (padrão 500)
}

export function ItemForm({ initialItems = [], onChange, debounceDelay = 500 }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);

  // Sincroniza o estado interno quando initialItems mudar
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Ref para armazenar o timeout do debounce
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Efeito para disparar onChange com debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(items);
    }, debounceDelay);

    // Cleanup para limpar o timeout se o componente desmontar ou items mudar antes do delay
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [items, onChange, debounceDelay]);

  const addItem = () => {
    const newItem: Item = {
      id: String(uuid.v4()),
      description: '',
      quantity: 1,
      value: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === 'quantity') {
        const parsed = parseInt(String(value), 10);
        updated[index][field] = isNaN(parsed) ? 0 : parsed;
      } else if (field === 'value') {
        const parsed = parseFloat(String(value));
        updated[index][field] = isNaN(parsed) ? 0 : parsed;
      } else {
        updated[index][field] = String(value);
      }
      return updated;
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.value, 0);

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>Itens*</Text>

      {items.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={styles.smallLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cimento"
              value={item.description}
              onChangeText={(text) => updateItem(index, 'description', text)}
              autoCorrect={false}
              autoCapitalize="sentences"
            />
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.smallLabel}>Qtd.</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={String(item.quantity)}
              onChangeText={(text) => updateItem(index, 'quantity', text)}
              maxLength={5}
            />
          </View>

          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.smallLabel}>Valor unit.</Text>
            <TextInput
              style={styles.input}
              placeholder="R$"
              keyboardType="numeric"
              value={String(item.value)}
              onChangeText={(text) => updateItem(index, 'value', text)}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={{ paddingHorizontal: 8, justifyContent: 'center' }}
            accessibilityLabel="Remover item"
            accessibilityHint={`Remove o item ${item.description || 'sem descrição'}`}
          >
            <Ionicons name="trash-outline" size={22} color="#a00" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addItem} style={styles.addButton} accessibilityRole="button">
        <Text style={styles.addButtonText}>+ Adicionar item</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Subtotal: R$ {subtotal.toFixed(2)}</Text>
    </View>
  );
}
