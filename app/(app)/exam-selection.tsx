import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, PenTool, Briefcase, ArrowUpDown, Lightbulb, Check, ArrowRight, HelpCircle, GraduationCap } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

type ExamOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export default function ExamSelection() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { session, refreshProfile } = useAuth();
  const router = useRouter();

  const exams: ExamOption[] = [
    {
      id: 'YKS',
      title: 'YKS',
      subtitle: 'TYT & AYT',
      icon: <BookOpen color={selectedExam === 'YKS' ? '#4c8bf5' : '#6B7280'} size={24} />,
    },
    {
      id: 'LGS',
      title: 'LGS',
      subtitle: 'Liseye Geçiş',
      icon: <PenTool color={selectedExam === 'LGS' ? '#4c8bf5' : '#6B7280'} size={24} />,
    },
    {
      id: 'KPSS',
      title: 'KPSS',
      subtitle: 'Memurluk',
      icon: <Briefcase color={selectedExam === 'KPSS' ? '#4c8bf5' : '#6B7280'} size={24} />,
    },
    {
      id: 'DGS',
      title: 'DGS',
      subtitle: 'Dikey Geçiş',
      icon: <ArrowUpDown color={selectedExam === 'DGS' ? '#4c8bf5' : '#6B7280'} size={24} />,
    },
    {
      id: 'ALES',
      title: 'ALES',
      subtitle: 'Akademik',
      icon: <Lightbulb color={selectedExam === 'ALES' ? '#4c8bf5' : '#6B7280'} size={24} />,
    },
  ];

  const handleContinue = async () => {
    if (!selectedExam) return;
    if (!session?.user) return;

    setLoading(true);
    try {
      // Upsert kullanarak: Kayıt varsa güncelle, yoksa oluştur.
      // Bu, profil tablosunda henüz satır oluşmamışsa hatayı önler.
      const updates = {
        id: session.user.id,
        exam_type: selectedExam,
        updated_at: new Date(),
        // Eğer profil yoksa full_name'i metadata'dan alıp ekleyelim
        full_name: session.user.user_metadata?.full_name || 'Öğrenci', 
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      await refreshProfile();
      // Router replace dashboard'a yönlendirecek, _layout zaten kontrol ediyor ama
      // manuel olarak da tetikleyebiliriz.
      router.replace('/(app)/dashboard');
    } catch (error: any) {
      Alert.alert('Hata', 'Seçim kaydedilirken bir sorun oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.iconButton}>
          <GraduationCap color="#4c8bf5" size={24} />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <HelpCircle color="#9CA3AF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Hoş Geldin! 👋</Text>
          <Text style={styles.subtitle}>
            Sana en uygun çalışma planını oluşturmamız için hedefindeki sınavı seç.
          </Text>
        </View>

        <View style={styles.grid}>
          {exams.map((exam) => {
            const isSelected = selectedExam === exam.id;
            return (
              <TouchableOpacity
                key={exam.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedExam(exam.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    {exam.icon}
                  </View>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Check size={12} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, isSelected && styles.textSelected]}>{exam.title}</Text>
                  <Text style={styles.cardSubtitle}>{exam.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedExam && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedExam || loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Devam Et</Text>
              <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1020',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Footer için boşluk
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 10,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    color: '#9CA3AF',
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%', // İki sütunlu yapı
    aspectRatio: 1, // Kareye yakın
    backgroundColor: '#161726',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2D3045',
    justifyContent: 'space-between',
  },
  cardSelected: {
    borderColor: '#4c8bf5',
    backgroundColor: '#1a1e35',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E2032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(76, 139, 245, 0.15)',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4c8bf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
    marginBottom: 4,
  },
  textSelected: {
    color: '#4c8bf5',
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 34, // Safe area için
    backgroundColor: '#0f1020',
    borderTopWidth: 1,
    borderTopColor: '#1E2032',
  },
  button: {
    backgroundColor: '#4c8bf5',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#2D3045',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
});
