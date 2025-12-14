import React from 'react';
import SearchFiltersContent from './SearchFiltersContent';
import { Department } from '@/models/search/types';

type Props = {
  departments: Department[];
  selected: number[];
  toggleDept: (id: number) => void;
  clearFilters?: () => void;
  applySearch?: () => void;
  selectedLocations?: string[];
  toggleLocation?: (loc: string) => void;
  selectedThemes?: string[];
  toggleTheme?: (t: string) => void;
  availableThemes?: string[];
  availableLocations?: string[];
};

export function SearchFilterInline(props: Props) {
  const {
    departments,
    selected,
    toggleDept,
    clearFilters,
    applySearch,
    selectedLocations,
    toggleLocation,
    selectedThemes,
    toggleTheme,
    availableThemes,
    availableLocations,
  } = props;

  return (
    <SearchFiltersContent
      departments={departments}
      selected={selected}
      toggleDept={toggleDept}
      selectedLocations={selectedLocations}
      toggleLocation={toggleLocation}
      selectedThemes={selectedThemes}
      toggleTheme={toggleTheme}
      clearFilters={clearFilters}
      applySearch={applySearch}
      availableThemes={availableThemes}
      availableLocations={availableLocations}
    />
  );
}
