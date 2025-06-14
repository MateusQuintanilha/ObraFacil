import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert, Platform, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { Estimate, EstimateStatus } from '@/models/Estimate';
import { PaymentMethod } from '@/models/shared/payment';
import { ServiceType } from '@/models/shared/serviceTypes';

import { formStyles as styles } from '@/views/styles/formStyles';
import { ItemForm } from './ItemForm';
import { ExtraFeeForm } from './ExtraFeeForm';
import { MultiSelectDropdown } from './MultiSelectServiceTypes';

import { useClient } from '@/context/ClientContext';
import { validateEstimate } from '@/validators/estimateValidation';
import PaymentForm from './PaymentForm';
import { toISODateString } from '@/utils/formatDate';
import { parseISO } from 'date-fns';

interface EstimateFormProps {
  initialData?: Partial<Estimate>;
  onSubmit: (data: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitButtonLabel: string;
}

export default function EstimateForm({ initialData = {}, onSubmit, submitButtonLabel }: EstimateFormProps) {
  const { clients } = useClient();

  // Dados do cliente
  const [clientId, setClientId] = useState(initialData.clientId || '');
  const [showClientList, setShowClientList] = useState(false);

  // Informações gerais
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialData.serviceTypes || []);
  const [status, setStatus] = useState<EstimateStatus>(initialData.status || EstimateStatus.PENDING);
  const [durationDays, setDurationDays] = useState<number>(initialData.deadline?.durationDays || 7);
  const baseDate = initialData.createdAt ? parseISO(initialData.createdAt) : new Date();

  // Itens e taxas extras
  const [items, setItems] = useState(initialData.items || []);
  const [extraFees, setExtraFees] = useState(initialData.extraFees || []);
  const [discount, setDiscount] = useState<number>(initialData.discount ?? 0);

  // Material e referência
  const [clientMaterial, setClientMaterial] = useState(initialData.clientMaterial ?? false);
  const [showRefCost, setShowRefCost] = useState(initialData.showRefCost ?? false);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData.payment?.method || 'cash');
  const [installments, setInstallments] = useState(initialData.payment?.installments?.toString() || '');

  // Validade
  const calculateValidityDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validityDate, setValidityDate] = useState<Date>(calculateValidityDate(durationDays));

  const [showEstimateStatusList, setShowEstimateStatusList] = useState(false);

  useEffect(() => {
    setValidityDate(calculateValidityDate(durationDays));
  }, [durationDays]);

  const [showValidityDatePicker, setShowValidityDatePicker] = useState(false);

  // Cálculo de totais
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.value, 0);
  const totalFees = extraFees.reduce((acc, fee) => acc + fee.value, 0);
  const total = (clientMaterial ? 0 : subtotal) + totalFees - discount;

  // Handlers
  const handleValidityDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowValidityDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const diff = Math.ceil((selectedDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
      setDurationDays(diff >= 0 ? diff : 0);
    }
  };

  function formatDatePtBR(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  const handleChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (!selectedDate) return;

    const today = new Date();
    // Zera horas para comparar apenas datas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert('Data inválida', 'A validade não pode ser anterior à data de hoje.');
      return;
    }

    setValidityDate(selectedDate);

    const diffMs = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    setDurationDays(diffDays);
  };

  useEffect(() => {
    setValidityDate(calculateValidityDate(durationDays));
  }, [durationDays]);

  const handleSubmit = () => {
    const estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId,
      title: title.trim(),
      description: description.trim(),
      validityDate: toISODateString(validityDate),
      items,
      status,
      serviceTypes,
      extraFees,
      discount,
      clientMaterial,
      showRefCost,
      total,
      payment: {
        method: paymentMethod,
        installments: paymentMethod === 'installments' ? Number(installments) : undefined,
      },
      deadline: { durationDays },
      notes: notes.trim(),
    };

    try {
      validateEstimate(estimateData);
      onSubmit(estimateData);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha ao salvar orçamento.');
      console.error('Erro ao salvar orçamento:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* ==================== CLIENTE ==================== */}
      <Text style={styles.label}>Cliente*</Text>

      {clients.length === 0 ? (
        <Text style={styles.alert}>Nenhum cliente encontrado. Cadastre um cliente antes de prosseguir.</Text>
      ) : (
        <>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowClientList((prev) => !prev)}>
            <Text>{clientId ? clients.find((c) => c.id === clientId)?.name : 'Toque para escolher um cliente'}</Text>
            <Ionicons name={showClientList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
          </TouchableOpacity>

          {showClientList && (
            <View style={styles.dropdownList}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                {clients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setClientId(client.id);
                      setShowClientList(false);
                    }}
                  >
                    <Text>{client.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      {/* ==================== INFORMAÇÕES DO SERVIÇO ==================== */}
      <Text style={styles.label}>Título do Serviço*</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Instalação hidráulica, troca de tomadas"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.inputTextArea, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Instalação de chuveiro, conserto de vazamento na cozinha"
        multiline
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.inputTextArea, { height: 80 }]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Ex: Levar furadeira, cliente só à tarde, uso de EPI obrigatório"
        multiline
      />

      <View>
        <Text style={styles.label}>Validade do orçamento</Text>

        <Pressable onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>{validityDate ? formatDatePtBR(validityDate) : 'Selecionar data'}</Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={validityDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChangeDate}
          />
        )}
      </View>

      <Text style={styles.label}>Categoria do serviço</Text>
      <MultiSelectDropdown selectedTypes={serviceTypes} onChange={setServiceTypes} />

      <ItemForm initialItems={items} onChange={setItems} />
      <ExtraFeeForm initialFees={extraFees} onChange={setExtraFees} />

      {/* MATERIAIS DO CLIENTE */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Material por conta do cliente?</Text>
        <Switch
          value={clientMaterial}
          onValueChange={(value) => {
            setClientMaterial(value);
            if (!value) setShowRefCost(false);
          }}
          trackColor={{ false: '#ccc', true: '#0D47A1' }}
          thumbColor={clientMaterial ? '#fff' : '#f4f3f4'}
        />
      </View>

      {clientMaterial && (
        <View style={styles.switchRow}>
          <Text style={styles.label}>Mostrar custos como referência?</Text>
          <Switch
            value={showRefCost}
            onValueChange={setShowRefCost}
            trackColor={{ false: '#ccc', true: '#0D47A1' }}
            thumbColor={clientMaterial ? '#fff' : '#f4f3f4'}
          />
        </View>
      )}

      {/* PAGAMENTO */}
      <PaymentForm
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        installments={installments}
        setInstallments={setInstallments}
      />

      {/* CONFIGURAÇÕES FINAIS */}
      <Text style={styles.label}>Desconto</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor do desconto"
        keyboardType="numeric"
        value={discount.toString()}
        onChangeText={(text) => {
          const val = parseFloat(text);
          setDiscount(isNaN(val) ? 0 : val);
        }}
      />

      <Text style={styles.label}>Status do orçamento</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowEstimateStatusList(!showEstimateStatusList)}
      >
        <Text>
          {status === 'pending' && 'Pendente'}
          {status === 'approved' && 'Aprovado'}
          {status === 'rejected' && 'Cancelado'}
          {status === 'expired' && 'Expirado'}
        </Text>
        <Ionicons name={showEstimateStatusList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
      </TouchableOpacity>

      {showEstimateStatusList && (
        <View style={styles.dropdownList}>
          {[
            { label: 'Pendente', value: 'pending' },
            { label: 'Aprovado', value: 'approved' },
            { label: 'Cancelado', value: 'rejected' },
            { label: 'Expirado', value: 'expired' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setStatus(option.value as EstimateStatus);
                setShowEstimateStatusList(false);
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>{submitButtonLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
