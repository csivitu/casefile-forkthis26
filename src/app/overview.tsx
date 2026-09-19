import { PageHeader } from '@/components/casefile/PageHeader';
import { C, Fonts } from '@/constants/theme';
import { CASE, EVIDENCE, SUSPECTS, TIMELINE } from '@/data/case';
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

type SectionItem = {
  key: string;
  label: string;
  meta: string;
  route: string;
};

export default function OverviewScreen() {
  const router = useRouter();

  const sections: SectionItem[] = [
    {
      key: 'suspects',
      label: 'Suspects',
      meta: `${SUSPECTS.length} individuals under investigation`,
      route: '/suspects',
    },
    {
      key: 'evidence',
      label: 'Evidence',
      meta: `${EVIDENCE.length} items catalogued`,
      route: '/evidence',
    },
    {
      key: 'timeline',
      label: 'Timeline',
      meta: `${TIMELINE.length} events recorded`,
      route: '/timeline',
    },
    {
      key: 'investigation',
      label: 'Investigation',
      meta: 'Notes & conclusion',
      route: '/investigation',
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title={`Case #${CASE.id}`}
          subtitle={CASE.title}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/') as never)}
          backLabel="Home"
        />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status band */}
        <View style={styles.statusBand}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Investigation Active</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{CASE.description}</Text>
        </View>

        {/* Section cards */}
        <View style={styles.sectionCards}>
          {sections.map((sec) => (
            <TouchableOpacity
              key={sec.key}
              style={styles.sectionCard}
              onPress={() => router.push(sec.route as never)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionCardContent}>
                <Text style={styles.sectionLabel}>{sec.label}</Text>
                <Text style={styles.sectionMeta}>{sec.meta}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statusBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: C.paper,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
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
  descriptionContainer: {
    padding: 20,
    paddingBottom: 8,
  },
  description: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.faded,
    lineHeight: 22,
  },
  sectionCards: {
    padding: 20,
    gap: 10,
  },
  sectionCard: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCardContent: {
    flex: 1,
    marginRight: 8,
  },
  sectionLabel: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 16,
    fontWeight: '600',
    color: C.walnut,
    marginBottom: 4,
  },
  sectionMeta: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    color: C.faded,
  },
  chevron: {
    color: C.antique,
    fontSize: 20,
    lineHeight: 22,
  },
});
