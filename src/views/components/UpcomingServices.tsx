import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Service, ServiceStatus } from '@/models/Service';
import { ServiceType } from '@/models/shared/serviceTypes';
import { PaymentStatus } from '@/models/shared/payment';
import { Client } from '@/models/Client';
import { formatDate, formatTime } from '@/utils/format';
import { serviceIcons } from '@/utils/serviceIcons';

interface UpcomingServicesProps {
  services: Service[];
  clients: Client[];
  maxItems?: number;
}

function UpcomingServices({ services, clients, maxItems = 4 }: UpcomingServicesProps) {
  const data = useMemo(() => {
    const activeStatuses: ServiceStatus[] = [ServiceStatus.SCHEDULED, ServiceStatus.IN_PROGRESS, ServiceStatus.PENDING];

    return services
      .filter((s) => activeStatuses.includes(s.status) && s.deadline?.startDate)
      .sort((a, b) => new Date(a.deadline!.startDate!).getTime() - new Date(b.deadline!.startDate!).getTime())
      .slice(0, maxItems)
      .map<ServiceItem>((s) => ({
        id: s.id,
        clientName: clients.find((c) => c.id === s.clientId)?.name ?? 'Cliente',
        type: s.serviceTypes[0],
        dateLabel: formatDate(s.deadline!.startDate!),
        timeLabel: formatTime(s.deadline!.startDate!),
        paymentStatus: s.payment.status ?? 'pending',
      }));
  }, [services, clients, maxItems]);

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhum serviço agendado para os próximos dias.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.left}>
            <Text style={styles.name}>{item.clientName}</Text>
            <View style={styles.typeRow}>
              {serviceIcons[item.type]}
              <Text style={styles.type}>{item.type}</Text>
            </View>
          </View>

          <View style={styles.right}>
            <Text style={styles.date}>{item.dateLabel}</Text>
            <Text
              style={[
                styles.status,
                item.paymentStatus === 'paid'
                  ? styles.paid
                  : item.paymentStatus === 'overdue'
                  ? styles.overdue
                  : styles.pending,
              ]}
            >
              {item.paymentStatus === 'paid' ? 'Pago' : item.paymentStatus === 'overdue' ? 'Vencido' : 'Pendente'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default memo(UpcomingServices);

// Tipagem usada no processamento dos dados
type ServiceItem = {
  id: string;
  clientName: string;
  type: ServiceType;
  dateLabel: string;
  timeLabel: string;
  paymentStatus: PaymentStatus;
};

// Estilos
const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 40,
  },
  empty: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  left: { gap: 4 },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#212121',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  type: { color: '#666', fontSize: 13 },
  date: { fontWeight: '500', color: '#0D47A1', fontSize: 14 },
  status: {
    marginTop: 4,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
  paid: { backgroundColor: '#E8F5E9', color: '#388E3C' },
  pending: { backgroundColor: '#FFF8E1', color: '#FFA000' },
  overdue: { backgroundColor: '#FFEBEE', color: '#D32F2F' },
});
