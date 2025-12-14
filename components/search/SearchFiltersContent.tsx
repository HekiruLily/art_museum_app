import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Department } from '@/models/search/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  departments: Department[];
  selected: number[];
  toggleDept: (id: number) => void;
  availableThemes?: string[];
  availableLocations?: string[];
  selectedLocations?: string[];
  toggleLocation?: (loc: string) => void;
  selectedThemes?: string[];
  toggleTheme?: (t: string) => void;
  clearFilters?: () => void;
  applySearch?: () => void;
  hideActions?: boolean;
};

export default function SearchFiltersContent({
  departments,
  selected,
  toggleDept,
  availableThemes,
  availableLocations,
  selectedLocations = [],
  toggleLocation,
  selectedThemes = [],
  toggleTheme,
  clearFilters,
  applySearch,
  hideActions = false,
}: Props) {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const tint = Colors[colorScheme ?? 'light'].tint;

  const themes = availableThemes && availableThemes.length ? availableThemes : [];
  const locations = availableLocations && availableLocations.length ? availableLocations : [];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Khám phá theo chủ đề</Text>
        <View style={{ marginTop: 8 }}>
          <FlatList
            data={themes}
            keyExtractor={(t) => t}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 12 }}
            renderItem={({ item: t }) => {
              const sel = selectedThemes.includes(t);
              return (
                <Pressable
                  onPress={() => toggleTheme && toggleTheme(t)}
                  style={[styles.deptPill, sel ? { backgroundColor: tint } : null]}
                >
                  <Text style={{ color: sel ? '#fff' : '#333' }}>{t}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Khám phá theo vùng miền</Text>
        <View style={{ marginTop: 8 }}>
          <FlatList
            data={locations}
            keyExtractor={(l) => l}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 12 }}
            renderItem={({ item: loc }) => {
              const sel = selectedLocations.includes(loc);
              return (
                <Pressable
                  onPress={() => toggleLocation && toggleLocation(loc)}
                  style={[styles.deptPill, sel ? { backgroundColor: tint } : null]}
                >
                  <Text style={{ color: sel ? '#fff' : '#333' }}>{loc}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Khám phá theo phòng ban</Text>
        <View style={{ marginTop: 8 }}>
          <FlatList
            data={departments}
            keyExtractor={(d) => String(d.departmentId)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const id = item.departmentId;
              const isSelected = selected.includes(id);
              return (
                <Pressable
                  onPress={() => toggleDept(id)}
                  style={[styles.deptPill, isSelected ? { backgroundColor: tint } : null]}
                >
                  <Text style={{ color: isSelected ? '#fff' : '#333' }}>{item.displayName}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>

      {!hideActions && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hành động</Text>
          <Pressable onPress={() => clearFilters && clearFilters()} style={styles.clearLink}>
            <Text style={{ color: tint }}>Xóa bộ lọc</Text>
          </Pressable>
          <Pressable onPress={() => applySearch && applySearch()} style={[styles.applyBtn, { backgroundColor: tint }] }>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Áp dụng</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  sectionTitle: { fontWeight: '700', marginBottom: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  clearLink: { marginTop: 8 },
  applyBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
});
