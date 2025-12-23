import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User } from 'lucide-react-native';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (!fullName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      // Supabase auto signs in if email confirmation is disabled, 
      // or we might need to tell user to check email.
      // Assuming auto sign-in or immediate session for this demo.
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hesap Oluştur 🚀</Text>
        <Text style={styles.subtitle}>Sınav yolculuğuna başlamak için hemen kayıt ol.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User color="#6B7280" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            placeholderTextColor="#6B7280"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail color="#6B7280" size={20} style={styles.inputIcon} />
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
          <Lock color="#6B7280" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={signUpWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Giriş Yap</Text>
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
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
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
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2032',
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
  },
  button: {
    backgroundColor: '#4c8bf5',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lexend_600SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#9CA3AF',
    fontFamily: 'Lexend_400Regular',
  },
  link: {
    color: '#4c8bf5',
    fontFamily: 'Lexend_600SemiBold',
  },
});
