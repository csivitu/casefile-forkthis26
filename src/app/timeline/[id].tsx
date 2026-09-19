import { BlueprintBackground } from '@/components/casefile/BlueprintBackground';
import { DetailRow } from '@/components/casefile/DetailRow';
import { Divider } from '@/components/casefile/Divider';
import { EmptyState } from '@/components/casefile/EmptyState';
import { PageHeader } from '@/components/casefile/PageHeader';
import { SectionHeader } from '@/components/casefile/SectionHeader';
import { Tag } from '@/components/casefile/Tag';
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

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const event = TIMELINE.find((t) => t.id === id);

  if (!event) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']}>
          <PageHeader title="Not Found" onBack={() => (router.canGoBack() ? router.back() : router.replace('/timeline') as never)} backLabel="Timeline" />
        </SafeAreaView>
        <EmptyState message="Event record not found." />
      </View>
    );
  }

  const location = LOCATIONS.find((l) => l.id === event.locationId);
  const people = SUSPECTS.filter((s) => event.suspectIds.includes(s.id));
  const relatedEvidence = EVIDENCE.filter((e) => event.evidenceIds.includes(e.id));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <BlueprintBackground locationName={location?.name ?? ''} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title={event.title}
          subtitle={event.timestamp}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/timeline') as never)}
          backLabel="Timeline"
        />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Event Details */}
        <View style={styles.section}>
          <SectionHeader title="Event Details" />
          <DetailRow label="Time" value={event.timestamp} />
          <Divider />
          <DetailRow label="Location" value={location?.name ?? '—'} />
        </View>

        <View style={styles.spacer} />

        {/* Description */}
        <View style={styles.section}>
          <SectionHeader title="Description" />
          <View style={styles.textBlock}>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        </View>

        {/* People Involved */}
        {people.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="People Involved" />
              {people.map((s, i) => (
                <View key={s.id}>
                  <View style={styles.relatedRow}>
                    <View style={styles.relatedLeft}>
                      <Text style={styles.relatedId}>{s.id}</Text>
                      <Text style={styles.relatedTitle}>{s.name}</Text>
                    </View>
                    <Text style={styles.relatedMeta}>{s.occupation}</Text>
                  </View>
                  {i < people.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Related Evidence */}
        {relatedEvidence.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="Related Evidence" />
              {relatedEvidence.map((e, i) => (
                <View key={e.id}>
                  <View style={styles.relatedRow}>
                    <View style={styles.relatedLeft}>
                      <Text style={styles.relatedId}>{e.id}</Text>
                      <Text style={styles.relatedTitle}>{e.title}</Text>
                    </View>
                    <Tag>{e.type}</Tag>
                  </View>
                  {i < relatedEvidence.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </>
        )}

        {people.length === 0 && relatedEvidence.length === 0 && (
          <>
            <View style={styles.spacer} />
            <EmptyState message="No persons or evidence directly linked to this event." />
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
