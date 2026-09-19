import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, Fonts } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: C.parchment,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  text: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
    letterSpacing: 1.2,
  },
});
