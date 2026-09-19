import { BlueprintBackground } from '@/components/casefile/BlueprintBackground';
import { DetailRow } from '@/components/casefile/DetailRow';
import { Divider } from '@/components/casefile/Divider';
import { EmptyState } from '@/components/casefile/EmptyState';
import { PageHeader } from '@/components/casefile/PageHeader';
import { SectionHeader } from '@/components/casefile/SectionHeader';
import { C, Fonts } from '@/constants/theme';
import { EVIDENCE, LOCATIONS, SUSPECTS, TIMELINE } from '@/data/case';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EvidenceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const evidence = EVIDENCE.find((e) => e.id === id);

  if (!evidence) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']}>
          <PageHeader title="Not Found" onBack={() => (router.canGoBack() ? router.back() : router.replace('/evidence') as never)} backLabel="Evidence" />
        </SafeAreaView>
        <EmptyState message="Evidence record not found." />
      </View>
    );
  }

  const location = LOCATIONS.find((l) => l.id === evidence.locationId);
  const relatedSuspects = SUSPECTS.filter((s) => evidence.suspectIds.includes(s.id));
  const relatedEvents = TIMELINE.filter((t) => evidence.eventIds.includes(t.id));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {/* Blueprint in the background */}
      <BlueprintBackground locationName={location?.name ?? ''} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title={evidence.title}
          subtitle={`${evidence.id} · ${evidence.type}`}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/evidence') as never)}
          backLabel="Evidence"
        />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Details */}
        <View style={styles.section}>
          <SectionHeader title="Details" />
          <DetailRow label="Evidence ID" value={evidence.id} />
          <Divider />
          <DetailRow label="Classification" value={evidence.type} />
          <Divider />
          <DetailRow label="Recorded Time" value={evidence.timestamp} />
          <Divider />
          <DetailRow label="Location" value={location?.name ?? '—'} />
        </View>

        <View style={styles.spacer} />

        {/* Description */}
        <View style={styles.section}>
          <SectionHeader title="Description" />
          <View style={styles.textBlock}>
            <Text style={styles.descriptionText}>{evidence.description}</Text>
          </View>
        </View>

        {/* Related Suspects */}
        {relatedSuspects.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="Related Suspects" />
              {relatedSuspects.map((s, i) => (
                <View key={s.id}>
                  <View style={styles.relatedRow}>
                    <View style={styles.relatedLeft}>
                      <Text style={styles.relatedId}>{s.id}</Text>
                      <Text style={styles.relatedTitle}>{s.name}</Text>
                    </View>
                    <Text style={styles.relatedMeta}>{s.occupation}</Text>
                  </View>
                  {i < relatedSuspects.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="Related Timeline Event" />
              {relatedEvents.map((t, i) => (
                <View key={t.id}>
                  <View style={styles.relatedRow}>
                    <Text style={styles.relatedId}>{t.timestamp}</Text>
                    <Text style={[styles.relatedTitle, { flex: 1 }]}>{t.title}</Text>
                  </View>
                  {i < relatedEvents.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.bottomPad} />
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
    backgroundColor: C.paper,
  },
  scrollContent: {},
  section: {},
  spacer: { height: 16 },
  textBlock: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  descriptionText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
    lineHeight: 22,
  },
  relatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  relatedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    marginRight: 8,
  },
  relatedId: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
    flexShrink: 0,
  },
  relatedTitle: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
  },
  relatedMeta: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.faded,
    flexShrink: 0,
  },
  bottomPad: { height: 32 },
});
