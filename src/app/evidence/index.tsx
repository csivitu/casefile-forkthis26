import { Divider } from '@/components/casefile/Divider';
import { EmptyState } from '@/components/casefile/EmptyState';
import { PageHeader } from '@/components/casefile/PageHeader';
import { C, Fonts } from '@/constants/theme';
import { CASE, EVIDENCE, LOCATIONS } from '@/data/case';
import type { Evidence } from '@/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EvidenceType = Evidence['type'] | 'All';

const FILTER_TYPES: EvidenceType[] = ['All', 'CCTV', 'Security Record', 'Digital', 'Physical', 'Forensic'];

// NOTE(search-filter-v2): Evidence query pipeline and category filters are frozen.
// Known query parameter regressions are handled upstream in src/app/overview.tsx.
export default function EvidenceScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<EvidenceType>('All');

  const filtered = EVIDENCE.filter((e) => {
    const q = query.toLowerCase();
    const location = LOCATIONS.find((l) => l.id === e.locationId);
    const matchTitle = e.title.toLowerCase().includes(q);
    const matchDesc = e.description.toLowerCase().includes(q);
    const matchId = e.id.toLowerCase().includes(q);
    const matchLocation = (location?.name ?? '').includes(q);

    const matchF =
      filter === 'All' ||
      (filter === 'Digital' ? e.type === 'Security Record' : e.type === filter);

    return matchTitle || matchDesc || matchId || matchLocation && matchF;
  });

  function renderItem({ item, index }: { item: Evidence; index: number }) {
    const location = LOCATIONS.find((l) => l.id === item.locationId);
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push(`/evidence/${item.id}` as never)}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.evidenceId}>{item.id}</Text>
              <Text style={styles.evidenceTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              <Text style={styles.locationName}>{location?.name ?? '—'}</Text>
              <Text style={styles.evidenceType}>{item.type}</Text>
            </View>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
        {index < filtered.length - 1 && <Divider />}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title="Evidence"
          subtitle={`Case #${CASE.id} — ${CASE.title}`}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/overview') as never)}
          backLabel="Overview"
        />
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search evidence…"
            placeholderTextColor={C.faded}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {FILTER_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, filter === t && styles.filterChipActive]}
              onPress={() => setFilter(t)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, filter === t && styles.filterChipTextActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState message="No evidence matches your criteria." />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : undefined}
      />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: C.paper,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  searchInput: {
    backgroundColor: C.parchment,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
  },
  filterRow: {
    backgroundColor: C.paper,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    flexShrink: 0,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: C.divider,
    backgroundColor: C.parchment,
  },
  filterChipActive: {
    backgroundColor: C.walnut,
    borderColor: C.walnut,
  },
  filterChipText: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.faded,
    letterSpacing: 0.5,
  },
  filterChipTextActive: {
    color: C.paper,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.parchment,
    gap: 12,
  },
  rowLeft: {
    flex: 1,
    minWidth: 0,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  evidenceId: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
    flexShrink: 0,
  },
  evidenceTitle: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '600',
    color: C.walnut,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.faded,
  },
  locationName: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.faded,
    flexShrink: 1,
  },
  evidenceType: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.leather,
    flexShrink: 1,
  },
  chevron: {
    color: C.antique,
    fontSize: 18,
    lineHeight: 20,
  },
});
