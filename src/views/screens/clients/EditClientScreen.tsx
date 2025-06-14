import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClientsStackParamList } from '@/navigation/tabs/ClientsStack';
import ClientForm from '@/views/components/ClientForm';
import { useClient } from '@/context/ClientContext';
import { Client } from '@/models/Client';

type Props = NativeStackScreenProps<ClientsStackParamList, 'EditClient'>;

export default function EditClientScreen({ route, navigation }: Props) {
  const { clientId } = route.params;
  const { clients, loading, updateClient } = useClient();
  const [clientData, setClientData] = useState<Client | null>(null);

  useEffect(() => {
    const client = clients.find((c) => c.id === clientId) || null;
    if (client) {
      setClientData(client);
    } else {
      Alert.alert('Erro', 'Cliente não encontrado.');
      navigation.goBack();
    }
  }, [clients, clientId, navigation]);

  async function handleUpdate(updatedData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!clientData) return;

    try {
      await updateClient({ ...clientData, ...updatedData });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar cliente.');
      console.error(error);
    }
  }

  if (loading || !clientData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ClientForm initialData={clientData} onSubmit={handleUpdate} submitButtonLabel="Salvar" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
