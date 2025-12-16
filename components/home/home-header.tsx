import React from 'react';
import { Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from '@/components/ui/search-bar';

interface HomeHeaderProps {
  onSearch?: (text: string) => void;
}

export function HomeHeader({ onSearch }: HomeHeaderProps) {
  return (
    <ImageBackground
      source={require('@/assets/images/museum-main.jpg')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
      >
        <Text style={styles.title}>Bảo Tàng Mỹ Thuật</Text>
        <Text style={styles.subtitle}>Khám phá nghệ thuật thế giới</Text>
        <SearchBar placeholder="Tìm tác phẩm, nghệ sĩ..." onChangeText={onSearch} />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
