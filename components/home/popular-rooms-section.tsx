import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SectionHeader } from '@/components/ui/section-header';
import { RoomCard } from '@/components/home/room-card';
import { Room } from '@/models/types';

interface PopularRoomsSectionProps {
  rooms: Room[];
  loading?: boolean;
  onRoomPress?: (room: Room) => void;
  onViewAll?: () => void;
}

export function PopularRoomsSection({ 
  rooms, 
  loading = false,
  onRoomPress, 
  onViewAll 
}: PopularRoomsSectionProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Phòng ban phổ biến" onViewAll={onViewAll} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Đang tải phòng ban...</Text>
        </View>
      ) : rooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có dữ liệu phòng ban</Text>
        </View>
      ) : (
        rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onPress={() => onRoomPress?.(room)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
