import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '@/models/types';

interface ArtistCardProps {
  artist: Artist;
  onPress?: () => void;
}

export function ArtistCard({ artist, onPress }: ArtistCardProps) {
  const initials = artist.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: artist.color }]}>
        {artist.primaryImage ? (
          <Image 
            source={{ uri: artist.primaryImage }} 
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.initials}>{initials}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={styles.count}>{artist.artworkCount} tác phẩm</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  initials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: '#666',
  },
});
