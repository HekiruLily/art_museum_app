import { Stack } from 'expo-router';
import React from 'react';

export default function DepartmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Danh sách PB',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Chi tiết PB',
        }}
      />
    </Stack>
  );
}
