import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, Fonts } from '@/constants/theme';

interface DetailRowProps {
  label: string;
  value: string;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.antique,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  value: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 15,
    color: C.ink,
    lineHeight: 22,
  },
});
