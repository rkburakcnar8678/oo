import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { Trash2, Undo, Image as ImageIcon, Download } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function DrawingScreen() {
  const { colors } = useTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [bgImage, setBgImage] = useState<string | null>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M${locationX},${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => `${prev} L${locationX},${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths([...paths, currentPath]);
        setCurrentPath('');
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    setBgImage(null);
  };

  const undo = () => {
    setPaths(paths.slice(0, -1));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setBgImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={styles.toolbar}>
        <Text style={styles.title}>Çizim Alanı</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={pickImage}>
            <ImageIcon color="#333" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={undo}>
            <Undo color="#333" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCanvas}>
            <Trash2 color="#EF4444" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        {bgImage && (
          <Image source={{ uri: bgImage }} style={StyleSheet.absoluteFill} resizeMode="contain" />
        )}
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Svg height="100%" width="100%">
            {paths.map((d, index) => (
              <Path
                key={index}
                d={d}
                stroke="#EF4444"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath ? (
              <Path
                d={currentPath}
                stroke="#EF4444"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    height: 60,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10,
  },
  title: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
    color: '#333',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
  canvas: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
