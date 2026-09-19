import React from 'react';
import { View, StyleSheet } from 'react-native';
import { C } from '@/constants/theme';

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.divider,
  },
});
