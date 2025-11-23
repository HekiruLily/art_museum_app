import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FavouriteCard } from '@/components/favourite/FavouriteCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavouritesScreen() {
  const router = useRouter();
  const { items: favourites, remove } = useFavorites();

  const onExplore = () => {
    router.push('/explore');
  };

  const onToggle = (id: string) => {
    // FavouriteCard calls onToggle with id only; remove by id
    remove(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Yêu thích</Text>
      </View>

      {favourites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.heartCircle}>
            <MaterialIcons name="favorite" size={42} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có tác phẩm yêu thích</Text>
          <Text style={styles.emptySubtitle}>Hãy khám phá và thêm tác phẩm vào danh sách yêu thích của bạn</Text>
          <Pressable style={styles.exploreButton} onPress={onExplore}>
            <View style={styles.exploreInner}>
              <MaterialIcons name="collections" size={18} color="#fff" />
              <Text style={styles.exploreText}>  Khám phá tác phẩm</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <FavouriteCard item={item} onToggle={onToggle} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 80,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e3cff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  back: {
    position: 'absolute',
    left: 12,
    top: 38,
  },
  headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  heartCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ff7fb3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { color: '#7a7a7a', marginBottom: 18, textAlign: 'center', paddingHorizontal: 40 },
  exploreButton: { marginTop: 8 },
  exploreInner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
  },
  exploreText: { color: '#fff', fontWeight: '700' },
  list: { padding: 12, paddingTop: 18 },
});
