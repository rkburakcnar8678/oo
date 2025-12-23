import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Plus, X } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

type Trial = {
  id: string;
  name: string;
  net_score: number;
  created_at: string;
};

export default function TrialsScreen() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [netScore, setNetScore] = useState('');

  useEffect(() => {
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('trials')
      .select('*')
      .order('created_at', { ascending: true }); // Grafik için eskiden yeniye

    if (error) console.log(error);
    else setTrials(data || []);
    setLoading(false);
  };

  const addTrial = async () => {
    if (!name || !netScore) return;
    const net = parseFloat(netScore);
    if (isNaN(net)) {
      Alert.alert('Hata', 'Geçerli bir net giriniz.');
      return;
    }

    const { error } = await supabase.from('trials').insert({
      user_id: session?.user?.id,
      name,
      net_score: net,
    });

    if (error) Alert.alert('Hata', error.message);
    else {
      setModalVisible(false);
      setName('');
      setNetScore('');
      fetchTrials();
    }
  };

  // Grafik verisi hazırlama (Son 5 deneme)
  const chartData = {
    labels: trials.slice(-5).map((_, i) => `D${i+1}`),
    datasets: [{
      data: trials.length > 0 ? trials.slice(-5).map(t => t.net_score) : [0]
    }]
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={[styles.title, { color: colors.text }]}>Net Gelişimi</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
             <Plus color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <View style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {trials.length > 0 ? (
                <BarChart
                  data={chartData}
                  width={screenWidth - 60}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundGradientFrom: colors.card,
                    backgroundGradientTo: colors.card,
                    color: (opacity = 1) => `rgba(76, 139, 245, ${opacity})`,
                    strokeWidth: 2,
                    barPercentage: 0.7,
                    decimalPlaces: 1,
                    labelColor: (opacity = 1) => colors.subtext,
                  }}
                  verticalLabelRotation={0}
                  fromZero
                  showValuesOnTopOfBars
                />
              ) : (
                <Text style={{ color: colors.subtext, padding: 20 }}>Henüz veri yok.</Text>
              )}
            </View>

            <Text style={[styles.subTitle, { color: colors.text }]}>Son Denemeler</Text>
            
            {[...trials].reverse().map((item) => (
              <View key={item.id} style={[styles.trialCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.trialName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.trialDate, { color: colors.subtext }]}>
                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View style={styles.netBadge}>
                  <Text style={styles.netText}>{item.net_score} Net</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Deneme Ekle</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Deneme Adı (Örn: 3D TYT-1)"
            placeholderTextColor={colors.subtext}
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Net Sayısı (Örn: 72.5)"
            placeholderTextColor={colors.subtext}
            keyboardType="numeric"
            value={netScore}
            onChangeText={setNetScore}
          />

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={addTrial}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: 'Lexend_700Bold',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    overflow: 'hidden'
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
    marginBottom: 12,
  },
  trialCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  trialName: {
    fontSize: 14,
    fontFamily: 'Lexend_600SemiBold',
    marginBottom: 4,
  },
  trialDate: {
    fontSize: 12,
    fontFamily: 'Lexend_400Regular',
  },
  netBadge: {
    backgroundColor: 'rgba(76, 139, 245, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  netText: {
    color: '#4c8bf5',
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontFamily: 'Lexend_700Bold' },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
  },
  saveButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Lexend_600SemiBold' },
});
