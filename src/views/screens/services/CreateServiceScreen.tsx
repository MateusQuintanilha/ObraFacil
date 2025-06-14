import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '@/navigation/tabs/ServicesStack';
import ServiceForm from '@/views/components/ServiceForm';
import { useEstimate } from '@/context/EstimateContext';
import { useService } from '@/context/ServiceContext';
import { Service } from '@/models/Service';

type Props = NativeStackScreenProps<ServicesStackParamList, 'CreateService'>;

export default function CreateServiceScreen({ route, navigation }: Props) {
  const { addService } = useService();
  const { getEstimateById, updateEstimate } = useEstimate();

  const estimateId = route.params?.fromEstimateId;
  const loadFromEstimate = route.params?.loadFromEstimate;
  const [initialData, setInitialData] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    async function loadEstimate() {
      if (!estimateId || !loadFromEstimate) return;

      const estimate = await getEstimateById(estimateId);
      if (estimate) {
        setInitialData({
          clientId: estimate.clientId,
          items: estimate.items,
          payment: estimate.payment,
          estimateId: estimate.id,
          extraFees: estimate.extraFees || [],
          clientMaterial: estimate.clientMaterial ?? false,
          title: estimate.title || '',
          description: estimate.description || '',
          deadline: estimate.deadline || { durationDays: 0 },
          notes: estimate.notes || '',
          serviceTypes: estimate.serviceTypes || [],
        });
      } else {
        Alert.alert('Erro', 'Orçamento não encontrado.');
      }
    }

    loadEstimate();
  }, [estimateId, loadFromEstimate]);

  async function handleCreate(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      await addService(serviceData as Service);

      if (route.params?.fromEstimateId && route.params?.loadFromEstimate) {
        if (serviceData.estimateId) {
          const estimate = await getEstimateById(serviceData.estimateId);
          if (estimate && !estimate.hasServiceCreated) {
            await updateEstimate({ ...estimate, hasServiceCreated: true });
          }
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'ServiceList' }],
        });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar serviço.');
      console.error(error);
    }
  }

  return <ServiceForm initialData={initialData || {}} onSubmit={handleCreate} submitButtonLabel="Criar Serviço" />;
}
