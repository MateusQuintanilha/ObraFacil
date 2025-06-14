import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import type { Service } from '@/models/Service';

type FinancialSummaryProps = {
  services: Service[];
};

export default function FinancialSummary({ services }: FinancialSummaryProps) {
  const totalRecebido = services
    .filter((service) => service.payment.status === 'paid')
    .reduce((acc, service) => acc + (service.total ?? 0), 0);

  const totalAReceber = services
    .filter((service) => service.payment.status !== 'paid')
    .reduce((acc, service) => acc + (service.total ?? 0), 0);

  const pagos = services.filter((service) => service.payment.status === 'paid');
  const pendentes = services.filter((service) => service.payment.status !== 'paid');

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.recebido]}>
        <View style={styles.row}>
          <FontAwesome5 name="money-bill-wave" size={16} color="#FCFFFF" />
          <Text style={styles.label}>Total Recebido</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.value}>R$ {totalRecebido.toFixed(2).replace('.', ',')}</Text>
          <Text style={styles.countLabel}>{pagos.length} recebidos</Text>
        </View>
      </View>

      <View style={[styles.card, styles.aReceber]}>
        <View style={styles.row}>
          <FontAwesome5 name="wallet" size={16} color="#0D47A1" />
          <Text style={[styles.label, { color: '#1C386F' }]}>Total a Receber</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.value, { color: '#1C386F' }]}>R$ {totalAReceber.toFixed(2).replace('.', ',')}</Text>
          <Text style={[styles.countLabel, { color: '#1C386F' }]}>{pendentes.length} pendentes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
  },
  recebido: {
    backgroundColor: '#136A4C',
    borderWidth: 1,
    borderColor: '#003308',
  },
  aReceber: {
    backgroundColor: '#C8E6FF',
    borderWidth: 1,
    borderColor: '#B7DDFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#fff',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  centerContent: {
    alignItems: 'center',
  },
  countLabel: {
    fontSize: 13,
    marginTop: 4,
    color: '#fff',
    fontWeight: '500',
  },
});
