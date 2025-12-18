import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface Artwork {
  objectID: number;
  title: string;
  primaryImageSmall?: string;
  artistDisplayName?: string;
  objectDate?: string;
  isPublicDomain?: boolean;
}

interface Department {
  departmentId: number;
  displayName: string;
}

interface DepartmentMetadata {
  floor: string;
  description: string;
  curator: string;
}

// Mock data for department metadata
const getDepartmentMetadata = (departmentId: number): DepartmentMetadata => {
  const metadata: Record<number, DepartmentMetadata> = {
    1: { floor: '1', description: 'Khám phá nghệ thuật trang trí Mỹ từ thế kỷ 17 đến đầu thế kỷ 20, từ đồ nội thất đến đồ gốm sứ tinh xảo.', curator: 'Dr. Elizabeth Thompson' },
    3: { floor: '2', description: 'Tìm hiểu nghệ thuật cổ đại Cận Đông với hơn 7,000 năm lịch sử, từ Mesopotamia đến Ba Tư.', curator: 'Dr. Ahmed Hassan' },
    4: { floor: '1', description: 'Bộ sưu tập vũ khí và áo giáp từ châu Âu, châu Á và Trung Đông, thể hiện nghệ thuật quân sự qua các thời kỳ.', curator: 'Dr. James Morrison' },
    5: { floor: '2', description: 'Nghệ thuật từ châu Phi, châu Đại Dương và châu Mỹ, thể hiện sự đa dạng văn hóa phong phú của các nền văn minh.', curator: 'Dr. Aisha Okonkwo' },
    6: { floor: '2', description: 'Nghệ thuật châu Á trải dài hơn 5,000 năm lịch sử văn hóa, từ Trung Quốc, Nhật Bản đến Đông Nam Á.', curator: 'Dr. Chen Wei' },
    7: { floor: '1', description: 'Nghệ thuật và kiến trúc thời Trung Cổ châu Âu, bao gồm các tác phẩm tôn giáo và thế tục từ thế kỷ 4 đến 16.', curator: 'Dr. Marie Laurent' },
    8: { floor: 'B1', description: 'Bộ sưu tập trang phục và thời trang từ thế kỷ 15 đến nay, thể hiện sự phát triển của phong cách qua các thời đại.', curator: 'Dr. Isabella Romano' },
    9: { floor: '2', description: 'Hơn 17,000 bản vẽ và bản in từ các nghệ sĩ nổi tiếng như Rembrandt, Dürer và Picasso.', curator: 'Dr. Robert Fischer' },
    10: { floor: '1', description: 'Nghệ thuật Ai Cập cổ đại với hơn 26,000 tác phẩm, từ xác ướp đến đồ trang sức và điêu khắc.', curator: 'Dr. Sarah Mitchell' },
    11: { floor: '2', description: 'Hội họa châu Âu từ thế kỷ 13 đến đầu thế kỷ 20, bao gồm các tác phẩm của Van Gogh, Monet và Vermeer.', curator: 'Dr. Philippe Dubois' },
    12: { floor: '1', description: 'Điêu khắc và nghệ thuật trang trí châu Âu từ thời Phục Hưng đến thế kỷ 20, với các tác phẩm tinh xảo.', curator: 'Dr. Giovanni Russo' },
    13: { floor: '1', description: 'Nghệ thuật Hy Lạp và La Mã cổ đại, từ điêu khắc đại lý đến đồ gốm và trang sức.', curator: 'Dr. Helena Papadopoulos' },
    14: { floor: '2', description: 'Nghệ thuật Hồi giáo từ Tây Ban Nha đến Ấn Độ, thể hiện vẻ đẹp của thư pháp và họa tiết hình học.', curator: 'Dr. Fatima Al-Rashid' },
    15: { floor: '1', description: 'Bộ sưu tập Robert Lehman với các tác phẩm châu Âu từ thời Phục Hưng đến thế kỷ 20.', curator: 'Dr. David Lehman' },
    16: { floor: '3', description: 'Thư viện nghệ thuật với hơn 900,000 tài liệu, sách và tư liệu nghiên cứu về nghệ thuật.', curator: 'Dr. Margaret Collins' },
    17: { floor: '1', description: 'Nghệ thuật thời Trung Cổ châu Âu và Byzantine, với các tác phẩm tôn giáo và biểu tượng thiêng liêng.', curator: 'Dr. Andreas Müller' },
    18: { floor: '2', description: 'Nhạc cụ từ khắp nơi trên thế giới, từ piano cổ điển đến nhạc cụ dân gian châu Á.', curator: 'Dr. Michael Bennett' },
    19: { floor: '2', description: 'Nhiếp ảnh từ những ngày đầu đến hiện đại, ghi lại lịch sử và nghệ thuật qua ống kính.', curator: 'Dr. Emma Wilson' },
    21: { floor: '2', description: 'Nghệ thuật hiện đại và đương đại từ thế kỷ 20, bao gồm các trường phái từ Lập thể đến Trừu tượng.', curator: 'Dr. Marcus Johnson' },
  };
  return metadata[departmentId] || { floor: '1', description: 'Khám phá bộ sưu tập nghệ thuật độc đáo của phòng ban này.', curator: 'Dr. John Smith' };
};

export default function DepartmentDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse departmentId from route params
  const departmentId = params.id 
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : 1;

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [allObjectIds, setAllObjectIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [department, setDepartment] = useState<Department | null>(null);
  const [metadata] = useState<DepartmentMetadata>(getDepartmentMetadata(departmentId));
  const ARTWORKS_TO_LOAD = 5; // Number of valid artworks to display per load
  const MAX_ATTEMPTS = 20; // Max objects to try fetching to get the desired artworks

  useEffect(() => {
    loadDepartmentInfo();
    loadDepartmentObjectIds();
  }, [departmentId]);

  const loadDepartmentInfo = async () => {
    try {
      const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
      
      if (!response.ok) {
        console.warn('Department info request failed:', response.status);
        return;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Department info response is not JSON');
        return;
      }
      
      const data = await response.json();
      const dept = data.departments.find((d: Department) => d.departmentId === departmentId);
      setDepartment(dept || null);
    } catch (error) {
      console.warn('Failed to load department info:', error);
    }
  };

  const loadDepartmentObjectIds = async () => {
    setLoading(true);
    try {
      console.log('Loading department object IDs for ID:', departmentId);
      
      // Add initial delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Fetch object IDs for department
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`
      );
      
      if (!response.ok) {
        console.warn('Object IDs request failed:', response.status);
        setArtworks([]);
        setLoading(false);
        return;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Object IDs response is not JSON');
        setArtworks([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.objectIDs && data.objectIDs.length > 0) {
        console.log('Total objects found:', data.objectIDs.length);
        setAllObjectIds(data.objectIDs);
        // Load first page
        await loadArtworksPage(data.objectIDs, 0);
      } else {
        console.log('No objects found for department:', departmentId);
        setArtworks([]);
      }
    } catch (error) {
      console.warn('Failed to load department object IDs:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadArtworksPage = async (objectIds: number[], startIndex: number) => {
    if (startIndex >= objectIds.length) {
      return;
    }

    try {
      // Fetch until we get enough valid artworks or reach max attempts
      const validArtworks: Artwork[] = [];
      let currentIdx = startIndex;
      let attempts = 0;
      
      while (validArtworks.length < ARTWORKS_TO_LOAD && attempts < MAX_ATTEMPTS && currentIdx < objectIds.length) {
        const id = objectIds[currentIdx];
        attempts++;
        currentIdx++;
        
        try {
          // Add delay between requests (500ms) to respect API rate limits  
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          );
          
          // Check if response is OK and is JSON
          if (!response.ok) {
            if (response.status === 403) {
              // If we hit rate limit, wait longer before continuing
              console.warn(`Rate limited, waiting 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            continue;
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            continue;
          }
          
          const artwork = await response.json();
          
          // Only add if has image and is public domain
          if (artwork.primaryImageSmall && artwork.isPublicDomain) {
            validArtworks.push(artwork);
          }
        } catch (error) {
          // Silently continue to next artwork
          continue;
        }
      }

      if (validArtworks.length > 0) {
        setArtworks((prev) => [...prev, ...validArtworks]);
      }
      setCurrentIndex(currentIdx);
    } catch (error) {
      console.error('Failed to load artworks page:', error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || currentIndex >= allObjectIds.length) {
      return;
    }

    setLoadingMore(true);
    await loadArtworksPage(allObjectIds, currentIndex);
    setLoadingMore(false);
  };

  const renderArtworkItem = ({ item }: { item: Artwork }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/artwork-detail',
          params: { artworkId: item.objectID },
        })
      }
      style={{
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Artwork Image */}
      <View style={{ height: 150, backgroundColor: '#f0f0f0' }}>
        {item.primaryImageSmall ? (
          <Image
            source={{ uri: item.primaryImageSmall }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e8e8e8',
            }}
          >
            <Text style={{ color: '#999', fontSize: 12 }}>No Image</Text>
          </View>
        )}
      </View>

      {/* Artwork Info */}
      <View style={{ padding: 8 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#333',
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: '#999',
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {item.artistDisplayName || 'Unknown Artist'}
        </Text>
        <Text style={{ fontSize: 10, color: '#999' }}>
          {item.objectDate || 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#7c3aed" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" translucent={false} />

      {/* Header */}
      <View style={{ backgroundColor: '#14B8A6', paddingHorizontal: 16, paddingVertical: 14, paddingTop: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Chi tiết phòng ban</Text>
      </View>

      <FlatList
        data={artworks}
        renderItem={renderArtworkItem}
        keyExtractor={(item) => item.objectID.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={
          <>
            {/* Hero Image */}
            <View style={{ height: 200, width: '100%' }}>
              <Image
                source={require('@/assets/images/museum-main.jpg')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>

            {/* Department Info Card */}
            <View style={{ backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 16 }}>
                {department?.displayName || 'Department'}
              </Text>

              {/* Info Row */}
              <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#D1FAE5',
                    borderRadius: 16,
                    padding: 16,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <MaterialIcons name="image" size={20} color="#059669" style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 14, color: '#047857', fontWeight: '600' }}>
                      {allObjectIds.length} tác phẩm
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#DBEAFE',
                    borderRadius: 16,
                    padding: 16,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <MaterialIcons name="layers" size={20} color="#2563EB" style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 14, color: '#1D4ED8', fontWeight: '600' }}>
                      Tầng {metadata.floor}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 22, marginBottom: 16 }}>
                {metadata.description}
              </Text>

              {/* Curator */}
              <View
                style={{
                  backgroundColor: '#FAF5FF',
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#A855F7',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialIcons name="person" size={28} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Giám tuyển</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
                    {metadata.curator}
                  </Text>
                </View>
              </View>
            </View>

            {/* Artworks Section Header */}
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                Tác phẩm trong phòng ban
              </Text>
            </View>
          </>
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
