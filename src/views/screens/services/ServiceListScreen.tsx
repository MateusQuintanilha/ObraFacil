import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '@/navigation/tabs/ServicesStack';
import { useService } from '@/context/ServiceContext';
import { sharedStyles as styles } from '@/views/styles/sharedStyles';
import { ServiceCard } from '@/views/components/ItemCard';

type Props = NativeStackScreenProps<ServicesStackParamList, 'ServiceList'>;

export default function ServiceListScreen({ navigation }: Props) {
  const { services, loading } = useService();

  const handleServicePress = (id: string) => {
    navigation.navigate('ServiceDetails', { serviceId: id });
  };

  function renderItem({ item }: { item: (typeof services)[0] }) {
    return <TouchableOpacity style={styles.clientItem} onPress={() => handleServicePress(item.id)}></TouchableOpacity>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando serviços...</Text>
      </View>
    );
  }

  if (services.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum serviço cadastrado.</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate({ name: 'CreateService', params: {} })}
        >
          <Text style={styles.addButtonText}>Adicionar Serviço</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate({ name: 'CreateService', params: {} })}
        accessibilityLabel="Adicionar novo serviço"
        accessible
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
