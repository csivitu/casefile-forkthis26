import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CASE, SUSPECTS, EVIDENCE, TIMELINE } from '@/data/case';
import { C, Fonts } from '@/constants/theme';
import { Divider } from '@/components/casefile/Divider';

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Suspects', value: String(SUSPECTS.length) },
    { label: 'Evidence Items', value: String(EVIDENCE.length) },
    { label: 'Timeline Events', value: String(TIMELINE.length) },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Dark walnut header */}
        <View style={styles.header}>
          <Text style={styles.appName}>CASEFILE</Text>
          <Text style={styles.caseTitle}>{CASE.title}</Text>
          <Text style={styles.caseId}>CASE #{CASE.id}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Investigation Active</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>{CASE.description}</Text>

        {/* Statistics card */}
        <View style={styles.statsCard}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
              {i < stats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </View>

        {/* Open Case button */}
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => router.push('/overview' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.openButtonText}>Open Case</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.parchment,
  },
  safe: {
    backgroundColor: C.walnut,
  },
  header: {
    backgroundColor: C.walnut,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
  },
  appName: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  caseTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 28,
    fontWeight: '600',
    color: C.paper,
    lineHeight: 34,
  },
  caseId: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 12,
    color: C.antique,
    letterSpacing: 1,
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.olive,
  },
  statusText: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.olive,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 15,
    color: C.faded,
    lineHeight: 24,
    marginBottom: 28,
  },
  statsCard: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    marginBottom: 28,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statLabel: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.faded,
  },
  statValue: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 18,
    fontWeight: '600',
    color: C.walnut,
  },
  openButton: {
    backgroundColor: C.walnut,
    borderRadius: 3,
    paddingVertical: 14,
    alignItems: 'center',
  },
  openButtonText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 15,
    fontWeight: '600',
    color: C.paper,
    letterSpacing: 0.5,
  },
});
