import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export function SectionHeader({ title, onViewAll, showViewAll = true }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Xem tất cả →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  viewAll: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
});
