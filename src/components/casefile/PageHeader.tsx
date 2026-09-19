import { C, Fonts } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
}

export function PageHeader({ title, subtitle, onBack, backLabel = 'Back' }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backText}>←</Text>
          {backLabel ? <Text style={styles.backLabel}>{backLabel}</Text> : null}
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    backgroundColor: C.paper,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    minWidth: 58,
    height: 42,
    borderRadius: 8,
    backgroundColor: C.walnut,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 18,
    fontWeight: '700',
    color: C.paper,
    lineHeight: 18,
  },
  backLabel: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 11,
    fontWeight: '600',
    color: C.paper,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 22,
    fontWeight: '600',
    color: C.walnut,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    color: C.faded,
    marginTop: 4,
  },
});
