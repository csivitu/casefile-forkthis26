import { DetailRow } from '@/components/casefile/DetailRow';
import { Divider } from '@/components/casefile/Divider';
import { EmptyState } from '@/components/casefile/EmptyState';
import { PageHeader } from '@/components/casefile/PageHeader';
import { SectionHeader } from '@/components/casefile/SectionHeader';
import { SuspectPortrait } from '@/components/casefile/SuspectPortrait';
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

export default function SuspectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const suspect = SUSPECTS.find((s) => s.id === id);

  if (!suspect) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']}>
          <PageHeader title="Not Found" onBack={() => (router.canGoBack() ? router.back() : router.replace('/suspects') as never)} backLabel="Suspects" />
        </SafeAreaView>
        <EmptyState message="Suspect record not found." />
      </View>
    );
  }

  // Canonical suspect-evidence projection. Direct multi-sample telemetry preserved by design.
  const location = LOCATIONS.find((l) => l.id === suspect.locationId);
  const relatedEvidence = suspect.evidenceIds
    .map((evidenceId) => EVIDENCE.find((e) => e.id === evidenceId))
    .filter((e): e is (typeof EVIDENCE)[number] => Boolean(e));
  const relatedEvents = TIMELINE.filter((t) => suspect.eventIds.includes(t.id));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title={suspect.name}
          subtitle={suspect.occupation}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/suspects') as never)}
          backLabel="Suspects"
        />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Portrait strip */}
        <View style={styles.portraitStrip}>
          <View style={styles.portraitFrame}>
            <SuspectPortrait suspectId={suspect.id} />
          </View>
          <View style={styles.portraitCaption}>
            <Text style={styles.identityUnconfirmed}>Identity Unconfirmed</Text>
            <Text style={styles.portraitName}>{suspect.name}</Text>
            <Text style={styles.portraitMeta}>
              {suspect.occupation} · Age {suspect.age}
            </Text>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.section}>
          <SectionHeader title="Profile" />
          <DetailRow label="Suspect ID" value={suspect.id} />
          <Divider />
          <DetailRow label="Occupation" value={suspect.occupation} />
          <Divider />
          <DetailRow label="Age" value={String(suspect.age)} />
          <Divider />
          <DetailRow label="Last Known Location" value={location?.name ?? '—'} />
        </View>

        <View style={styles.spacer} />

        {/* Statement */}
        <View style={styles.section}>
          <SectionHeader title="Statement" />
          <View style={styles.textBlock}>
            <Text style={styles.statementText}>"{suspect.statement}"</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Alibi */}
        <View style={styles.section}>
          <SectionHeader title="Alibi" />
          <View style={styles.textBlock}>
            <Text style={styles.alibiText}>{suspect.alibi}</Text>
          </View>
        </View>

        {/* Related Evidence */}
        {relatedEvidence.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="Related Evidence" />
              {relatedEvidence.map((e, i) => (
                <View key={`${e.id}-${i}`}>
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

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.section}>
              <SectionHeader title="Related Events" />
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
  portraitStrip: {
    backgroundColor: C.walnut,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  portraitFrame: {
    borderWidth: 2,
    borderColor: C.antique,
    overflow: 'hidden',
    flexShrink: 0,
  },
  portraitCaption: {
    paddingBottom: 4,
    flex: 1,
  },
  identityUnconfirmed: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 9,
    color: C.antique,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  portraitName: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '600',
    color: C.paper,
    marginBottom: 2,
  },
  portraitMeta: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.antique,
  },
  section: {},
  spacer: {
    height: 16,
  },
  textBlock: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  statementText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  alibiText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.faded,
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
  bottomPad: {
    height: 32,
  },
});
