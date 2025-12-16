import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CategoryButton } from '@/components/ui/category-button';
import { SectionHeader } from '@/components/ui/section-header';
import { Category } from '@/models/types';

interface QuickAccessSectionProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
}

export function QuickAccessSection({ categories, onCategoryPress }: QuickAccessSectionProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Khám phá nhanh" showViewAll={false} />
      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            icon={category.icon as any}
            label={category.name}
            color={category.color}
            onPress={() => onCategoryPress?.(category)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
