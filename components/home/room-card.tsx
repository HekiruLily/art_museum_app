import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '@/models/types';

interface RoomCardProps {
  room: Room;
  onPress?: () => void;
}

export function RoomCard({ room, onPress }: RoomCardProps) {
  const defaultIcon = 'business';
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: room.color }]}>
        <Ionicons name={(room.icon || defaultIcon) as any} size={24} color="#FFF" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {room.name}
        </Text>
        <Text style={styles.count}>{room.artworkCount} tác phẩm</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  count: {
    fontSize: 13,
    color: '#666',
  },
});
