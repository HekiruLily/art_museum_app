import React from 'react';
import { View, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onOpenFilters: () => void;
};

export function SearchBar({ value, onChange, onSearch, onOpenFilters }: Props) {
  const tint = '#8B5CF6'; // Purple color to match the app theme
  
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <MaterialIcons name="search" size={20} color="#666" style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Tìm kiếm tác phẩm, nghệ sĩ, chủ đề..."
          value={value}
          onChangeText={onChange}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
      </View>

      <Pressable
        onPress={onOpenFilters}
        style={({ pressed }) => [styles.filter, { backgroundColor: tint }, pressed && (Platform.OS === 'ios' ? styles.pressed : null)]}
        android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
      >
        <MaterialIcons name="filter-list" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center', marginTop: 12 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 8, paddingVertical: 4 },
  input: { flex: 1, paddingVertical: 10, paddingRight: 12 },
  filter: { marginLeft: 10, backgroundColor: '#674b96', padding: 10, borderRadius: 8 },
  pressed: { opacity: 0.75 },
});
