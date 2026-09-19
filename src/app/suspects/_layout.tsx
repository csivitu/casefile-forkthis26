import { Stack } from 'expo-router';
import { C } from '@/constants/theme';

export default function SuspectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.parchment },
        animation: 'slide_from_right',
      }}
    />
  );
}
