import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Plus, Star, Award, MessageSquare, ThumbsUp, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { LinearGradient } from 'expo-linear-gradient'; // EKLENDİ

type Question = {
  id: string;
  content: string;
  image_url: string | null;
  tag: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  };
  likes_count: number;
  comments_count: number;
};

const TAGS = ['Tümü', 'TYT Mat', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih'];

export default function QuestionsScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('Kesfet');
  const [selectedTag, setSelectedTag] = useState('Tümü');
  const [modalVisible, setModalVisible] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // New Question State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('TYT Mat');
  const [newQuestionImage, setNewQuestionImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [selectedTag]);

  const fetchQuestions = async () => {
    setLoading(true);
    let query = supabase
      .from('questions')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .order('created_at', { ascending: false });

    if (selectedTag !== 'Tümü') {
      query = query.eq('tag', selectedTag);
    }

    const { data, error } = await query;
    if (error) {
      console.log('Error fetching questions:', error);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setNewQuestionImage(result.assets[0].uri);
    }
  };

  const submitQuestion = async () => {
    if (!newQuestionText.trim()) {
      Alert.alert('Hata', 'Lütfen sorunuzu yazın.');
      return;
    }
    if (!session?.user) return;

    setSubmitting(true);
    let imageUrl = null;

    try {
      if (newQuestionImage) {
        const base64 = await FileSystem.readAsStringAsync(newQuestionImage, { encoding: 'base64' });
        const fileName = `${session.user.id}/${Date.now()}.jpg`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(fileName, decode(base64), { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          user_id: session.user.id,
          content: newQuestionText,
          tag: newQuestionTag,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      Alert.alert('Başarılı', 'Sorunuz paylaşıldı!');
      setModalVisible(false);
      setNewQuestionText('');
      setNewQuestionImage(null);
      fetchQuestions();

    } catch (error: any) {
      Alert.alert('Hata', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.userRow}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
            <Text style={{ color: colors.primary, fontFamily: 'Lexend_700Bold' }}>
              {item.profiles?.full_name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{item.profiles?.full_name || 'Kullanıcı'}</Text>
            <Text style={[styles.timeText, { color: colors.subtext }]}>{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
        </View>
        <View style={[styles.tagBadge, { backgroundColor: 'rgba(76, 139, 245, 0.1)' }]}>
          <Text style={[styles.tagBadgeText, { color: colors.primary }]}>{item.tag}</Text>
        </View>
      </View>

      <Text style={[styles.questionContent, { color: colors.text }]}>{item.content}</Text>
      
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.questionImage} resizeMode="cover" />
      )}

      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.interactionBtn}>
          <ThumbsUp size={18} color={colors.subtext} />
          <Text style={[styles.interactionText, { color: colors.subtext }]}>{item.likes_count || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionBtn}>
          <MessageSquare size={18} color={colors.subtext} />
          <Text style={[styles.interactionText, { color: colors.subtext }]}>{item.comments_count || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Sorular</Text>
          <Text style={[styles.pageSubtitle, { color: colors.subtext }]}>Sor, Cevapla, Öğren</Text>
        </View>
        <View style={[styles.pointsBadge, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.pointsText}>1,250 puan</Text>
        </View>
      </View>

      {/* Search & Tabs */}
      <View style={styles.searchRow}>
        <View style={[styles.tabContainer, { backgroundColor: colors.secondary }]}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Kesfet' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('Kesfet')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Kesfet' ? colors.text : colors.subtext }]}>Keşfet</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Sorularim' && { backgroundColor: colors.card }]}
            onPress={() => setActiveTab('Sorularim')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'Sorularim' ? colors.text : colors.subtext }]}>Sorularım</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <Search size={20} color={colors.text} style={{ marginRight: 12 }} />
          <Filter size={20} color={colors.text} />
        </View>
      </View>

      {/* Ask Button */}
      <TouchableOpacity 
        style={[styles.askButton, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.askButtonText}>Soru Sor</Text>
      </TouchableOpacity>

      {/* Tags Scroll */}
      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          {TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagChip, 
                { backgroundColor: selectedTag === tag ? colors.primary : colors.card, borderColor: colors.border }
              ]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={[styles.tagChipText, { color: selectedTag === tag ? '#fff' : colors.text }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content List */}
      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Puan Sistemi Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.infoHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.iconBg, { backgroundColor: '#F59E0B' }]}>
                    <Star size={14} color="#fff" fill="#fff" />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Puan Sistemi</Text>
                </View>
                <Text style={{ color: '#10B981', fontFamily: 'Lexend_600SemiBold', fontSize: 12 }}>Bu hafta +120</Text>
              </View>
              <View style={styles.pointsGrid}>
                <Text style={[styles.pointItem, { color: colors.subtext }]}><Text style={{color: colors.primary}}>●</Text> Soru sor: <Text style={{fontFamily: 'Lexend_700Bold', color: colors.text}}>+5</Text></Text>
                <Text style={[styles.pointItem, { color: colors.subtext }]}><Text style={{color: '#10B981'}}>●</Text> Cevap ver: <Text style={{fontFamily: 'Lexend_700Bold', color: colors.text}}>+10</Text></Text>
              </View>
            </View>

            {/* Mentor Card */}
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.mentorCard}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={[styles.iconBg, { backgroundColor: '#10B981', marginRight: 12 }]}>
                  <Award size={16} color="#fff" />
                </View>
                <View>
                  <Text style={{ color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 16 }}>Sen de mentor ol!</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12, fontFamily: 'Lexend_400Regular' }}>50 başarılı cevaptan sonra başvurabilirsin</Text>
                </View>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: '24%' }]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ color: '#10B981', fontSize: 12, fontFamily: 'Lexend_600SemiBold' }}>Nasıl Olunur? →</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12 }}>12/50</Text>
              </View>
            </LinearGradient>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popüler Konular</Text>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.subtext }}>Henüz soru yok.</Text>
            </View>
          ) : (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          )
        }
      />

      {/* Ask Question Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Soru Sor</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={[styles.label, { color: colors.text }]}>Ders Seçimi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50, marginBottom: 16 }}>
                {TAGS.filter(t => t !== 'Tümü').map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip, 
                      { backgroundColor: newQuestionTag === tag ? colors.primary : colors.card, borderColor: colors.border }
                    ]}
                    onPress={() => setNewQuestionTag(tag)}
                  >
                    <Text style={[styles.tagChipText, { color: newQuestionTag === tag ? '#fff' : colors.text }]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.label, { color: colors.text }]}>Sorunuz</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                placeholder="Sorunuzu buraya yazın..."
                placeholderTextColor={colors.subtext}
                multiline
                numberOfLines={4}
                value={newQuestionText}
                onChangeText={setNewQuestionText}
              />

              <TouchableOpacity style={[styles.imageUploadBtn, { borderColor: colors.border }]} onPress={pickImage}>
                {newQuestionImage ? (
                  <Image source={{ uri: newQuestionImage }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                ) : (
                  <>
                    <ImageIcon size={32} color={colors.subtext} />
                    <Text style={{ color: colors.subtext, marginTop: 8 }}>Fotoğraf Ekle</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={submitQuestion}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Paylaş</Text>}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
  },
  pageSubtitle: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    color: '#F59E0B',
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 12,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 13,
  },
  iconRow: {
    flexDirection: 'row',
  },
  askButton: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  askButtonText: {
    color: '#fff',
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
  },
  tagsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tagChipText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 13,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
  },
  pointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  pointItem: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  mentorCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    marginBottom: 12,
  },
  questionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Lexend_400Regular',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontFamily: 'Lexend_600SemiBold',
  },
  questionContent: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 20,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionText: {
    fontSize: 12,
    fontFamily: 'Lexend_500Medium',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Lexend_700Bold',
  },
  modalContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Lexend_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontFamily: 'Lexend_400Regular',
  },
  imageUploadBtn: {
    height: 150,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
});
