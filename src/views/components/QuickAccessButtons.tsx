import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '@/views/components/AppButton';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@/navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';

export function QuickAccessButtons() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  return (
    <View style={styles.quick}>
      <AppButton title="Serviços" onPress={() => navigation.navigate('ServicesStack', { screen: 'ServiceList' })} />
      <AppButton
        title="Orçamentos"
        type="secondary"
        onPress={() => navigation.navigate('EstimatesStack', { screen: 'EstimateList' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  quick: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});
