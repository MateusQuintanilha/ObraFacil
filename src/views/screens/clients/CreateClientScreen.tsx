import React from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ClientForm from '@/views/components/ClientForm';
import { useClient } from '@/context/ClientContext';
import { Client } from '@/models/Client';

type Props = NativeStackScreenProps<any, 'CreateClient'>;

export default function CreateClientScreen({ navigation }: Props) {
  const { addClient } = useClient();

  async function handleCreate(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      await addClient(clientData as Client);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar cliente.');
      console.error(error);
    }
  }

  return <ClientForm onSubmit={handleCreate} submitButtonLabel="Criar" />;
}
