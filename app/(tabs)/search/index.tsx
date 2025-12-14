import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from '@/components/search/SearchBar';
import SearchFiltersContent from '@/components/search/SearchFiltersContent';
import { SearchResultCard } from '@/components/search/SearchResultCard';
import { useSearch } from '@/hooks/search/useSearch';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const router = useRouter();
  const s = useSearch();
  const [showFilters, setShowFilters] = React.useState(false);
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const tint = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.container}>

      {/* HEADER GRADIENT */}
      <LinearGradient
        colors={['#0a7ea4', '#8e3cff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </LinearGradient>

      <SearchBar
        value={s.query}
        onChange={s.setQuery}
        onSearch={s.applySearch}
        onOpenFilters={() => setShowFilters(true)}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
        transparent
      >
        <View style={styles.filterBackdrop}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeaderRow}>
              <Text style={styles.filterTitle}>Bộ lọc</Text>

              <Pressable onPress={() => setShowFilters(false)} style={{ padding: 6 }}>
                <MaterialIcons name="close" size={22} color="#333" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-evenly', paddingVertical: 8, paddingBottom: 50 }}>
              <SearchFiltersContent
                departments={s.departments}
                selected={s.selectedDepartments}
                toggleDept={s.toggleDepartment}
                selectedLocations={s.selectedLocations}
                toggleLocation={s.toggleLocation}
                selectedThemes={s.selectedThemes}
                toggleTheme={s.toggleTheme}
                clearFilters={s.clearFilters}
                hideActions
                availableThemes={s.availableThemes}
                availableLocations={s.availableLocations}
              />
            </ScrollView>

            <View style={styles.filterFooter}>
              <Pressable onPress={() => { s.clearFilters(); }} style={styles.filterClearBtn}>
                <Text style={{ color: tint, fontWeight: '700' }}>Xóa bộ lọc</Text>
              </Pressable>

              <Pressable
                onPress={() => { setShowFilters(false); s.applySearch(); }}
                style={[styles.filterApplyBtn, { backgroundColor: tint }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Áp dụng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ paddingHorizontal: 12, paddingTop: 12, flex: 1 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Kết quả</Text>

        <FlatList
          data={s.results}
          keyExtractor={(i) => String(i.objectID)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <SearchResultCard item={item} />}
          ListEmptyComponent={() => (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>{s.loading ? 'Đang tìm...' : 'Không có kết quả'}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36
  },

  back: {
    position: 'absolute',
    left: 12,
    top: 38,
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 30,
    textAlign: 'center',
  },

  filterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },

  filterSheet: {
    backgroundColor: '#f7fbff',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '85%',
  },

  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterTitle: { fontSize: 18, fontWeight: '700' },

  filterFooter: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterClearBtn: { paddingVertical: 10, paddingHorizontal: 16 },

  filterApplyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
