import React from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEstimate } from '@/context/EstimateContext';
import { Estimate } from '@/models/Estimate';
import EstimateForm from '@/views/components/EstimateForm';

type Props = NativeStackScreenProps<any, 'CreateEstimate'>;

export default function CreateEstimateScreen({ navigation }: Props) {
  const { addEstimate } = useEstimate();

  async function handleCreate(estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      await addEstimate(estimateData as Estimate);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar orçamento.');
      console.error(error);
    }
  }

  return <EstimateForm onSubmit={handleCreate} submitButtonLabel="Criar orçamento" />;
}
