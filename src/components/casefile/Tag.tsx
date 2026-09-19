import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { C, Fonts } from '@/constants/theme';

interface TagProps {
  children: string;
}

export function Tag({ children }: TagProps) {
  return (
    <Text style={styles.tag}>{children.toUpperCase()}</Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.antique,
    backgroundColor: C.parchment,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    letterSpacing: 0.5,
    overflow: 'hidden',
  },
});
