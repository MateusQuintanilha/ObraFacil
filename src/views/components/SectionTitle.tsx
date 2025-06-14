import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SectionTitleProps {
  text: string;
}

export function SectionTitle({ text }: SectionTitleProps) {
  return <Text style={styles.sectionTitle}>{text}</Text>;
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#193668',
    textAlign: 'center',
  },
});
