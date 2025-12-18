import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Department {
  departmentId: number;
  displayName: string;
  artworkCount?: number;
  floor?: string;
  description?: string;
}

// Mock data for floor and descriptions
const getDepartmentMockData = (departmentId: number) => {
  const mockData: Record<number, { floor: string; description: string }> = {
    1: { floor: '1', description: 'Khám phá nghệ thuật trang trí Mỹ từ thế kỷ 17 đến đầu thế kỷ 20' },
    3: { floor: '2', description: 'Tìm hiểu nghệ thuật cổ đại Cận Đông với hơn 7,000 năm lịch sử' },
    4: { floor: '1', description: 'Bộ sưu tập vũ khí và áo giáp từ châu Âu, châu Á và Trung Đông' },
    5: { floor: '2', description: 'Nghệ thuật từ châu Phi, châu Đại Dương và châu Mỹ' },
    6: { floor: '2', description: 'Nghệ thuật châu Á trải dài hơn 5,000 năm lịch sử văn hóa' },
    7: { floor: '1', description: 'Nghệ thuật và kiến trúc thời Trung Cổ châu Âu' },
    8: { floor: 'B1', description: 'Bộ sưu tập trang phục và thời trang từ thế kỷ 15 đến nay' },
    9: { floor: '2', description: 'Hơn 17,000 bản vẽ và bản in từ các nghệ sĩ nổi tiếng' },
    10: { floor: '1', description: 'Nghệ thuật Ai Cập cổ đại với hơn 26,000 tác phẩm' },
    11: { floor: '2', description: 'Hội họa châu Âu từ thế kỷ 13 đến đầu thế kỷ 20' },
    12: { floor: '1', description: 'Điêu khắc và nghệ thuật trang trí châu Âu' },
    13: { floor: '1', description: 'Nghệ thuật Hy Lạp và La Mã cổ đại' },
    14: { floor: '2', description: 'Nghệ thuật Hồi giáo từ Tây Ban Nha đến Ấn Độ' },
    15: { floor: '1', description: 'Bộ sưu tập Robert Lehman với các tác phẩm châu Âu' },
    16: { floor: '3', description: 'Thư viện nghệ thuật với hơn 900,000 tài liệu' },
    17: { floor: '1', description: 'Nghệ thuật thời Trung Cổ châu Âu và Byzantine' },
    18: { floor: '2', description: 'Nhạc cụ từ khắp nơi trên thế giới' },
    19: { floor: '2', description: 'Nhiếp ảnh từ những ngày đầu đến hiện đại' },
    21: { floor: '2', description: 'Nghệ thuật hiện đại và đương đại từ thế kỷ 20' },
  };
  return mockData[departmentId] || { floor: '1', description: 'Khám phá bộ sưu tập nghệ thuật độc đáo' };
};

export default function DepartmentsListScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      // Add initial delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
      
      if (!response.ok) {
        console.warn('Departments request failed:', response.status);
        setLoading(false);
        return;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Departments response is not JSON');
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('DepartmentsList - Loaded departments:', data.departments.length);
      
      // Load artwork count for each department
      const departmentsWithCounts = await Promise.all(
        data.departments.map(async (dept: Department) => {
          const mockData = getDepartmentMockData(dept.departmentId);
          
          try {
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const objectsResponse = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${dept.departmentId}`
            );
            
            if (!objectsResponse.ok) {
              return {
                ...dept,
                artworkCount: 0,
                floor: mockData.floor,
                description: mockData.description,
              };
            }
            
            const contentType = objectsResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              return {
                ...dept,
                artworkCount: 0,
                floor: mockData.floor,
                description: mockData.description,
              };
            }
            
            const objectsData = await objectsResponse.json();
            
            return {
              ...dept,
              artworkCount: objectsData.total || 0,
              floor: mockData.floor,
              description: mockData.description,
            };
          } catch (error) {
            console.warn(`Failed to load count for dept ${dept.departmentId}`);
            return {
              ...dept,
              artworkCount: 0,
              floor: mockData.floor,
              description: mockData.description,
            };
          }
        })
      );
      
      setDepartments(departmentsWithCounts);
    } catch (error) {
      console.warn('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDepartmentItem = ({ item }: { item: Department }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Navigating to department:', item.departmentId);
          router.push(`/departments/${item.departmentId}`);
        }}
        style={{
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* Image */}
        <View style={{ height: 180, backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
          <Image
            source={require('@/assets/images/museum-main.jpg')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          {/* Department Name */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.displayName}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 13,
              color: '#6B7280',
              marginBottom: 16,
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {/* Bottom Info Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Artwork Count */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#10B981',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}
              >
                <MaterialIcons name="image" size={20} color="#fff" />
              </View>
              <Text style={{ fontSize: 14, color: '#374151', fontWeight: '600' }}>
                {item.artworkCount ? `${item.artworkCount.toLocaleString()} tác phẩm` : 'Đang tải...'}
              </Text>
            </View>

            {/* Floor Badge */}
            <View
              style={{
                backgroundColor: '#3B82F6',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 13, color: '#fff', fontWeight: '600' }}>
                Tầng {item.floor}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải phòng ban...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" translucent={false} />

      {/* Header with Title and Search */}
      <View
        style={{
          backgroundColor: '#7c3aed',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 16,
        }}
      >
        {/* Header Row with Back Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 }}>
            Danh sách phòng ban
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            height: 40,
            marginBottom: 0,
          }}
        >
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Tìm kiếm phòng ban..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              fontSize: 14,
              color: '#333',
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* List Content */}
      <FlatList
        data={filteredDepartments}
        renderItem={renderDepartmentItem}
        keyExtractor={(item) => item.departmentId.toString()}
        contentContainerStyle={{ paddingVertical: 8, paddingTop: 12 }}
        scrollEnabled={true}
      />
    </View>
  );
}
