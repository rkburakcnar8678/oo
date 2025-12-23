import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react-native';

export default function Dashboard() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba, {profile?.full_name || 'Öğrenci'}</Text>
          {profile?.exam_type && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.exam_type} Öğrencisi</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Çalışma Programın Hazırlanıyor...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1020',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2032',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: 'rgba(76, 139, 245, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#4c8bf5',
    fontSize: 12,
    fontFamily: 'Lexend_600SemiBold',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderCard: {
    width: '100%',
    padding: 32,
    backgroundColor: '#161726',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2D3045',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontFamily: 'Lexend_500Medium',
    fontSize: 16,
  },
});
