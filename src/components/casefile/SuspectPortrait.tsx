/**
 * SuspectPortrait — use the approved design-reference suspect artwork.
 * Each suspect image is mapped to its case ID and framed with the same casefile stamp treatment.
 */
import { C } from '@/constants/theme';
import { Image, StyleSheet, View } from 'react-native';

interface SuspectPortraitProps {
  suspectId: string;
}

const PORTRAIT_IMAGES = {
  S01: require('../../../design-reference/Suspect_images/s01.png'),
  S02: require('../../../design-reference/Suspect_images/s02.png'),
  S03: require('../../../design-reference/Suspect_images/s03.png'),
  S04: require('../../../design-reference/Suspect_images/s04.png'),
  S05: require('../../../design-reference/Suspect_images/s05.png'),
} as const;

export function SuspectPortrait({ suspectId }: SuspectPortraitProps) {
  const source = PORTRAIT_IMAGES[suspectId as keyof typeof PORTRAIT_IMAGES];

  if (!source) return null;

  return (
    <View style={styles.frame}>
      <Image source={source} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 80,
    height: 100,
    position: 'relative',
    backgroundColor: '#D6C4A8',
    borderWidth: 2,
    borderColor: C.antique,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D6C4A8',
  },
});
