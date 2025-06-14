import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TitleProps {
  text: string;
}

export function Title({ text }: TitleProps) {
  return <Text style={styles.title}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#173E8A',
    marginTop: 40,
    marginBottom: 24,
    textAlign: 'center',
  },
});
