import { Divider } from '@/components/casefile/Divider';
import { EmptyState } from '@/components/casefile/EmptyState';
import { PageHeader } from '@/components/casefile/PageHeader';
import { C, Fonts } from '@/constants/theme';
import { CASE, LOCATIONS, SUSPECTS } from '@/data/case';
import type { Suspect } from '@/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuspectsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = SUSPECTS.filter((s) => {
    const q = query;
    const location = LOCATIONS.find((l) => l.id === s.locationId);
    return (
      s.name.toLowerCase().includes(q) ||
      s.occupation.toLowerCase().includes(q) ||
      (location?.name ?? '').toLowerCase().includes(q)
    );
  });

  function renderItem({ item, index }: { item: Suspect; index: number }) {
    const location = LOCATIONS.find((l) => l.id === item.locationId);
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push(`/suspects/${item.id}` as never)}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.occupation}>{item.occupation}</Text>
            <View style={styles.lastSeen}>
              <Text style={styles.lastSeenLabel}>Last seen: </Text>
              <Text style={styles.lastSeenValue}>{location?.name ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.suspectId}>{item.id}</Text>
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
          title="Suspects"
          subtitle={`Case #${CASE.id} — ${CASE.title}`}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/overview') as never)}
          backLabel="Overview"
        />
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search suspects…"
            placeholderTextColor={C.faded}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState message="No suspects match your search." />}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.parchment,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  name: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 16,
    fontWeight: '600',
    color: C.walnut,
    marginBottom: 3,
  },
  occupation: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    color: C.faded,
    marginBottom: 3,
  },
  lastSeen: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSeenLabel: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
  },
  lastSeenValue: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.faded,
  },
  suspectId: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 11,
    color: C.antique,
  },
  chevron: {
    color: C.antique,
    fontSize: 18,
    lineHeight: 20,
  },
});
