import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EstimatesStackParamList } from '@/navigation/tabs/EstimatesStack';
import { useEstimate } from '@/context/EstimateContext';
import { Estimate } from '@/models/Estimate';
import EstimateForm from '@/views/components/EstimateForm';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<EstimatesStackParamList, 'EditEstimate'>;

export default function EditEstimateScreen({ route, navigation }: Props) {
  const { estimateId } = route.params;
  const { estimates, loading, updateEstimate } = useEstimate();
  const [estimateData, setEstimateData] = useState<Estimate | null>(null);

  useEffect(() => {
    const estimate = estimates.find((e) => e.id === estimateId) || null;
    if (estimate) {
      setEstimateData(estimate);
    } else {
      Alert.alert('Erro', 'Orçamento não encontrado.');
      navigation.goBack();
    }
  }, [estimates, estimateId, navigation]);

  async function handleUpdate(data: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt' | 'total'>) {
    if (!estimateData) return;

    try {
      const mergedData = { ...estimateData, ...data };
      await updateEstimate(mergedData);

      if (mergedData.status === 'approved') {
        if (mergedData.hasServiceCreated) {
          Alert.alert('Aviso', 'Um serviço já foi criado para este orçamento.');
        } else {
          navigation.getParent()?.navigate('ServicesStack', {
            screen: 'CreateService',
            params: { fromEstimateId: estimateData.id, loadFromEstimate: true },
          });
        }
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'EstimatesStack' }],
          }),
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar orçamento.');
      console.error(error);
    }
  }

  if (loading || !estimateData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <EstimateForm initialData={estimateData} onSubmit={handleUpdate} submitButtonLabel="Salvar alterações" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
