import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, X, Save } from 'lucide-react-native';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function NotesScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) Alert.alert('Hata', error.message);
    else setNotes(data || []);
    setLoading(false);
  };

  const addNote = async () => {
    if (!newTitle.trim()) return;
    if (!session?.user) return;

    setSaving(true);
    const { error } = await supabase.from('notes').insert({
      user_id: session.user.id,
      title: newTitle,
      content: newContent,
    });

    setSaving(false);
    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      setModalVisible(false);
      setNewTitle('');
      setNewContent('');
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    Alert.alert('Sil', 'Bu notu silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('notes').delete().eq('id', id);
          if (error) Alert.alert('Hata', error.message);
          else fetchNotes();
        }
      }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.cardContent, { color: colors.subtext }]}>{item.content}</Text>
              <Text style={[styles.cardDate, { color: colors.subtext }]}>
                {new Date(item.created_at).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 40 }}>Henüz not eklemedin.</Text>
          }
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Yeni Not</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Başlık"
            placeholderTextColor={colors.subtext}
            value={newTitle}
            onChangeText={setNewTitle}
          />
          
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Notunuzu buraya yazın..."
            placeholderTextColor={colors.subtext}
            multiline
            value={newContent}
            onChangeText={setNewContent}
          />

          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }]} 
            onPress={addNote}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
  },
  cardContent: {
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
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
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
});
