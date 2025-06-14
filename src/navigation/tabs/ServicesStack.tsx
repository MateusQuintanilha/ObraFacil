import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServiceListScreen from '@/views/screens/services/ServiceListScreen';
import CreateServiceScreen from '@/views/screens/services/CreateServiceScreen';
import EditServiceScreen from '@/views/screens/services/EditServiceScreen';
import ServiceDetailsScreen from '@/views/screens/services/ServiceDetailsScreen';

export type ServicesStackParamList = {
  ServiceList: undefined;
  CreateService: { fromEstimateId?: string; loadFromEstimate?: boolean };
  EditService: { serviceId: string };
  ServiceDetails: { serviceId: string };
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStack() {
  return (
    <Stack.Navigator
      initialRouteName="ServiceList"
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: '#0D47A1',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Serviços' }} />
      <Stack.Screen name="CreateService" component={CreateServiceScreen} options={{ title: 'Criar Serviço' }} />
      <Stack.Screen name="EditService" component={EditServiceScreen} options={{ title: 'Editar Serviço' }} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Detalhes do Serviço' }} />
    </Stack.Navigator>
  );
}
