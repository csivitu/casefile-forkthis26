/**
 * BlueprintBackground — subtle floor plan overlay for evidence/event detail screens.
 * Rendered as React Native Views only (no SVG dependency).
 * Appears in the bottom-right corner at low opacity.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BlueprintBackgroundProps {
  locationName: string;
}

const BP_COLOR = '#4A3024';
const BP_OPACITY = 0.06;

function CorridorBlueprint({ label }: { label: string }) {
  return (
    <View style={styles.blueprintContainer}>
      <Text style={styles.blueprintLabel}>{label}</Text>
      {/* Long corridor rect */}
      <View style={styles.corridorRect} />
      {/* Centre dashed line (simulated with short segments) */}
      {[0, 14, 28, 42, 56, 70, 84, 98, 112].map((x) => (
        <View key={x} style={[styles.dashSegment, { left: 8 + x }]} />
      ))}
      {/* Door openings */}
      <View style={[styles.doorArc, { left: 28, top: 0 }]} />
      <View style={[styles.doorArc, { left: 100, top: 18 }]} />
    </View>
  );
}

function RoomBlueprint({ label }: { label: string }) {
  return (
    <View style={styles.blueprintContainer}>
      <Text style={styles.blueprintLabel}>{label}</Text>
      {/* Main room */}
      <View style={styles.mainRoom} />
      {/* Interior furniture suggestion */}
      <View style={styles.deskRect} />
      <View style={[styles.smallRect, { left: 28, top: 22 }]} />
      {/* Door arc */}
      <View style={[styles.doorArc, { left: 6, top: 50 }]} />
    </View>
  );
}

function VaultBlueprint() {
  return (
    <View style={styles.blueprintContainer}>
      <Text style={styles.blueprintLabel}>PROTOTYPE VAULT</Text>
      {/* Outer room */}
      <View style={styles.mainRoom} />
      {/* Inner vault door */}
      <View style={styles.vaultDoor} />
      {/* Vault circle dial */}
      <View style={styles.vaultDial} />
      {/* Keypad */}
      <View style={[styles.smallRect, { right: 10, top: 28, width: 10, height: 16 }]} />
    </View>
  );
}

const BLUEPRINT_MAP: Record<string, React.ComponentType> = {
  'South Corridor': () => <CorridorBlueprint label="SOUTH CORRIDOR" />,
  'East Corridor': () => <CorridorBlueprint label="EAST CORRIDOR" />,
  'Security Office': () => <RoomBlueprint label="SECURITY OFFICE" />,
  'Storage Room': () => <RoomBlueprint label="STORAGE ROOM" />,
  'Main Entrance': () => <RoomBlueprint label="MAIN ENTRANCE" />,
  'Laboratory': () => <RoomBlueprint label="LABORATORY" />,
  'Prototype Vault': VaultBlueprint,
};

export function BlueprintBackground({ locationName }: BlueprintBackgroundProps) {
  const BlueprintComponent = BLUEPRINT_MAP[locationName];
  if (!BlueprintComponent) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={{ opacity: BP_OPACITY }}>
        <BlueprintComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 160,
    zIndex: 0,
  },
  blueprintContainer: {
    width: 160,
    height: 90,
    position: 'relative',
  },
  blueprintLabel: {
    fontFamily: 'monospace',
    fontSize: 7,
    color: BP_COLOR,
    letterSpacing: 1.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  corridorRect: {
    position: 'absolute',
    top: 20,
    left: 6,
    right: 6,
    height: 36,
    borderWidth: 1,
    borderColor: BP_COLOR,
  },
  dashSegment: {
    position: 'absolute',
    top: 37,
    width: 10,
    height: 1,
    backgroundColor: BP_COLOR,
    opacity: 0.5,
  },
  doorArc: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BP_COLOR,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  mainRoom: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 18,
    borderWidth: 1.5,
    borderColor: BP_COLOR,
  },
  deskRect: {
    position: 'absolute',
    left: 22,
    top: 20,
    width: 52,
    height: 24,
    borderWidth: 1,
    borderColor: BP_COLOR,
  },
  smallRect: {
    position: 'absolute',
    width: 14,
    height: 10,
    borderWidth: 0.8,
    borderColor: BP_COLOR,
  },
  vaultDoor: {
    position: 'absolute',
    left: 44,
    top: 20,
    width: 52,
    height: 42,
    borderWidth: 1.5,
    borderColor: BP_COLOR,
  },
  vaultDial: {
    position: 'absolute',
    left: 62,
    top: 30,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BP_COLOR,
  },
});
