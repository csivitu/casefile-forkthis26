import { PageHeader } from '@/components/casefile/PageHeader';
import { C, Fonts } from '@/constants/theme';
import { CASE, LOCATIONS, SUSPECTS, TIMELINE } from '@/data/case';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimelineScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title="Timeline"
          subtitle={`Case #${CASE.id} — Chronological Record`}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/overview') as never)}
          backLabel="Overview"
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timelineContainer}>
          {/* Vertical line */}
          <View style={styles.verticalLine} />

          {TIMELINE.map((event, index) => {
            const location = LOCATIONS.find((l) => l.id === event.locationId);
            const suspectNames = event.suspectIds
              .map((sid) => SUSPECTS.find((s) => s.id === sid)?.name)
              .filter(Boolean)
              .join(', ');

            const timeParts = event.timestamp.split(' ');

            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventRow, index < TIMELINE.length - 1 && styles.eventRowGap]}
                onPress={() => router.push(`/timeline/${event.id}` as never)}
                activeOpacity={0.7}
              >
                {/* Time column */}
                <View style={styles.timeColumn}>
                  <Text style={styles.timeHour}>{timeParts[0]}</Text>
                  {timeParts[1] && <Text style={styles.timePeriod}>{timeParts[1]}</Text>}
                </View>

                {/* Node */}
                <View style={styles.nodeWrapper}>
                  <View style={styles.node} />
                </View>

                {/* Card */}
                <View style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>
                    {location?.name ?? '—'}
                    {suspectNames ? ` · ${suspectNames}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  timelineContainer: {
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    left: 58,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: C.divider,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 0,
  },
  eventRowGap: {
    marginBottom: 16,
  },
  timeColumn: {
    width: 50,
    paddingTop: 2,
    alignItems: 'flex-end',
    paddingRight: 4,
    flexShrink: 0,
  },
  timeHour: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
    lineHeight: 14,
  },
  timePeriod: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.antique,
    lineHeight: 13,
  },
  nodeWrapper: {
    width: 18,
    alignItems: 'center',
    paddingTop: 4,
    flexShrink: 0,
  },
  node: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.antique,
    borderWidth: 2,
    borderColor: C.parchment,
    zIndex: 1,
  },
  eventCard: {
    flex: 1,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
  },
  eventTitle: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: C.walnut,
    lineHeight: 20,
    marginBottom: 3,
  },
  eventMeta: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.faded,
    lineHeight: 16,
  },
});
