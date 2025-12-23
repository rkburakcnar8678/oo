import { useEffect, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading, profile, profileLoading } = useAuth();
  const { theme, colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || (session && profileLoading)) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (session) {
      if (!profile || !profile.exam_type) {
        if (segments[1] !== 'exam-selection') {
          router.replace('/(app)/exam-selection');
        }
      } else {
        if (!inAppGroup || segments[1] === 'exam-selection') {
          router.replace('/(app)');
        }
      }
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
  }, [session, loading, profile, profileLoading, segments]);

  if (loading || (session && profileLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ThemeProvider>
      </View>
    </GestureHandlerRootView>
  );
}
