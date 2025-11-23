import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { FavouriteItem } from '../../models/favourite/favourite';
import { MaterialIcons } from '@expo/vector-icons';

export function FavouriteCard({ item, onToggle }: { item: FavouriteItem; onToggle: (id: string) => void }) {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} contentFit="cover" />
      <Pressable style={styles.heart} onPress={() => onToggle(item.id)}>
        <View style={styles.heartInner}>
          <MaterialIcons name="favorite" size={18} color="#ff2d6f" />
        </View>
      </Pressable>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'visible',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: {
    padding: 10,
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
  },
  author: {
    color: '#9b4dff',
    fontSize: 12,
  },
  heart: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  heartInner: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
});
