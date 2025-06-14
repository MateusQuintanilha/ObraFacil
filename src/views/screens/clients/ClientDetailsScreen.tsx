import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useClient } from '@/context/ClientContext';
import { useEstimate } from '@/context//EstimateContext';
import { ClientsStackParamList } from '@/navigation/tabs/ClientsStack';
import { getFormattedAddressParts } from '@/utils/formatAddress';

import { Ionicons } from '@expo/vector-icons';

import { detailStyles as styles } from '@/views/styles/detailStyles';
import { formatPhoneNumber } from '@/utils/formatPhone';
import { formatCEP } from '@/utils/formatCEP';
import { formatDateTime } from '@/utils/format';

type Props = NativeStackScreenProps<ClientsStackParamList, 'ClientDetails'>;

export default function ClientDetailsScreen({ route, navigation }: Props) {
  const { clientId } = route.params;
  const { clients, loading, deleteClient } = useClient();
  const [client, setClient] = useState<(typeof clients)[0] | null>(null);
  const { fullAddress, cep } = getFormattedAddressParts(client?.address);
  const { estimates } = useEstimate();

  const estimatesOfClient = estimates.filter((estimate) => estimate.clientId === client?.id);

  useEffect(() => {
    const foundClient = clients.find((c) => c.id === clientId) || null;
    if (!foundClient) {
      Alert.alert('Erro', 'Cliente não encontrado.');
      navigation.goBack();
    } else {
      setClient(foundClient);
    }
  }, [clientId, clients, navigation]);

  if (loading || !client) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Excluir', 'Deseja realmente excluir este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteClient(client.id);
          navigation.goBack();
        },
      },
    ]);
  };

  function handleEdit() {
    if (!client) return Alert.alert('Erro', 'Cliente não encontrado.');
    navigation.navigate('EditClient', { clientId: client.id });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6FC' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#0D47A1" />
            <Text style={styles.label}>Nome:</Text>
          </View>
          <Text style={styles.value}>{client.name}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#0D47A1" />
            <Text style={styles.label}>Telefone:</Text>
          </View>
          <Text style={styles.value}>{client.phone ? formatPhoneNumber(client.phone) : 'Não informado'}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={18} color="#0D47A1" />
            <Text style={styles.label}>E-mail:</Text>
          </View>
          <Text style={styles.value}>{client.email || 'Não informado'}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="home" size={18} color="#0D47A1" />
            <Text style={styles.label}>Endereço:</Text>
          </View>
          <Text style={styles.value}>{fullAddress || 'Não informado'}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#0D47A1" />
            <Text style={styles.label}>CEP:</Text>
          </View>
          <Text style={styles.value}>{cep ? formatCEP(cep) : 'Não informado'}</Text>

          <Text style={styles.sectionTitle}>Dados Complementares</Text>

          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={18} color="#0D47A1" />
            <Text style={styles.label}>Notas:</Text>
          </View>
          <Text style={styles.value}>{client.notes || 'Não informado'}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="document-attach" size={18} color="#0D47A1" />
            <Text style={styles.label}>Orçamentos Criados:</Text>
          </View>
          <Text style={styles.value}>{estimatesOfClient.length}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={18} color="#0D47A1" />
            <Text style={styles.label}>Cadastrado em:</Text>
          </View>
          <Text style={styles.value}>{formatDateTime(client.createdAt)}</Text>

          {client.updatedAt && (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="refresh" size={18} color="#0D47A1" />
                <Text style={styles.label}>Atualizado em:</Text>
              </View>
              <Text style={styles.value}>{formatDateTime(client.updatedAt)}</Text>
            </>
          )}
        </View>

        {/* Botões FIXOS fora do ScrollView */}
        <View style={[styles.buttons, { paddingBottom: 24 }]}>
          <TouchableOpacity
            style={[styles.button, styles.editButton, { backgroundColor: '#1976D2' }]}
            onPress={() => navigation.navigate('EditClient', { clientId: client.id })}
          >
            <Ionicons name="create" size={20} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
