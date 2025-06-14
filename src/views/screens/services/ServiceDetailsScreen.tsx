import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '@/navigation/tabs/ServicesStack';
import { useService } from '@/context/ServiceContext';
import { useClient } from '@/context/ClientContext';
import { detailStyles as styles } from '@/views/styles/detailStyles';
import { Feather, Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '@/utils/format';
import { formatCurrency } from '@/utils/formatMoney';
import { formatPhoneNumber } from '@/utils/formatPhone';
import { Service } from '@/models/Service';
import { Client } from '@/models/Client';
import { ServiceStatus } from '@/models/Service';

type Props = NativeStackScreenProps<ServicesStackParamList, 'ServiceDetails'>;

export default function ServiceDetailsScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const { services, loading, deleteService } = useService();
  const { clients } = useClient();

  const [service, setService] = useState<Service | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const foundService = services.find((s) => s.id === serviceId) || null;
    if (!foundService) {
      Alert.alert('Erro', 'Serviço não encontrado.');
      navigation.goBack();
    } else {
      setService(foundService);
      const foundClient = clients.find((c) => c.id === foundService.clientId);
      setClient(foundClient || null);
    }
  }, [serviceId, services, clients, navigation]);

  if (loading || !service) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const {
    title,
    description,
    status,
    items,
    extraFees,
    discount,
    deadline,
    payment,
    serviceTypes,
    clientMaterial,
    showRefCost,
    total,
    notes,
    createdAt,
    updatedAt,
  } = service;

  const serviceStatusMap: Record<(typeof ServiceStatus)[keyof typeof ServiceStatus], { label: string; color: string }> =
    {
      [ServiceStatus.PENDING]: { label: 'Pendente', color: '#FFC107' },
      [ServiceStatus.SCHEDULED]: { label: 'Agendado', color: '#2196F3' },
      [ServiceStatus.IN_PROGRESS]: { label: 'Em andamento', color: '#1976D2' },
      [ServiceStatus.COMPLETED]: { label: 'Concluído', color: '#4CAF50' },
      [ServiceStatus.CANCELLED]: { label: 'Cancelado', color: '#F44336' },
    };

  const handleDelete = () => {
    const confirmDelete = () => {
      deleteService(service.id);
      navigation.goBack();
    };

    Alert.alert('Excluir', 'Deseja realmente excluir este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6FC' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        <View style={styles.card}>
          {/* Seção: Informações do Serviço */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Serviço</Text>

            <View style={styles.infoRow}>
              <Ionicons name="document-text" size={18} color="#0D47A1" />
              <Text style={styles.label}>Título:</Text>
            </View>
            <Text style={styles.value}>{title || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="reader" size={18} color="#0D47A1" />
              <Text style={styles.label}>Descrição:</Text>
            </View>
            <Text style={styles.value}>{description || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="document" size={18} color="#0D47A1" />
              <Text style={styles.label}>Nota:</Text>
            </View>
            <Text style={styles.value}>{notes || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#0D47A1" />
              <Text style={styles.label}>Data do Serviço:</Text>
            </View>
            <Text style={styles.value}>{deadline?.durationDays ? deadline.durationDays : '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={18} color="#0D47A1" />
              <Text style={styles.label}>Status:</Text>
            </View>
            <Text
              style={[styles.status, { backgroundColor: serviceStatusMap[status]?.color || '#AAA', color: '#fff' }]}
            >
              {serviceStatusMap[status]?.label || '-'}
            </Text>
          </View>

          {/* Seção: Cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cliente</Text>

            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color="#0D47A1" />
              <Text style={styles.label}>Nome:</Text>
            </View>
            <Text style={styles.value}>{client?.name || 'Cliente não encontrado'}</Text>

            {client && (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={18} color="#0D47A1" />
                  <Text style={styles.label}>Telefone:</Text>
                </View>
                <Text style={styles.value}>{client.phone ? formatPhoneNumber(client.phone) : 'Não informado'}</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="mail" size={18} color="#0D47A1" />
                  <Text style={styles.label}>E-mail:</Text>
                </View>
                <Text style={styles.value}>{client.email || '-'}</Text>
              </>
            )}
          </View>

          {/* Seção: Itens e Taxas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens e Custos</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cube" size={18} color="#0D47A1" />
              <Text style={styles.label}>Itens:</Text>
            </View>
            {items?.length > 0 ? (
              items.map((item, index) => (
                <Text style={styles.value} key={index}>
                  • {item.description} — {item.quantity} x {formatCurrency(item.value)} ={' '}
                  {formatCurrency(item.quantity * item.value)}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>Nenhum item</Text>
            )}

            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={18} color="#0D47A1" />
              <Text style={styles.label}>Taxas Extras:</Text>
            </View>

            {Array.isArray(extraFees) && extraFees.length > 0 ? (
              extraFees.map((fee, index) => (
                <Text style={styles.value} key={index}>
                  • {fee.description || 'Sem descrição'}: {formatCurrency(fee.value ?? 0)}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>Nenhuma taxa extra</Text>
            )}
          </View>

          {/* Seção: Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagamento</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash" size={18} color="#0D47A1" />
              <Text style={styles.label}>Desconto:</Text>
            </View>
            <Text style={styles.value}>{formatCurrency(discount ?? 0)}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="wallet" size={18} color="#0D47A1" />
              <Text style={styles.label}>Forma de Pagamento:</Text>
            </View>
            <Text style={styles.value}>
              {payment?.method === 'installments' ? `Parcelado (${payment.installments}x)` : payment?.method || '-'}
            </Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color="#0D47A1" />
              <Text style={styles.label}>Total:</Text>
            </View>
            <Text style={styles.value}>{formatCurrency(total ?? 0)}</Text>
          </View>

          {/* Seção: Datas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datas</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#0D47A1" />
              <Text style={styles.label}>Criado em:</Text>
            </View>
            <Text style={styles.value}>{formatDateTime(createdAt)}</Text>

            {updatedAt && (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="refresh" size={18} color="#0D47A1" />
                  <Text style={styles.label}>Atualizado em:</Text>
                </View>
                <Text style={styles.value}>{formatDateTime(updatedAt)}</Text>
              </>
            )}
          </View>
        </View>

        {/* Seção: Botões de Ação */}
        <View style={[styles.buttons, { paddingBottom: 24 }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#1976D2' }]}
            onPress={() => navigation.navigate('EditService', { serviceId: service.id })}
          >
            <Feather name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#D32F2F' }]} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="#fff" />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#455A64' }]}
            onPress={() => Alert.alert('Compartilhar', 'Funcionalidade em desenvolvimento')}
          >
            <Feather name="share-2" size={20} color="#fff" />
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
