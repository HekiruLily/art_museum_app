import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Platform } from 'react-native';

type Props = {
  item: any;
  onPressArtwork?: () => void;
  onPressArtist?: () => void;
};

export function SearchResultCard({ item, onPressArtwork, onPressArtist }: Props) {
  const [hovered, setHovered] = useState(false);
  const tint = '#8B5CF6'; // Purple color to match the app theme

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPressArtwork}
        style={({ pressed }) => [pressed && styles.pressed]}
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
            {item.artistDisplayName ? (
              <Pressable onPress={onPressArtist}>
                <Text style={[styles.artist, { color: tint }]}>{item.artistDisplayName}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
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
});
