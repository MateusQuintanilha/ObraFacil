import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { parseISODate, formatDatePtBR, formatISODate, toISODateString } from '@/utils/formatDate';

import { Service } from '@/models/Service';
import { PaymentMethod, type PaymentStatus } from '@/models/shared/payment';
import { ServiceType } from '@/models/shared/serviceTypes';
import { ServiceStatus } from '@/models/Service';

import { formStyles as styles } from '@/views/styles/formStyles';
import { ItemForm } from '@/views/components/ItemForm';
import { ExtraFeeForm } from '@/views/components/ExtraFeeForm';
import { MultiSelectDropdown } from '@/views/components/MultiSelectServiceTypes';
import { useClient } from '@/context/ClientContext';
import { validateService } from '@/validators/serviceValidation';
import PaymentForm from '../components/PaymentForm';
import { parseISO } from 'date-fns';

interface ServiceFormProps {
  initialData?: Partial<Service>;
  onSubmit: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitButtonLabel: string;
}

export default function ServiceForm({ initialData = {}, onSubmit, submitButtonLabel }: ServiceFormProps) {
  const { clients } = useClient();

  // Dados principais
  const [clientId, setClientId] = useState(initialData.clientId ?? '');
  const [title, setTitle] = useState(initialData.title ?? '');
  const [description, setDescription] = useState(initialData.description ?? '');
  const [notes, setNotes] = useState(initialData.notes ?? '');
  const [selectedEstimateId, setSelectedEstimateId] = useState(initialData.estimateId ?? '');
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(initialData.status ?? 'pending');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialData.serviceTypes ?? []);
  const [clientMaterial, setClientMaterial] = useState(initialData.clientMaterial ?? false);

  // Pagamento
  //const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData.payment?.method ?? PaymentMethod.CASH);
  //const [installments, setInstallments] = useState(initialData.payment?.installments?.toString() ?? '');
  const [dueDate, setDueDate] = useState(initialData.payment?.dueDate ?? '');
  const [paidDate, setPaidDate] = useState(initialData.payment?.paidDate ?? '');
  const [statusPayment, setStatusPayment] = useState<Service['payment']['status']>(
    initialData.payment?.status ?? 'pending',
  );
  const [discount, setDiscount] = useState<number | undefined>(initialData.discount);

  // Itens e taxas
  const [items, setItems] = useState(initialData.items ?? []);
  const [extraFees, setExtraFees] = useState(initialData.extraFees ?? []);

  // Prazos
  const [startDate, setStartDate] = useState(initialData.deadline?.startDate ?? '');
  const [endDate, setEndDate] = useState(initialData.deadline?.endDate ?? '');
  const [durationDays, setDurationDays] = useState<number | undefined>(initialData.deadline?.durationDays ?? 0);

  // Controle de interação
  const [showClientList, setShowClientList] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showPaidDatePicker, setShowPaidDatePicker] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [installments, setInstallments] = useState('');

  const lastChanged = useRef<'startDate' | 'endDate' | 'durationDays' | null>(null);

  // Atualiza os campos quando initialData mudar (ex: edição de serviço)
  useEffect(() => {
    setClientId(initialData.clientId ?? '');
    setTitle(initialData.title ?? '');
    setDescription(initialData.description ?? '');
    setItems(initialData.items ?? []);
    setExtraFees(initialData.extraFees ?? []);
    setClientMaterial(initialData.clientMaterial ?? false);
    setServiceTypes(initialData.serviceTypes ?? []);
    setPaymentMethod(initialData.payment?.method ?? PaymentMethod.CASH);
    setInstallments(initialData.payment?.installments?.toString() ?? '');
    setDueDate(initialData.payment?.dueDate ?? '');
    setPaidDate(initialData.payment?.paidDate ?? '');
    setStatusPayment(initialData.payment?.status ?? 'pending');
    setDiscount(initialData.discount);
    setNotes(initialData.notes ?? '');
    setSelectedEstimateId(initialData.estimateId ?? '');
    setServiceStatus(initialData.status ?? 'pending');
    setStartDate(initialData.deadline?.startDate ?? '');
    setEndDate(initialData.deadline?.endDate ?? '');
    setDurationDays(initialData.deadline?.durationDays ?? 0);
  }, [initialData]);

  useEffect(() => {
    if (lastChanged.current === 'startDate') {
      if (durationDays != null && durationDays >= 0) {
        // Calcular endDate = startDate + durationDays
        const start = parseISODate(startDate);
        if (start) {
          const newEnd = new Date(start);
          newEnd.setDate(newEnd.getDate() + durationDays);
          setEndDate(formatISODate(newEnd));
        }
      } else if (endDate) {
        // Calcular durationDays = endDate - startDate
        const start = parseISODate(startDate);
        const end = parseISODate(endDate);
        if (start && end) {
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDurationDays(diffDays >= 0 ? diffDays : 0);
        }
      }
    } else if (lastChanged.current === 'endDate') {
      if (startDate) {
        const start = parseISODate(startDate);
        const end = parseISODate(endDate);
        if (start && end) {
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDurationDays(diffDays >= 0 ? diffDays : 0);
        }
      } else if (durationDays != null && durationDays >= 0) {
        // Calcular startDate = endDate - durationDays
        const end = parseISODate(endDate);
        if (end) {
          const newStart = new Date(end);
          newStart.setDate(newStart.getDate() - durationDays);
          setStartDate(formatISODate(newStart));
        }
      }
    } else if (lastChanged.current === 'durationDays') {
      if (startDate) {
        // Calcular endDate = startDate + durationDays
        const start = parseISODate(startDate);
        if (start && durationDays != null) {
          const newEnd = new Date(start);
          newEnd.setDate(newEnd.getDate() + durationDays);
          setEndDate(formatISODate(newEnd));
        }
      } else if (endDate) {
        // Calcular startDate = endDate - durationDays
        const end = parseISODate(endDate);
        if (end && durationDays != null) {
          const newStart = new Date(end);
          newStart.setDate(newStart.getDate() - durationDays);
          setStartDate(formatISODate(newStart));
        }
      }
    }

    lastChanged.current = null;
  }, [startDate, endDate, durationDays]);

  // Handlers para setar valor e marcar campo alterado
  function onChangeStartDate(value: string) {
    lastChanged.current = 'startDate';
    setStartDate(value);
  }

  function onChangeEndDate(value: string) {
    lastChanged.current = 'endDate';
    setEndDate(value);
  }

  function onChangeDurationDays(value: string) {
    const num = parseInt(value, 10);
    lastChanged.current = 'durationDays';
    setDurationDays(isNaN(num) ? 0 : num);
  }

  // Handlers para abrir DatePicker
  function onOpenStartDatePicker() {
    setShowStartDatePicker(true);
  }

  function onOpenEndDatePicker() {
    setShowEndDatePicker(true);
  }

  // Handlers para selecionar a data do DatePicker
  function onChangeStartDatePicker(event: any, selectedDate?: Date) {
    setShowStartDatePicker(Platform.OS === 'ios'); // no iOS fica aberto até fechar manualmente
    if (selectedDate) {
      lastChanged.current = 'startDate';
      setStartDate(formatISODate(selectedDate));
    }
  }

  function onChangeEndDatePicker(event: any, selectedDate?: Date) {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      lastChanged.current = 'endDate';
      setEndDate(formatISODate(selectedDate));
    }
  }

  function formatDatePtBr(date: string | Date): string {
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat('pt-BR').format(d);
    } catch {
      return '';
    }
  }

  // DatePicker handlers atualizados com pt-BR format
  function handleStartDateChange(event: any, selectedDate?: Date) {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(toISODateString(selectedDate));
    }
  }

  function handleEndDateChange(event: any, selectedDate?: Date) {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(toISODateString(selectedDate));
    }
  }

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setDueDate(toISODateString(selectedDate));
    }
  };

  const handlePaidDateChange = (event: any, selectedDate?: Date) => {
    setShowPaidDatePicker(false);
    if (selectedDate) {
      setPaidDate(toISODateString(selectedDate));
    }
  };

  // Cálculo de totais
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.value, 0);
  const totalFees = extraFees.reduce((acc, fee) => acc + fee.value, 0);
  const total = (clientMaterial ? 0 : subtotal) + totalFees - (discount || 0);

  function handleSubmit() {
    const serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> = {
      estimateId: selectedEstimateId,
      clientId,
      title: title.trim(),
      description: description.trim() || undefined,
      items,
      extraFees: extraFees.length > 0 ? extraFees : undefined,
      discount,
      clientMaterial,
      showRefCost: undefined,
      serviceTypes,
      payment: {
        method: paymentMethod,
        installments: paymentMethod === 'installments' ? Number(installments) : undefined,
        dueDate: dueDate || undefined,
        paidDate: paidDate || undefined,
        status: statusPayment,
      },
      deadline: {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        durationDays: durationDays ?? 0,
      },
      notes: notes.trim() || undefined,
      total,
      status: serviceStatus,
    };

    try {
      validateService(serviceData);
      onSubmit(serviceData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao validar o serviço.';
      Alert.alert('Validação', message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* ==================== CLIENTE ==================== */}
      <Text style={styles.label}>Cliente*</Text>
      {clients.length === 0 ? (
        <Text style={styles.alert}>Nenhum cliente encontrado. Cadastre um cliente antes de prosseguir.</Text>
      ) : (
        <>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowClientList(!showClientList)}>
            <Text>{clientId ? clients.find((c) => c.id === clientId)?.name : 'Toque para escolher um cliente'}</Text>
            <Ionicons name={showClientList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
          </TouchableOpacity>

          {showClientList && (
            <View style={styles.dropdownList}>
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

      <Text style={styles.label}>Categoria do serviço</Text>
      <MultiSelectDropdown selectedTypes={serviceTypes} onChange={setServiceTypes} />

      <Text style={styles.label}>Status do Serviço</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowStatusList(!showStatusList)}>
        <Text>
          {serviceStatus === 'pending' && 'Pendente'}
          {serviceStatus === 'in_progress' && 'Em andamento'}
          {serviceStatus === 'completed' && 'Concluído'}
          {serviceStatus === 'cancelled' && 'Cancelado'}
        </Text>
        <Ionicons name={showStatusList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
      </TouchableOpacity>
      {showStatusList && (
        <View style={styles.dropdownList}>
          {[
            { label: 'Pendente', value: 'pending' },
            { label: 'Em andamento', value: 'in_progress' },
            { label: 'Concluído', value: 'completed' },
            { label: 'Cancelado', value: 'cancelled' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setServiceStatus(option.value as ServiceStatus);
                setShowStatusList(false);
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ==================== DATAS DO SERVIÇO ==================== */}
      <Text style={styles.label}>Data de início</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.input}>{startDate ? formatDatePtBR(startDate) : 'Selecionar data'}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={startDate ? parseISO(startDate) : new Date()}
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.label}>Data de término</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.input}>{endDate ? formatDatePtBR(endDate) : 'Selecionar data'}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={endDate ? parseISO(endDate) : new Date()}
          onChange={handleEndDateChange}
        />
      )}

      <Text style={styles.label}>Duração (em dias)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={durationDays?.toString() || ''}
        onChangeText={onChangeDurationDays}
        placeholder="Ex: 7"
      />

      {/* ==================== ITENS E CUSTOS ==================== */}
      <ItemForm initialItems={items} onChange={setItems} />

      <ExtraFeeForm initialFees={extraFees} onChange={setExtraFees} />

      <View style={styles.switchContainer}>
        <Text>Material fornecido pelo cliente</Text>
        <Switch value={clientMaterial} onValueChange={setClientMaterial} />
      </View>

      {/* ==================== PAGAMENTO ==================== */}
      <PaymentForm
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        installments={installments}
        setInstallments={setInstallments}
      />

      <Text style={styles.label}>Vencimento:</Text>
      <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={dueDate ? formatDatePtBR(dueDate) : ''}
          placeholder="Selecionar data"
          editable={false}
        />
      </TouchableOpacity>
      {showDueDatePicker && (
        <DateTimePicker
          value={dueDate ? parseISO(dueDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleDueDateChange}
          locale="pt-BR"
        />
      )}

      {dueDate !== '' && (
        <>
          <Text style={styles.label}>Data de Pagamento:</Text>
          <TouchableOpacity onPress={() => setShowPaidDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={paidDate ? formatDatePtBR(paidDate) : ''}
              placeholder="Selecionar data"
              editable={false}
            />
          </TouchableOpacity>
          {showPaidDatePicker && (
            <DateTimePicker
              value={paidDate ? parseISO(paidDate) : new Date()}
              mode="date"
              display="default"
              onChange={handlePaidDateChange}
              locale="pt-BR"
            />
          )}
        </>
      )}

      <Text style={styles.label}>Status do Pagamento</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowStatusList(!showStatusList)}>
        <Text>
          {statusPayment === 'pending' && 'Pendente'}
          {statusPayment === 'paid' && 'Pago'}
          {statusPayment === 'overdue' && 'Atrasado'}
        </Text>
        <Ionicons name={showStatusList ? 'chevron-up' : 'chevron-down'} size={18} color="#333" />
      </TouchableOpacity>
      {showStatusList && (
        <View style={styles.dropdownList}>
          {[
            { label: 'Pendente', value: 'pending' },
            { label: 'Pago', value: 'paid' },
            { label: 'Atrasado', value: 'overdue' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setStatusPayment(option.value as PaymentStatus);
                setShowStatusList(false);
              }}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Desconto */}
      <Text style={styles.label}>Desconto (R$)</Text>
      <TextInput
        style={styles.input}
        value={discount?.toString() || ''}
        onChangeText={(value) => setDiscount(Number(value))}
        keyboardType="numeric"
        placeholder="0"
      />

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
      </View>

      {/* Botão enviar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>{submitButtonLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
