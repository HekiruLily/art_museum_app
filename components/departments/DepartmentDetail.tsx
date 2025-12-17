import { getDepartmentMockData } from '@/constants/departmentsMock';
import { fetchMultipleObjectDetails, fetchObjectsByDepartment } from '@/services/metMuseumApi';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface Artwork {
  objectID: number;
  title: string;
  primaryImageSmall?: string;
  artistDisplayName?: string;
  objectDate?: string;
  isPublicDomain?: boolean;
}

export default function DepartmentDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse departmentId từ route params
  const departmentId = params.id 
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : 1;

  console.log('DepartmentDetail - params:', params);
  console.log('DepartmentDetail - departmentId:', departmentId);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const mockData = getDepartmentMockData(departmentId);

  console.log('DepartmentDetail - mockData:', mockData);

  useEffect(() => {
    loadDepartmentDetails();
  }, [departmentId]);

  const loadDepartmentDetails = async () => {
    setLoading(true);
    try {
      console.log('Loading department details for ID:', departmentId);
      
      // Lấy danh sách Object IDs (tối đa 50 tác phẩm để hiển thị)
      const objectIds = await fetchObjectsByDepartment(departmentId, 50);
      console.log('Fetched object IDs:', objectIds.length);

      if (objectIds.length === 0) {
        console.log('No objects found for department:', departmentId);
        setArtworks([]);
        setLoading(false);
        return;
      }

      // Lấy chi tiết từng tác phẩm
      const details = await fetchMultipleObjectDetails(objectIds);
      console.log('Fetched details for artworks:', details.length);

      // Lọc chỉ những tác phẩm có hình ảnh và công khai
      const validArtworks = details.filter(
        (art) => art && art.primaryImageSmall && art.isPublicDomain
      );

      console.log('Valid artworks after filtering:', validArtworks.length);
      setArtworks(validArtworks.slice(0, 50));
    } catch (error) {
      console.error('Failed to load department details:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
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
      <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Chi tiết phòng ban</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1, marginTop: 12 }}>
        {/* Hero Image */}
        {mockData.image && (
          <View style={{ height: 200, width: '100%' }}>
            <Image
              source={{ uri: mockData.image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        )}

      {/* Department Info Card */}
      <View style={{ backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 12 }}>
          {mockData.description ? mockData.description.split(' ').slice(0, 3).join(' ') : 'Department'}
        </Text>

        {/* Info Row */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#E8F5E9',
              borderRadius: 8,
              padding: 12,
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Số tác phẩm</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#2E7D32' }}>
              {artworks.length > 0 ? artworks.length : '0'}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: '#E3F2FD',
              borderRadius: 8,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Tầng</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1976D2' }}>
              {mockData.floor}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 16 }}>
          {mockData.description}
        </Text>

        {/* Curator */}
        <View
          style={{
            backgroundColor: '#F3E5F5',
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#9C27B0',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
              {mockData.curator.split(' ')[0][0]}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#999' }}>Giám đốc phòng</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
              {mockData.curator}
            </Text>
          </View>
        </View>

        {/* Artworks Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 }}>
            Tác phẩm trong phòng ban
          </Text>

        {artworks.length === 0 ? (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#999' }}>Không có tác phẩm nào</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {artworks.map((art) => (
              <TouchableOpacity
                key={art.objectID}
                onPress={() =>
                  router.push({
                    pathname: '/artwork/[id]',
                    params: { id: art.objectID },
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
                  {art.primaryImageSmall ? (
                    <Image
                      source={{ uri: art.primaryImageSmall }}
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
                    {art.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#999',
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {art.artistDisplayName || 'Unknown Artist'}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#999' }}>
                    {art.objectDate || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
