import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
}

export function CategoryButton({ icon, label, color, onPress }: CategoryButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#FFF" />
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
