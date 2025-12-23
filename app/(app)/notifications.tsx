import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Bell, Check, ArrowLeft, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'admin' | 'info' | 'success' | 'warning';
  is_read: boolean;
  created_at: string;
  target_exam?: string;
  user_id?: string;
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { session, profile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Tümü' | 'Okunmamış'>('Tümü');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!session?.user) return;
    setLoading(true);

    // 1. Genel Bildirimler (target_exam NULL ve user_id NULL)
    // 2. Sınav Grubuna Özel (target_exam = profile.exam_type)
    // 3. Kişiye Özel (user_id = session.user.id)
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`target_exam.is.null,target_exam.eq.${profile?.exam_type || 'YKS'}`)
      .or(`user_id.is.null,user_id.eq.${session.user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    // UI Update
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);
    // DB Update (Gerçekte her biri için update gerekir veya RPC fonksiyonu)
    Alert.alert('Bilgi', 'Tüm bildirimler okundu olarak işaretlendi.');
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'admin': return '#EF4444'; // Kırmızı
      case 'success': return '#10B981'; // Yeşil
      case 'warning': return '#F59E0B'; // Turuncu
      default: return '#3B82F6'; // Mavi
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'admin': return 'Önemli';
      case 'success': return 'Başarılı';
      case 'warning': return 'Uyarı';
      default: return 'Bilgi';
    }
  };

  const filteredNotifications = activeTab === 'Okunmamış' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: getBadgeColor(item.type) }]}>
          <Text style={styles.badgeText}>{getBadgeText(item.type)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.timeText, { color: colors.subtext }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {!item.is_read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
        </View>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.message, { color: colors.subtext }]}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#1e3a8a' }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bildirimler</Text>
          <TouchableOpacity>
            <Settings color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Tümü' && styles.activeTab]}
            onPress={() => setActiveTab('Tümü')}
          >
            <Text style={[styles.tabText, activeTab === 'Tümü' && styles.activeTabText]}>Tüm Bildirimler</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Okunmamış' && styles.activeTab]}
            onPress={() => setActiveTab('Okunmamış')}
          >
            <Text style={[styles.tabText, activeTab === 'Okunmamış' && styles.activeTabText]}>Okunmamış</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllAsRead}>
            <Check size={14} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.markReadText}>Tümünü Oku</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={[styles.sectionTitle, { color: colors.text }]}>Bugün</Text>}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Bell size={40} color={colors.subtext} />
              <Text style={{ color: colors.subtext, marginTop: 12 }}>Bildiriminiz yok.</Text>
            </View>
          ) : (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    marginRight: 20,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Lexend_500Medium',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
    fontFamily: 'Lexend_600SemiBold',
  },
  markReadBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  markReadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  listContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Lexend_700Bold',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Lexend_500Medium',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    lineHeight: 20,
  },
});
