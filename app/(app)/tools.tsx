import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  PenTool, 
  Layers, 
  Video, 
  Globe, 
  UserCircle,
  Play
} from 'lucide-react-native';

export default function ToolsScreen() {
  const router = useRouter();

  const tools = [
    {
      id: 'notes',
      title: 'Not Defterim',
      desc: 'Kişisel notların',
      icon: <BookOpen size={24} color="#4c8bf5" />,
      color: 'rgba(76, 139, 245, 0.15)',
      route: '/tools/notes'
    },
    {
      id: 'topics',
      title: 'Konu Takibim',
      desc: 'İlerleme durumun',
      icon: <CheckSquare size={24} color="#4c8bf5" />,
      color: 'rgba(76, 139, 245, 0.15)',
      route: '/tools/topics'
    },
    {
      id: 'trials',
      title: 'Denemelerim',
      desc: 'Sınav analizlerin',
      icon: <BarChart2 size={24} color="#F59E0B" />,
      color: 'rgba(245, 158, 11, 0.15)',
      route: '/tools/trials'
    },
    {
      id: 'preference',
      title: 'Tercih Sihirbazım',
      desc: 'Hedef belirle',
      icon: <Globe size={24} color="#10B981" />,
      color: 'rgba(16, 185, 129, 0.15)',
      route: '/tools/preference'
    },
    {
      id: 'drawing',
      title: 'Çizim Sayfam',
      desc: 'Serbest çalışma',
      icon: <PenTool size={24} color="#EC4899" />,
      color: 'rgba(236, 72, 153, 0.15)',
      route: '/tools/drawing'
    },
    {
      id: 'cards',
      title: 'Bilgi Kartları',
      desc: 'Hızlı tekrar',
      icon: <Layers size={24} color="#F59E0B" />,
      color: 'rgba(245, 158, 11, 0.15)',
      route: '/tools/cards'
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Araçlar</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <UserCircle size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Grid Menu */}
        <View style={styles.grid}>
          {tools.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={styles.card}
              onPress={() => router.push(tool.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#1E2032' }]}>
                {tool.icon}
              </View>
              <Text style={styles.cardTitle}>{tool.title}</Text>
              <Text style={styles.cardDesc}>{tool.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Video Çözümler Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>POPÜLER</Text>
          </View>
          <Text style={styles.bannerTitle}>YKS Video Çözümler</Text>
          <Text style={styles.bannerDesc}>Eksik konularını tamamla, netlerini arttır.</Text>
          
          <View style={styles.bannerFooter}>
            <TouchableOpacity 
              style={styles.watchButton}
              onPress={() => router.push('/tools/videos')}
            >
              <Text style={styles.watchButtonText}>Hemen İzle</Text>
              <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            
            <View style={styles.playIconBox}>
              <Play size={24} color="#3b82f6" fill="#3b82f6" />
            </View>
          </View>
        </View>

      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
  },
  profileIcon: {
    padding: 4,
    backgroundColor: '#1E2032',
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '47%',
    backgroundColor: '#161726',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    aspectRatio: 0.85,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    textAlign: 'center',
  },
  bannerContainer: {
    backgroundColor: '#161726',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerTag: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bannerTagText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Lexend_700Bold',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 8,
  },
  bannerDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 20,
    maxWidth: '70%',
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  watchButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Lexend_600SemiBold',
  },
  playIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#1E2032',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
