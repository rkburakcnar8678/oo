import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

export default function PreferenceScreen() {
  const router = useRouter();

  useEffect(() => {
    const openBrowser = async () => {
      // Örnek olarak YÖK Atlas'a yönlendiriyoruz
      await WebBrowser.openBrowserAsync('https://yokatlas.yok.gov.tr/');
      router.back();
    };
    openBrowser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1020' }}>
      <ActivityIndicator size="large" color="#4c8bf5" />
    </View>
  );
}
