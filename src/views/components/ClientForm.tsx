import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, Text } from 'react-native';
import { Client } from '@/models/Client';
import { Address } from '@/models/shared/address';
import { formStyles as styles } from '@/views/styles/formStyles';
import { validateClient } from '@/validators/clientValidation';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitButtonLabel: string;
}

export default function ClientForm({ initialData = {}, onSubmit, submitButtonLabel }: ClientFormProps) {
  // Dados básicos
  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [notes, setNotes] = useState(initialData.notes || '');

  // Endereço
  const [address, setAddress] = useState<Address>({
    street: initialData.address?.street || '',
    number: initialData.address?.number || '',
    neighborhood: initialData.address?.neighborhood || '',
    city: initialData.address?.city || '',
    state: initialData.address?.state || '',
    cep: initialData.address?.cep || '',
  });

  // Validação simples antes de enviar
  function handleSubmit() {
    if (!name.trim()) {
      alert('O nome do cliente é obrigatório.');
      return;
    }

    const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      address: {
        street: address.street?.trim() || undefined,
        number: address.number?.trim() || undefined,
        neighborhood: address.neighborhood?.trim() || undefined,
        city: address.city?.trim() || undefined,
        state: address.state?.trim() || undefined,
        cep: address.cep?.trim() || undefined,
      },
    };

    try {
      validateClient(clientData);
      onSubmit(clientData);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message); // Mostra mensagem de erro ao usuário
      } else {
        alert('Erro desconhecido ao validar o orçamento.');
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nome *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do cliente" autoFocus />

      <Text style={styles.label}>Telefone*</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Telefone"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="exemplo@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Seção de Endereço */}
      <View style={styles.addressSection}>
        <Text style={styles.sectionTitle}>Endereço</Text>

        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          value={address.street}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, street: text }))}
          placeholder="Rua"
        />

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          value={address.number}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, number: text }))}
          placeholder="Número"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={address.neighborhood}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, neighborhood: text }))}
          placeholder="Bairro"
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={address.city}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, city: text }))}
          placeholder="Cidade"
        />

        <Text style={styles.label}>Estado (sigla)</Text>
        <TextInput
          style={styles.input}
          value={address.state}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, state: text }))}
          placeholder="Estado (ex: SP)"
          maxLength={2}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          placeholder="00000-000"
          value={address.cep}
          onChangeText={(text) => setAddress((prev) => ({ ...prev, cep: text }))}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.inputTextArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Observações"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>{submitButtonLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
