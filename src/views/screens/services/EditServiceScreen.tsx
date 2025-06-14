import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '@/navigation/tabs/ServicesStack';
import { useService } from '@/context/ServiceContext';
import { Service } from '@/models/Service';
import ServiceForm from '@/views/components/ServiceForm';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<ServicesStackParamList, 'EditService'>;

export default function EditServiceScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const { services, loading, updateService } = useService();
  const [serviceData, setServiceData] = useState<Service | null>(null);

  useEffect(() => {
    const service = services.find((s) => s.id === serviceId) || null;
    if (service) {
      setServiceData(service);
    } else {
      Alert.alert('Erro', 'Serviço não encontrado.');
      navigation.goBack();
    }
  }, [services, serviceId, navigation]);

  async function handleUpdate(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!serviceData) return;

    try {
      await updateService({ ...serviceData, ...data });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ServicesStack' }],
        }),
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar serviço.');
      console.error(error);
    }
  }

  if (loading || !serviceData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ServiceForm initialData={serviceData} onSubmit={handleUpdate} submitButtonLabel="Salvar alterações" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
