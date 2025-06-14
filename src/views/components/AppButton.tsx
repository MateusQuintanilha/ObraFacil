import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
};

export const AppButton = ({ title, onPress, type = 'primary' }: ButtonProps) => (
  <TouchableOpacity style={[styles.button, type === 'secondary' ? styles.secondary : styles.primary]} onPress={onPress}>
    <Text style={[styles.text, type === 'secondary' ? styles.textSecondary : styles.textPrimary]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primary: {
    backgroundColor: '#2454AB',
    borderWidth: 1,
    borderColor: '#03339E',
  },
  secondary: {
    backgroundColor: '#FFE9C0',
    borderWidth: 1,
    borderColor: '#FFE4AF',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#354B5E',
  },
});
