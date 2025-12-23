import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Settings, ChevronRight, Edit2, User, Moon, HelpCircle, Calendar, CheckCircle, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { signOut, profile } = useAuth();
  const { colors, theme } = useTheme();

  // Grafik Verisi
  const data = [20, 40, 35, 50, 45, 60, 80];
  const chartHeight = 120;
  const chartWidth = width - 48; // Paddingleri çıkar

  const lineGenerator = shape.line()
    .x((d, i) => (i * (chartWidth / (data.length - 1))))
    .y(d => chartHeight - (d * (chartHeight / 100)))
    .curve(shape.curveBasis);

  const pathData = lineGenerator(data) || '';
  const areaData = `${pathData} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0f1020' }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={{ padding: 8 }}>
          <ChevronRight size={24} color="transparent" /> 
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profilim</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profil Resmi ve İsim */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient colors={['#4c8bf5', '#3b82f6']} style={styles.avatarBg}>
              <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'A'}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.editBadge}>
              <Edit2 size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'Ahmet Yılmaz'}</Text>
          <View style={styles.userTag}>
            <Text style={styles.userTagText}>12. Sınıf - {profile?.exam_type || 'Sayısal'}</Text>
          </View>
        </View>

        {/* Haftalık Performans Kartı */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Target size={20} color="#4c8bf5" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Haftalık Performans</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.detailLink}>Detaylar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartLabel}>Toplam Çalışma</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.chartValue}>18.5s</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ %12</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.chartLabel}>Sıralama</Text>
              <Text style={styles.rankValue}>#42 Genel</Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#4c8bf5" stopOpacity="0.5" />
                  <Stop offset="1" stopColor="#4c8bf5" stopOpacity="0" />
                </SvgLinearGradient>
              </Defs>
              <Path d={areaData} fill="url(#grad)" />
              <Path d={pathData} stroke="#4c8bf5" strokeWidth="3" fill="none" />
            </Svg>
          </View>
          
          <View style={styles.daysRow}>
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
              <Text key={i} style={styles.dayText}>{day}</Text>
            ))}
          </View>
        </View>

        {/* Çalışma Durumu */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Çalışma Durumu</Text>
        <View style={styles.statsRow}>
          {/* Sol Kart: Çözülen Soru */}
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 139, 245, 0.2)' }]}>
              <HelpCircle size={20} color="#4c8bf5" />
            </View>
            <Text style={styles.statBigValue}>1,240</Text>
            <Text style={styles.statLabel}>Çözülen Soru</Text>
          </View>

          {/* Sağ Kart: Günlük Hedef */}
          <View style={styles.statCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={{ color: '#10B981', fontFamily: 'Lexend_700Bold' }}>%85</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '85%' }]} />
            </View>
            
            <Text style={[styles.statBigValue, { fontSize: 18, marginTop: 12 }]}>150 / 200</Text>
            <Text style={styles.statLabel}>Günlük Hedef</Text>
          </View>
        </View>

        {/* Ders Programım Kartı */}
        <LinearGradient
          colors={['#4F46E5', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.programCard}
        >
          <View style={styles.programIconBox}>
            <Calendar size={24} color="#4F46E5" />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <Text style={styles.programTitle}>Ders Programım</Text>
            <Text style={styles.programSubtitle}>Bugün: Matematik & Fizik</Text>
          </View>
          <View style={styles.arrowCircle}>
            <ChevronRight size={20} color="#4F46E5" />
          </View>
        </LinearGradient>

        {/* Hesap Menüsü */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Hesap</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBg}>
              <User size={20} color="#A855F7" />
            </View>
            <Text style={styles.menuText}>Kişisel Bilgiler</Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBg, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <Moon size={20} color="#F97316" />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.menuText}>Görünüm</Text>
              <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Lexend_400Regular', marginRight: 8 }}>Koyu Mod</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.menuIconBg, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <HelpCircle size={20} color="#3B82F6" />
            </View>
            <Text style={styles.menuText}>Yardım & Destek</Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Lexend_600SemiBold',
  },
  settingsButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(76, 139, 245, 0.3)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'Lexend_700Bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4c8bf5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0f1020',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 8,
  },
  userTag: {
    backgroundColor: '#1E2032',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userTagText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
  },
  detailLink: {
    color: '#4c8bf5',
    fontSize: 12,
    fontFamily: 'Lexend_500Medium',
    backgroundColor: 'rgba(76, 139, 245, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chartCard: {
    backgroundColor: '#161726',
    borderRadius: 24,
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 4,
  },
  chartValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    marginRight: 8,
  },
  trendBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendText: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Lexend_600SemiBold',
  },
  rankValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
  },
  chartWrapper: {
    marginBottom: 16,
    marginLeft: -10, // Svg padding fix
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#161726',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statBigValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2D3045',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  programIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  programTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 2,
  },
  programSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#161726',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3045',
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Lexend_500Medium',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
});
