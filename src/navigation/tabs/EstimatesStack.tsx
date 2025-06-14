import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EstimateListScreen from '@/views/screens/estimates/EstimatesListScreen';
import CreateEstimateScreen from '@/views/screens/estimates/CreateEstimateScreen';
import EditEstimateScreen from '@/views/screens/estimates/EditEstimateScreen';
import EstimateDetailsScreen from '@/views/screens/estimates/EstimateDetailsScreen';

export type EstimatesStackParamList = {
  EstimateList: undefined;
  CreateEstimate: { prefillClientId?: string } | undefined;
  EditEstimate: { estimateId: string };
  EstimateDetails: { estimateId: string };
};

const Stack = createNativeStackNavigator<EstimatesStackParamList>();

export default function EstimatesStack() {
  return (
    <Stack.Navigator
      initialRouteName="EstimateList"
      screenOptions={{
        headerTintColor: '#0D47A1',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="EstimateList" component={EstimateListScreen} options={{ title: 'Orçamentos' }} />
      <Stack.Screen name="CreateEstimate" component={CreateEstimateScreen} options={{ title: 'Criar Orçamento' }} />
      <Stack.Screen name="EditEstimate" component={EditEstimateScreen} options={{ title: 'Editar Orçamento' }} />
      <Stack.Screen
        name="EstimateDetails"
        component={EstimateDetailsScreen}
        options={{ title: 'Detalhes do Orçamento' }}
      />
    </Stack.Navigator>
  );
}
