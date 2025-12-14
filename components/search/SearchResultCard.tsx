import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  item: any;
  onPress?: () => void;
};

export function SearchResultCard({ item, onPress }: Props) {
  const [hovered, setHovered] = useState(false);
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const tint = Colors[colorScheme ?? 'light'].tint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <View style={[styles.card, hovered ? [styles.cardHover, { borderColor: tint }] : null]}>
        {item.primaryImageSmall ? (
          <Image source={{ uri: item.primaryImageSmall }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: '#888' }}>No image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text numberOfLines={2} style={[styles.title]}>{item.title}</Text>
          {item.artistDisplayName ? <Text style={[styles.artist, { color: tint }]}>{item.artistDisplayName}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '48%', marginBottom: 12 },
  pressed: { opacity: Platform.OS === 'ios' ? 0.7 : 1 },
  card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
  cardHover: { transform: [{ translateY: -4 }], elevation: 8, shadowOpacity: 0.18, zIndex: 5, borderWidth: 2 },
  image: { width: '100%', height: 140 },
  info: { padding: 12, backgroundColor: '#fff' },
  title: { fontWeight: '700', fontSize: 14, marginBottom: 4, color: '#000' },
  artist: { fontSize: 12 },
  hoverOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
});
