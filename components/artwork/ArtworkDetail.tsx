import { fetchObjectDetail } from '@/services/metMuseumApi';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface Artwork {
  objectID: number;
  title: string;
  primaryImage?: string;
  primaryImageSmall?: string;
  artistDisplayName?: string;
  artistDisplayBio?: string;
  objectDate?: string;
  medium?: string;
  dimensions?: string;
  creditLine?: string;
  culture?: string;
  period?: string;
  department?: string;
  isPublicDomain?: boolean;
  objectURL?: string;
  isHighlight?: boolean;
}

export default function ArtworkDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse artworkId từ route params
  const artworkId = params.id
    ? parseInt(Array.isArray(params.id) ? params.id[0] : params.id, 10)
    : 1;

  console.log('ArtworkDetail - params:', params);
  console.log('ArtworkDetail - artworkId:', artworkId);

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtworkDetail();
  }, [artworkId]);

  const loadArtworkDetail = async () => {
    setLoading(true);
    try {
      console.log('Loading artwork details for ID:', artworkId);
      const details = await fetchObjectDetail(artworkId);
      console.log('Fetched artwork:', details?.title);
      setArtwork(details || null);
    } catch (error) {
      console.error('Failed to load artwork details:', error);
      setArtwork(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading artwork...</Text>
      </View>
    );
  }

  if (!artwork) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <StatusBar barStyle="light-content" backgroundColor="#7c3aed" translucent={false} />
        <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Chi tiết tác phẩm</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="favorite-border" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>Không thể tải thông tin tác phẩm</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" translucent={false} />
      
      {/* Header */}
      <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 }} numberOfLines={1}>
            Chi tiết tác phẩm
          </Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1, marginTop: 12 }}>
        {/* Primary Image */}
        {(artwork.primaryImage || artwork.primaryImageSmall) && (
          <View style={{ height: 300, width: '100%', backgroundColor: '#f0f0f0' }}>
            <Image
              source={{ uri: artwork.primaryImage || artwork.primaryImageSmall }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Artwork Info Card */}
        <View style={{ backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 }}>
          {/* Title */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 12 }}>
          {artwork.title}
        </Text>

        {/* Highlight Badge */}
        {artwork.isHighlight && (
          <View
            style={{
              backgroundColor: '#FFC107',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              marginBottom: 12,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }}>⭐ Highlight</Text>
          </View>
        )}

        {/* Artist */}
        {artwork.artistDisplayName && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Tác giả</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
              {artwork.artistDisplayName}
            </Text>
            {artwork.artistDisplayBio && (
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {artwork.artistDisplayBio}
              </Text>
            )}
          </View>
        )}

        {/* Date */}
        {artwork.objectDate && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Thời gian</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.objectDate}</Text>
          </View>
        )}

        {/* Medium */}
        {artwork.medium && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Chất liệu</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.medium}</Text>
          </View>
        )}

        {/* Dimensions */}
        {artwork.dimensions && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Kích thước</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.dimensions}</Text>
          </View>
        )}

        {/* Department */}
        {artwork.department && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Phòng ban</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.department}</Text>
          </View>
        )}

        {/* Period */}
        {artwork.period && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Thời kỳ</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.period}</Text>
          </View>
        )}

        {/* Culture */}
        {artwork.culture && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Văn hóa</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{artwork.culture}</Text>
          </View>
        )}

        {/* Credit Line */}
        {artwork.creditLine && (
          <View
            style={{
              backgroundColor: '#F3E5F5',
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: '#666' }}>{artwork.creditLine}</Text>
          </View>
        )}

        {/* Public Domain */}
        {artwork.isPublicDomain && (
          <View
            style={{
              backgroundColor: '#E8F5E9',
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#2E7D32' }}>
              ✓ Công khai - Có thể sử dụng tự do
            </Text>
          </View>
        )}

        {/* View on Museum */}
        {artwork.objectURL && (
          <TouchableOpacity
            style={{
              backgroundColor: '#2E7D32',
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
              alignItems: 'center',
            }}
            onPress={() => {
              // Có thể dùng Linking.openURL nếu cần
              console.log('Open URL:', artwork.objectURL);
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
              Xem trên Museum
            </Text>
          </TouchableOpacity>
        )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
