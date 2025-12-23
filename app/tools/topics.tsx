import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react-native';

export default function TopicsScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  
  // Statik Konu Listesi (Gerçekte DB'den de gelebilir ama performans için statik + DB progress iyidir)
  const initialTopics = [
    {
      id: 'math',
      name: 'TYT Matematik',
      expanded: true,
      subTopics: [
        { id: 'math_1', name: 'Temel Kavramlar' },
        { id: 'math_2', name: 'Sayı Basamakları' },
        { id: 'math_3', name: 'Bölme Bölünebilme' },
        { id: 'math_4', name: 'EBOB - EKOK' },
        { id: 'math_5', name: 'Rasyonel Sayılar' },
      ]
    },
    {
      id: 'geo',
      name: 'TYT Geometri',
      expanded: false,
      subTopics: [
        { id: 'geo_1', name: 'Doğruda Açılar' },
        { id: 'geo_2', name: 'Üçgende Açılar' },
      ]
    },
  ];

  const [topics, setTopics] = useState(initialTopics);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from('topic_progress')
      .select('topic_id')
      .eq('user_id', session.user.id)
      .eq('is_completed', true);
    
    if (data) {
      setCompletedIds(data.map(d => d.topic_id));
    }
  };

  const toggleExpand = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  const toggleComplete = async (subId: string) => {
    if (!session?.user) return;

    const isCurrentlyCompleted = completedIds.includes(subId);
    const newStatus = !isCurrentlyCompleted;

    // UI Update (Optimistic)
    if (newStatus) {
      setCompletedIds([...completedIds, subId]);
    } else {
      setCompletedIds(completedIds.filter(id => id !== subId));
    }

    // DB Update
    const { error } = await supabase.from('topic_progress').upsert({
      user_id: session.user.id,
      topic_id: subId,
      is_completed: newStatus
    });

    if (error) {
      console.log('Progress save error', error);
      // Revert UI if error (basitçe yeniden fetch edebiliriz)
      fetchProgress();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ padding: 20 }}>
        {topics.map(topic => (
          <View key={topic.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              onPress={() => toggleExpand(topic.id)}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>{topic.name}</Text>
              {topic.expanded ? <ChevronUp color={colors.subtext} /> : <ChevronDown color={colors.subtext} />}
            </TouchableOpacity>
            
            {topic.expanded && (
              <View style={styles.subList}>
                {topic.subTopics.map(sub => {
                  const isCompleted = completedIds.includes(sub.id);
                  return (
                    <TouchableOpacity 
                      key={sub.id} 
                      style={styles.subItem}
                      onPress={() => toggleComplete(sub.id)}
                    >
                      {isCompleted ? (
                        <CheckSquare size={20} color={colors.primary} />
                      ) : (
                        <Square size={20} color={colors.subtext} />
                      )}
                      <Text style={[
                        styles.subText, 
                        { color: isCompleted ? colors.subtext : colors.text, textDecorationLine: isCompleted ? 'line-through' : 'none' }
                      ]}>
                        {sub.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
  },
  subList: {
    padding: 16,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  subText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
  },
});
