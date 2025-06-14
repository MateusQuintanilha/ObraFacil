import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title } from '@/views/components/Title';
import { SectionTitle } from '@/views/components/SectionTitle';
import { QuickAccessButtons } from '@/views/components/QuickAccessButtons';
import FinancialSummary from '@/views/components/FinancialSummary';
import UpcomingServices from '@/views/components/UpcomingServices';
import { useClient } from '@/context/ClientContext';
import { useService } from '@/context/ServiceContext';

export function HomeScreen() {
  const { clients } = useClient();
  const { services } = useService();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title text="ObraFácil" />
      <QuickAccessButtons />

      <SectionTitle text="Resumo Financeiro" />
      <FinancialSummary services={services} />

      <SectionTitle text="Próximos Serviços" />
      <UpcomingServices services={services} clients={clients} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
});
