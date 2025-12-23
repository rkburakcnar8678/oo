import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResetPassword() {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi giriniz.');
      return;
    }

    setLoading(true);
    // Supabase şifre sıfırlama işlemi
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://pwecgolszxkxzahthgpz.supabase.co/auth/v1/callback',
    });

    setLoading(false);

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      Alert.alert(
        'E-posta Gönderildi',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        [{ text: 'Tamam', onPress: () => router.back() }]
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Üst Bar / Geri Butonu */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {/* Görsel Alanı */}
          <View style={styles.imageContainer}>
            {/* Tasarımdaki kilit/kitap konseptine uygun 3D bir görsel */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=800&auto=format&fit=crop' }} 
              style={styles.image}
              resizeMode="cover"
            />
            {/* Not: Gerçek projede buraya tam olarak tasarımdaki görseli 'assets' klasöründen import ederek koymalısın. */}
          </View>

          {/* Başlık ve Açıklama */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Şifreni mi Unuttun?</Text>
            <Text style={styles.subtitle}>
              Endişelenme, hesabını kurtarmana yardımcı olacağız. Lütfen kayıtlı e-posta adresini veya telefon numaranı gir.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>E-posta veya Telefon</Text>
            <View style={styles.inputContainer}>
              <Mail color="#6B7280" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="örn. ogrenci@mail.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Bağlantı Gönder</Text>
                  <ArrowRight color="#fff" size={20} style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Alt Linkler */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
              <ArrowLeft color="#9CA3AF" size={16} style={{ marginRight: 8 }} />
              <Text style={styles.backLinkText}>Giriş ekranına dön</Text>
            </TouchableOpacity>

            <View style={styles.supportContainer}>
              <Text style={styles.supportText}>Hala sorun mu yaşıyorsun? </Text>
              <TouchableOpacity>
                <Text style={styles.supportLink}>Destek ekibiyle iletişime geç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1020',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    // backgroundColor: '#1E2032', // Tasarımda şeffaf görünüyor, gerekirse açabiliriz
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: '#1E2032',
    borderWidth: 1,
    borderColor: '#2D3045',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.8, // Görselin çok parlak olmaması için
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Lexend_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 12,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161726',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#2D3045',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    height: '100%',
  },
  button: {
    backgroundColor: '#4c8bf5',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4c8bf5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
  footer: {
    marginTop: 'auto', // En alta itmek için
    alignItems: 'center',
    gap: 32,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backLinkText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Lexend_500Medium',
  },
  supportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  supportText: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'Lexend_400Regular',
  },
  supportLink: {
    color: '#4c8bf5',
    fontSize: 13,
    fontFamily: 'Lexend_500Medium',
    textDecorationLine: 'underline',
  },
});
