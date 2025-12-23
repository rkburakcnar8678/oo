import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Hourglass, Play, Pause, RotateCcw, Droplets, Moon, Sun, ChevronRight, CloudRain, Trees, Coffee, Music } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; 

type PomodoroMode = {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: [string, string];
  soundUrl: string; // Gerçek ses dosyası URL'leri
};

const POMODORO_MODES: PomodoroMode[] = [
  {
    id: 'rain',
    name: 'Yağmur Sesi',
    icon: <CloudRain size={24} color="#fff" />,
    colors: ['#3b82f6', '#1d4ed8'],
    // Telifsiz yağmur sesi
    soundUrl: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  },
  {
    id: 'relax',
    name: 'Relax Müzik',
    icon: <Music size={24} color="#fff" />,
    colors: ['#8B5CF6', '#6D28D9'], 
    // Telifsiz ambient müzik
    soundUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', 
  },
  {
    id: 'nature',
    name: 'Doğa Sesi',
    icon: <Trees size={24} color="#fff" />,
    colors: ['#10B981', '#047857'], 
    // Telifsiz orman sesi
    soundUrl: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg',
  },
];

export default function HomeScreen() {
  const { profile } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const router = useRouter();
  
  const examName = profile?.exam_type || 'YKS';
  const examDates: Record<string, string> = {
    'YKS': '2025-06-14',
    'LGS': '2025-06-01',
    'KPSS': '2025-07-20',
    'DGS': '2025-06-30',
    'ALES': '2025-05-10',
  };

  const targetDate = new Date(examDates[examName] || '2025-06-15');
  const today = new Date();
  const diffTime = Math.abs(targetDate.getTime() - today.getTime());
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Pomodoro State
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [workMode, setWorkMode] = useState<'work' | 'break'>('work');
  const [currentModeIndex, setCurrentModeIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ses temizleme
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Mod değiştiğinde sesi durdur
  useEffect(() => {
    if (sound) {
      sound.stopAsync();
      setIsActive(false);
    }
  }, [currentModeIndex]);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      console.log('Ses yükleniyor:', POMODORO_MODES[currentModeIndex].soundUrl);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: POMODORO_MODES[currentModeIndex].soundUrl },
        { shouldPlay: true, isLooping: true, volume: 0.5 }
      );
      setSound(newSound);
    } catch (error) {
      console.log('Ses çalma hatası:', error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  useEffect(() => {
    if (isActive) {
      playSound();
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            stopSound();
            const nextMode = workMode === 'work' ? 'break' : 'work';
            Alert.alert(
              'Süre Doldu! 🔔', 
              workMode === 'work' ? 'Harika çalıştın! Şimdi mola zamanı.' : 'Mola bitti! Çalışmaya dönme zamanı.',
              [{ text: 'Tamam', onPress: () => {
                setWorkMode(nextMode);
                setTimer(nextMode === 'work' ? 25 * 60 : 5 * 60);
              }}]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopSound();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimer(workMode === 'work' ? 25 * 60 : 5 * 60);
    stopSound();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);
    if (index !== currentModeIndex && index >= 0 && index < POMODORO_MODES.length) {
      setCurrentModeIndex(index);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
              <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'Ö'}</Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Merhaba, {profile?.full_name?.split(' ')[0] || 'Öğrenci'}</Text>
              <View style={styles.countdownContainer}>
                <Hourglass size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.countdownText, { color: colors.subtext }]}>
                  {examName}'ye <Text style={[styles.highlightText, { color: colors.primary }]}>{daysLeft} gün</Text> kaldı.
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.secondary }]} 
            onPress={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun size={20} color={colors.text} />
            ) : (
              <Moon size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* 1. Son Çalışman */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Son Çalışman</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/tools')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.continueCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/tools/topics')}
            activeOpacity={0.9}
          >
            <View style={styles.continueCardContent}>
              <View style={[styles.tagContainer, { backgroundColor: 'rgba(76, 139, 245, 0.15)' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>TYT MATEMATİK</Text>
              </View>
              <Text style={[styles.lessonTitle, { color: colors.text }]}>Problemler</Text>
              <Text style={[styles.progressText, { color: colors.subtext }]}>Kaldığın yerden devam et</Text>
              
              <View style={[styles.continueButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Text style={[styles.continueButtonText, { color: colors.primary }]}>Devam Et</Text>
                <ChevronRight size={14} color={colors.primary} />
              </View>
            </View>
            <Image 
              source={{ uri: 'https://img.freepik.com/free-vector/gradient-numerology-background_23-2150061838.jpg' }}
              style={styles.lessonImage}
            />
          </TouchableOpacity>
        </View>

        {/* 2. Haftalık Performans */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Haftalık Performans</Text>
          <View style={[styles.performanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.performanceLabel, { color: colors.subtext }]}>Toplam Net</Text>
              <View style={styles.netContainer}>
                <Text style={[styles.netValue, { color: colors.text }]}>68.5</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ +4.5</Text>
                </View>
              </View>
              <Text style={[styles.performanceSubtext, { color: colors.subtext }]}>Geçen haftaya göre artış var.</Text>
            </View>
            
            <View style={styles.chartContainer}>
              <View style={[styles.chartBar, { height: 20, backgroundColor: colors.border }]} />
              <View style={[styles.chartBar, { height: 35, backgroundColor: colors.border }]} />
              <View style={[styles.chartBar, { height: 25, backgroundColor: colors.border }]} />
              <View style={[styles.chartBar, { height: 50, backgroundColor: colors.border }]} />
              <View style={[styles.chartBarActive, { height: 65, backgroundColor: colors.primary }]} />
            </View>
          </View>
        </View>

        {/* 3. Pomodoro (En Altta) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pomodoro Odak</Text>
          
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {POMODORO_MODES.map((mode, index) => (
              <View key={mode.id} style={{ width: CARD_WIDTH, marginRight: index === POMODORO_MODES.length - 1 ? 0 : 0 }}>
                <LinearGradient
                  colors={mode.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pomodoroCard}
                >
                  <View style={styles.pomodoroHeader}>
                    <View style={styles.pomodoroTitleContainer}>
                      <View style={styles.timerIconBg}>
                        {mode.icon}
                      </View>
                      <View>
                        <Text style={styles.pomodoroTitle}>{mode.name}</Text>
                        <Text style={styles.pomodoroSubtitle}>
                          {workMode === 'work' ? 'Odaklanma Zamanı' : 'Mola Zamanı'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.pomodoroContent}>
                    <View>
                      <Text style={styles.timerText}>{formatTime(timer)}</Text>
                      <Text style={styles.modeText}>{workMode === 'work' ? 'Çalışma Modu' : 'Mola Modu'}</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity style={styles.playButton} onPress={toggleTimer}>
                        {isActive ? (
                          <Pause size={24} color={mode.colors[0]} fill={mode.colors[0]} />
                        ) : (
                          <Play size={24} color={mode.colors[0]} fill={mode.colors[0]} style={{ marginLeft: 4 }} />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={[styles.playButton, { width: 50, paddingHorizontal: 0, justifyContent: 'center' }]} onPress={resetTimer}>
                        <RotateCcw size={20} color={mode.colors[0]} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.pomodoroFooter}>
                    <View style={styles.dotsContainer}>
                      {POMODORO_MODES.map((_, i) => (
                        <View 
                          key={i} 
                          style={[
                            styles.dot, 
                            i === currentModeIndex ? styles.activeDot : {}
                          ]} 
                        />
                      ))}
                    </View>
                    <View style={styles.soundButton}>
                      <Droplets size={14} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.soundText}>{isActive ? 'Ses Çalıyor' : 'Ses Durdu'}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E2032' },
  avatarText: { color: '#fff', fontSize: 20, fontFamily: 'Lexend_700Bold' },
  greeting: { fontSize: 16, fontFamily: 'Lexend_700Bold', marginBottom: 4 },
  countdownContainer: { flexDirection: 'row', alignItems: 'center' },
  countdownText: { fontSize: 13, fontFamily: 'Lexend_400Regular' },
  highlightText: { fontFamily: 'Lexend_600SemiBold' },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Lexend_700Bold', marginBottom: 12 },
  seeAllText: { fontSize: 14, fontFamily: 'Lexend_500Medium' },
  continueCard: { borderRadius: 20, padding: 16, flexDirection: 'row', borderWidth: 1 },
  continueCardContent: { flex: 1, marginRight: 12 },
  tagContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  tagText: { fontSize: 10, fontFamily: 'Lexend_700Bold' },
  lessonTitle: { fontSize: 16, fontFamily: 'Lexend_700Bold', marginBottom: 4 },
  progressText: { fontSize: 12, fontFamily: 'Lexend_400Regular', marginBottom: 8 },
  progressBarBg: { height: 6, borderRadius: 3, marginBottom: 16 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  continueButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, gap: 4 },
  continueButtonText: { fontSize: 12, fontFamily: 'Lexend_600SemiBold' },
  lessonImage: { width: 80, height: 80, borderRadius: 12 },
  performanceCard: { borderRadius: 20, padding: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  performanceLabel: { fontSize: 14, fontFamily: 'Lexend_500Medium', marginBottom: 4 },
  netContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  netValue: { fontSize: 32, fontFamily: 'Lexend_700Bold', marginRight: 8 },
  trendBadge: { backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  trendText: { color: '#22C55E', fontSize: 12, fontFamily: 'Lexend_600SemiBold' },
  performanceSubtext: { fontSize: 12, fontFamily: 'Lexend_400Regular' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 65 },
  chartBar: { width: 12, borderRadius: 4 },
  chartBarActive: { width: 12, borderRadius: 4 },
  pomodoroCard: { borderRadius: 24, padding: 20, width: '100%' },
  pomodoroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  pomodoroTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  timerIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  pomodoroTitle: { fontSize: 16, fontFamily: 'Lexend_700Bold', color: '#fff' },
  pomodoroSubtitle: { fontSize: 12, fontFamily: 'Lexend_400Regular', color: 'rgba(255,255,255,0.8)' },
  pomodoroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  timerText: { fontSize: 48, fontFamily: 'Lexend_700Bold', color: '#fff', letterSpacing: -1 },
  modeText: { fontSize: 14, fontFamily: 'Lexend_500Medium', color: 'rgba(255,255,255,0.9)' },
  playButton: { backgroundColor: '#fff', width: 110, height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  pomodoroFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dotsContainer: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  activeDot: { backgroundColor: '#fff', width: 24 },
  soundButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  soundText: { color: '#fff', fontSize: 12, fontFamily: 'Lexend_500Medium' },
});
