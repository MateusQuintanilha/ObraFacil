import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EstimatesStackParamList } from '@/navigation/tabs/EstimatesStack';
import { useEstimate } from '@/context/EstimateContext';
import { useClient } from '@/context/ClientContext';
import { sharedStyles as styles } from '@/views/styles/sharedStyles';
import { EstimateCard } from '@/views/components/ItemCard';

type Props = NativeStackScreenProps<EstimatesStackParamList, 'EstimateList'>;

export default function EstimateListScreen({ navigation }: Props) {
  const { estimates, loading } = useEstimate();
  const { clients } = useClient();

  function handleEstimatePress(id: string) {
    navigation.navigate('EstimateDetails', { estimateId: id });
  }

  function renderItem({ item }: { item: (typeof estimates)[0] }) {
    return <TouchableOpacity style={styles.clientItem} onPress={() => handleEstimatePress(item.id)}></TouchableOpacity>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando orçamentos...</Text>
      </View>
    );
  }

  if (estimates.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum orçamento cadastrado.</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateEstimate')}>
          <Text style={styles.addButtonText}>Adicionar Orçamento</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={estimates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EstimateCard estimate={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEstimate')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
