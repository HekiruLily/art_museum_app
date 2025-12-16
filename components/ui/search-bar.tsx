import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export function SearchBar({ 
  placeholder = "Tìm tác phẩm, nghệ sĩ...", 
  onChangeText,
  value 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});
