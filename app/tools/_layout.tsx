import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function ToolsLayout() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerTitleStyle: { fontFamily: 'Lexend_600SemiBold' },
      headerBackTitleVisible: false,
      contentStyle: { backgroundColor: colors.background }
    }}>
      <Stack.Screen name="notes" options={{ title: 'Not Defterim' }} />
      <Stack.Screen name="topics" options={{ title: 'Konu Takibim' }} />
      <Stack.Screen name="trials" options={{ title: 'Denemelerim' }} />
      <Stack.Screen name="drawing" options={{ title: 'Çizim Sayfam' }} />
      <Stack.Screen name="cards" options={{ title: 'Bilgi Kartları' }} />
      <Stack.Screen name="videos" options={{ title: 'Video Çözümler' }} />
      <Stack.Screen name="preference" options={{ title: 'Tercih Sihirbazı' }} />
    </Stack>
  );
}
