import { getDepartmentMockData } from '@/constants/departmentsMock';
import { fetchDepartmentImage, fetchDepartments } from '@/services/metMuseumApi';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'expo-linear-gradient';

interface Department {
  departmentId: number;
  displayName: string;
  image?: string;
}

export default function DepartmentsListScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Get gradient colors for each department
  const getDepartmentColors = (departmentId: number): [string, string] => {
    const colorSchemes: Record<number, [string, string]> = {
      1: ['#FF6B6B', '#FF8E72'],     // Red gradient
      3: ['#4ECDC4', '#44A88A'],     // Teal gradient
      4: ['#FFE66D', '#FFA502'],     // Yellow gradient
      5: ['#95E1D3', '#38A794'],     // Green gradient
      6: ['#C44569', '#E94057'],     // Pink gradient
      7: ['#6C5CE7', '#A29BFE'],     // Purple gradient
      8: ['#FD79A8', '#E17055'],     // Rose gradient
      9: ['#74B9FF', '#0984E3'],     // Blue gradient
      10: ['#81ECEC', '#00B894'],    // Cyan gradient
      11: ['#FDCB6E', '#E1A23B'],    // Gold gradient
      12: ['#DDA15E', '#BC6C25'],    // Brown gradient
      13: ['#A8DADC', '#457B9D'],    // Steel gradient
      14: ['#F1FAEE', '#A8DADC'],    // Mint gradient
      15: ['#E63946', '#A4161A'],    // Dark red gradient
      17: ['#457B9D', '#1D3557'],    // Navy gradient
      18: ['#F4A261', '#E76F51'],    // Orange gradient
      19: ['#2A9D8F', '#264653'],    // Teal dark gradient
      21: ['#E9C46A', '#F4A261'],    // Warm gradient
    };
    return colorSchemes[departmentId] || ['#7c3aed', '#a78bfa'];
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await fetchDepartments();
      console.log('DepartmentsList - Loaded departments:', data.length);
      
      // Lấy ảnh cho từng phòng ban từ API, tuần tự để tránh rate limit
      const departmentsWithImages = [];
      for (let i = 0; i < data.length; i++) {
        const dept = data[i];
        const mockData = getDepartmentMockData(dept.departmentId);
        
        let image = mockData.image; // Ưu tiên mock data
        
        // Nếu mock không có ảnh, thử lấy từ API với delay
        if (!image) {
          if (i > 0) await delay(100); // Delay để tránh rate limit
          try {
            image = await fetchDepartmentImage(dept.departmentId);
            console.log(`Fetched image for dept ${dept.departmentId}:`, !!image);
          } catch (err) {
            console.warn(`Failed to fetch image for dept ${dept.departmentId}:`, err);
          }
        } else {
          console.log(`Using mock image for dept ${dept.departmentId}:`);
        }
        
        departmentsWithImages.push({ ...dept, image });
      }
      
      console.log('Departments with images loaded:', departmentsWithImages.length);
      setDepartments(departmentsWithImages);
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for delay
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const filteredDepartments = departments.filter((dept) =>
    dept.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDepartmentItem = ({ item }: { item: Department }) => {
    const mockData = getDepartmentMockData(item.departmentId);
    console.log(`DepartmentsList - Rendering item ${item.departmentId}:`, {
      name: item.displayName,
      hasImage: !!item.image,
      mockFloor: mockData.floor,
      mockCurator: mockData.curator,
    });

    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Navigating to department:', item.departmentId);
          router.push(`/(tabs)/departments/${item.departmentId}`);
        }}
        style={{
          backgroundColor: '#fff',
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          overflow: 'hidden',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Image */}
        <View style={{ height: 150, backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={getDepartmentColors(item.departmentId)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              <MaterialIcons name="museum" size={48} color="#fff" style={{ opacity: 0.8 }} />
              <Text style={{ color: '#fff', fontSize: 12, marginTop: 8, opacity: 0.8, textAlign: 'center', paddingHorizontal: 10 }}>
                {item.displayName.split(' ').slice(0, 2).join(' ')}
              </Text>
            </LinearGradient>
          )}
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          {/* Department Name */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#333',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {item.displayName}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 12,
              color: '#666',
              marginBottom: 12,
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {mockData.description}
          </Text>

          {/* Info Row: Floor + Curator */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#4CAF50',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                  {mockData.floor.split('')[0]}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#666' }}>Tầng {mockData.floor}</Text>
            </View>

            <View
              style={{
                backgroundColor: '#E8D5F2',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 10, color: '#7B2CBF', fontWeight: '600' }}>
                Quản lý
              </Text>
            </View>
          </View>

          {/* Curator Name */}
          <View
            style={{
              backgroundColor: '#F3E5F5',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#9C27B0',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                {mockData.curator.split(' ')[0][0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }}>
                {mockData.curator}
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
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 }}>
          Danh sách phòng ban
        </Text>

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
