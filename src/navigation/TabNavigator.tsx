import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientsStack from './tabs/ClientsStack';
import EstimatesStack from './tabs/EstimatesStack';
import ServicesStack from './tabs/ServicesStack';
import { HomeScreen } from '@/views/screens/home/HomeScreen';
import { Ionicons } from '@expo/vector-icons';

import { NavigatorScreenParams } from '@react-navigation/native';

import { ClientsStackParamList } from './tabs/ClientsStack';
import { EstimatesStackParamList } from './tabs/EstimatesStack';
import { ServicesStackParamList } from './tabs/ServicesStack';

export type TabParamList = {
  Home: undefined;
  ClientsStack: NavigatorScreenParams<ClientsStackParamList>;
  EstimatesStack: NavigatorScreenParams<EstimatesStackParamList>;
  ServicesStack: NavigatorScreenParams<ServicesStackParamList>;
};

const getIconName = (routeName: keyof TabParamList): keyof typeof Ionicons.glyphMap => {
  const icons = {
    Home: 'home',
    ClientsStack: 'people',
    EstimatesStack: 'document-text',
    ServicesStack: 'construct',
  } as const;

  return icons[routeName];
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            ClientsStack: 'people',
            EstimatesStack: 'document-text',
            ServicesStack: 'construct',
          };
          return <Ionicons name={getIconName(route.name)} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0D47A1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />

      <Tab.Screen
        name="ClientsStack"
        component={ClientsStack}
        options={{ title: 'Clientes' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const tab = state.routes.find((r) => r.name === 'ClientsStack');
            const nestedState = tab?.state;

            if (nestedState?.index && nestedState.index > 0) {
              navigation.navigate('ClientsStack', {
                screen: 'ClientList',
              });
            }
          },
        })}
      />

      <Tab.Screen
        name="EstimatesStack"
        component={EstimatesStack}
        options={{ title: 'Orçamentos' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const tab = state.routes.find((r) => r.name === 'EstimatesStack');
            const nestedState = tab?.state;

            if (nestedState?.index && nestedState.index > 0) {
              navigation.navigate('EstimatesStack', {
                screen: 'EstimateList',
              });
            }
          },
        })}
      />

      <Tab.Screen
        name="ServicesStack"
        component={ServicesStack}
        options={{ title: 'Serviços' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const tab = state.routes.find((r) => r.name === 'ServicesStack');
            const nestedState = tab?.state;

            if (nestedState?.index && nestedState.index > 0) {
              navigation.navigate('ServicesStack', {
                screen: 'ServiceList',
              });
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}
