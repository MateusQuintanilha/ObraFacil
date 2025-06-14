import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientListScreen from '@/views/screens/clients/ClientListScreen';
import CreateClientScreen from '@/views/screens/clients/CreateClientScreen';
import EditClientScreen from '@/views/screens/clients/EditClientScreen';
import ClientDetailsScreen from '@/views/screens/clients/ClientDetailsScreen';

export type ClientsStackParamList = {
  ClientList: undefined;
  CreateClient: { prefillClientId?: string } | undefined;
  EditClient: { clientId: string };
  ClientDetails: { clientId: string };
};

const Stack = createNativeStackNavigator<ClientsStackParamList>();

export default function ClientsStack() {
  return (
    <Stack.Navigator
      initialRouteName="ClientList"
      screenOptions={{
        headerTintColor: '#0D47A1',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="ClientList" component={ClientListScreen} options={{ title: 'Clientes' }} />
      <Stack.Screen name="CreateClient" component={CreateClientScreen} options={{ title: 'Criar Cliente' }} />
      <Stack.Screen name="EditClient" component={EditClientScreen} options={{ title: 'Editar Cliente' }} />
      <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} options={{ title: 'Detalhes do Cliente' }} />
    </Stack.Navigator>
  );
}
