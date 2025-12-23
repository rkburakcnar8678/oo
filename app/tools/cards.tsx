import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CardsScreen() {
  const { colors } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const rotate = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
    };
  });

  const handleFlip = () => {
    if (isFlipped) {
      rotate.value = withTiming(0, { duration: 500 });
    } else {
      rotate.value = withTiming(180, { duration: 500 });
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Bilgi Kartı</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>Kartın üzerine dokunarak çevir.</Text>

      <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, { backgroundColor: colors.primary }]}>
          <Text style={styles.cardText}>Cumhuriyet ne zaman ilan edildi?</Text>
          <Text style={styles.tapText}>Cevabı gör ↻</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: '#10B981' }]}>
          <Text style={styles.cardText}>29 Ekim 1923</Text>
          <Text style={styles.tapText}>Soruya dön ↻</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontFamily: 'Lexend_700Bold', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'Lexend_400Regular', marginBottom: 40 },
  cardContainer: {
    width: width - 60,
    height: 300,
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardFront: { zIndex: 2 },
  cardBack: { zIndex: 1 },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Lexend_700Bold',
    textAlign: 'center',
  },
  tapText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Lexend_500Medium',
    marginTop: 20,
  },
});
