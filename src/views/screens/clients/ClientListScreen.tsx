import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientsStackParamList } from '@/navigation/tabs/ClientsStack';
import { useClient } from '@/context/ClientContext';

import { sharedStyles as styles } from '@/views/styles/sharedStyles';
import { ClientCard } from '@/views/components/ItemCard';

type Props = NativeStackScreenProps<ClientsStackParamList, 'ClientList'>;

export default function ClientListScreen({ navigation }: Props) {
  const { clients, loading } = useClient();

  function handleClientPress(clientId: string) {
    navigation.navigate('ClientDetails', { clientId });
  }

  function renderItem({ item }: { item: (typeof clients)[0] }) {
    return <TouchableOpacity style={styles.clientItem} onPress={() => handleClientPress(item.id)}></TouchableOpacity>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando clientes...</Text>
      </View>
    );
  }

  if (clients.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateClient')}>
          <Text style={styles.addButtonText}>Adicionar Cliente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClientCard client={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateClient')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
