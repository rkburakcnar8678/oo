import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert('Hata', error.message);
    setLoading(false);
  }

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Bilgi', `${provider} ile giriş özelliği henüz yapılandırılmadı.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <GraduationCap size={32} color="#4c8bf5" />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tekrar Hoş Geldin</Text>
          <Text style={styles.subtitle}>Hazırlık yolculuğuna devam et.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta Adresi"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff color="#9CA3AF" size={20} />
              ) : (
                <Eye color="#9CA3AF" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.forgotPasswordContainer}>
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya şununla devam et</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
          >
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }} 
              style={styles.socialIcon} 
              resizeMode="contain"
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Apple')}
          >
             <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/172px-Apple_logo_white.svg.png' }} 
              style={styles.socialIcon} 
              resizeMode="contain"
            />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabın yok mu? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Kayıt Ol</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1020',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    backgroundColor: '#1E2032',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3045',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Lexend_700Bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161726',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#2D3045',
  },
  inputIcon: {
    marginRight: 14,
  },
  eyeIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    height: '100%',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 4,
  },
  forgotPasswordText: {
    color: '#4c8bf5',
    fontSize: 14,
    fontFamily: 'Lexend_600SemiBold',
  },
  button: {
    backgroundColor: '#4c8bf5',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4c8bf5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 36,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D3045',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lexend_400Regular',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3045',
    backgroundColor: '#161726',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_500Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#9CA3AF',
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
  },
  link: {
    color: '#4c8bf5',
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 14,
  },
});
