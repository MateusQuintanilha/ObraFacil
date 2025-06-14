import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClientsStackParamList } from '@/navigation/tabs/ClientsStack';
import { Client } from '@/models/Client';
import { capitalizeWords, cleanString } from '@/utils/formatStrings';
import { formatPhoneNumber } from '@/utils/formatPhone';
import { sharedStyles as styles } from '@/views/styles/sharedStyles';

import { EstimatesStackParamList } from '@/navigation/tabs/EstimatesStack';
import { Estimate } from '@/models/Estimate';
import { formatCurrency } from '@/utils/formatMoney';
import { formatDate } from '@/utils/format';
import { getClientNameById } from '@/utils/clients';
import { useClient } from '@/context/ClientContext';
import {
  getEstimateStatusLabel,
  EstimateStatusColors,
  getServiceStatusLabel,
  ServiceStatusColors,
} from '../../utils/status';
import { ServicesStackParamList } from '@/navigation/tabs/ServicesStack';
import { Service, type ServiceStatus } from '@/models/Service';

type ClientCardProps = {
  client: Client;
};

interface EstimateCardProps {
  estimate: Estimate;
}

interface ServiceCardProps {
  service: Service;
}

const validServiceStatuses = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'] as const;

export function isValidServiceStatus(value: string): value is ServiceStatus {
  return validServiceStatuses.includes(value as ServiceStatus);
}

// ClientCard
export function ClientCard({ client }: ClientCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ClientsStackParamList>>();

  const name = capitalizeWords(cleanString(client.name || ''));
  const phone = formatPhoneNumber(client.phone || '');
  const email = cleanString(client.email || '');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ClientDetails', { clientId: client.id })}
      accessibilityLabel={`Ver detalhes de ${name}`}
      accessible
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.clientName}>{name}</Text>
        {phone ? <Text style={styles.info}>Telefone: {phone}</Text> : null}
        {email ? <Text style={styles.info}>E-mail: {email}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export function EstimateCard({ estimate }: EstimateCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<EstimatesStackParamList>>();
  const { clients } = useClient();

  const title = capitalizeWords(cleanString(estimate.title));
  const description = estimate.description ? cleanString(estimate.description) : null;
  const clientName = getClientNameById(estimate.clientId, clients) ?? 'Cliente não encontrado';
  const validityDate = formatDate(estimate.validityDate);
  const status = estimate.status;
  const total = formatCurrency(estimate.total);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EstimateDetails', { estimateId: estimate.id })}
      accessibilityLabel={`Ver detalhes do orçamento ${title}`}
      accessible
    >
      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.clientName}>{title || 'Sem título'}</Text>
          <Text style={[styles.statusBase, { backgroundColor: EstimateStatusColors[status] || '#AAA' }]}>
            {getEstimateStatusLabel(estimate.status)}
          </Text>
        </View>
        <Text style={styles.info}>Cliente: {clientName}</Text>
        <Text style={styles.info} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.rowBetween}>
          <Text style={styles.info}>{total}</Text>
          <Text style={styles.info}>{validityDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ServiceCard({ service }: ServiceCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const { clients } = useClient();

  const clientName = getClientNameById(service.clientId, clients) ?? 'Cliente não encontrado';
  const date = service.deadline?.startDate ? formatDate(service.deadline.startDate) : 'Sem data';

  const statusLabel = getServiceStatusLabel(service.status);
  const statusStyle = getStatusStyle(service.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
      accessibilityLabel={`Ver detalhes do serviço de ${clientName}`}
      accessible
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.clientName}>{service.title || 'Sem título'}</Text>
            <Text style={[styles.statusBase, statusStyle]}>{statusLabel}</Text>
          </View>
          <Text style={styles.info}>Cliente: {clientName}</Text>
          <Text style={styles.info} numberOfLines={2}>
            {service.description}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.info}>{formatCurrency(Number(service.total))}</Text>
            <Text style={styles.info}>{formatDate(service.deadline?.startDate)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Aplica a cor baseada no status
function getStatusStyle(status: string) {
  const defaultStyle = {
    backgroundColor: '#E0E0E0',
    color: '#424242',
  };

  if (status in ServiceStatusColors) {
    const colors = ServiceStatusColors[status as ServiceStatus];
    return {
      backgroundColor: colors.background,
      color: colors.text,
    };
  }

  return defaultStyle;
}
