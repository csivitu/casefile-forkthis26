import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, Fonts } from '@/constants/theme';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.faded,
    textAlign: 'center',
    lineHeight: 20,
  },
});
