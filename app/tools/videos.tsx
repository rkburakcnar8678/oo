import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const PUBLISHERS = [
  { id: '1', name: '3D Yayınları', url: 'https://www.youtube.com/@3DYayinlari', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kX4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4=s900-c-k-c0x00ffffff-no-rj' },
  { id: '2', name: 'Bilgi Sarmal', url: 'https://www.youtube.com/@BilgiSarmal', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kX4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4=s900-c-k-c0x00ffffff-no-rj' },
  { id: '3', name: 'Apotemi', url: 'https://www.youtube.com/@Apotemi', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kX4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4=s900-c-k-c0x00ffffff-no-rj' },
  { id: '4', name: 'Hız ve Renk', url: 'https://www.youtube.com/@HizveRenk', logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kX4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4_g4=s900-c-k-c0x00ffffff-no-rj' },
];

export default function VideosScreen() {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={PUBLISHERS}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => openLink(item.url)}
          >
            <View style={styles.logoContainer}>
              {/* Placeholder Logo - Gerçek logolar için Image kullanılmalı */}
              <Text style={[styles.logoText, { color: colors.primary }]}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.sub, { color: colors.subtext }]}>Video Çözüm</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 139, 245, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
});
