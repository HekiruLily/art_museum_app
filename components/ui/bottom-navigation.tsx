import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BottomNavProps {
  activeTab?: 'home' | 'artworks' | 'search' | 'favorites';
  onTabPress?: (tab: 'home' | 'artworks' | 'search' | 'favorites') => void;
}

export function BottomNavigation({ activeTab = 'home', onTabPress }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: 'home', label: 'Trang chủ' },
    { id: 'artworks' as const, icon: 'grid', label: 'Tác phẩm' },
    { id: 'search' as const, icon: 'search', label: 'Tìm kiếm' },
    { id: 'favorites' as const, icon: 'heart', label: 'Yêu thích' },
  ];

  const handleTabPress = (tab: 'home' | 'artworks' | 'search' | 'favorites') => {
    if (tab === 'home') {
      router.replace('/(tabs)/');
    }
    onTabPress?.(tab);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
          >
            <Ionicons
              name={isActive ? tab.icon : `${tab.icon}-outline` as any}
              size={24}
              color={isActive ? '#8B5CF6' : '#9CA3AF'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});
