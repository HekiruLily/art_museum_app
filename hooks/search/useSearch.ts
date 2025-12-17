import { useState, useEffect } from 'react';
import { fetchDepartments, searchByQuery, listObjects, fetchObjectById } from '../../api/search/metApi';
import { Department, MetObjectSummary } from '@/models/search/types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [location, setLocation] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [dateBegin, setDateBegin] = useState<number | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<number | undefined>(undefined);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [results, setResults] = useState<MetObjectSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchDepartments().then((d) => {
      if (mounted) setDepartments(d);
    }).catch(() => {});
    // After departments are loaded, try to fetch a small sample of objects to build
    // available themes (tags) and locations. We do this asynchronously and non-blocking.
    async function loadSamples() {
      try {
        // pick first department if available to narrow results
        const deptId = (await fetchDepartments())[0]?.departmentId;
        const ids = await listObjects({ departmentIds: deptId ? [deptId] : undefined });
        if (!ids || ids.length === 0) return;
        // Use a sample to reduce latency and fetch in batches so UI updates earlier
        // increase sample a bit to improve chance of finding geo fields
        const sample = ids.slice(0, 12);
        const themesSet = new Set<string>();
        const locSet = new Set<string>();

        const batchSize = 4;
        for (let i = 0; i < sample.length; i += batchSize) {
          const batch = sample.slice(i, i + batchSize);
          await Promise.all(batch.map(async (id) => {
            try {
              const obj: any = await fetchObjectById(id);
              if (obj && Array.isArray(obj.tags)) {
                obj.tags.forEach((t: any) => { if (t && t.term) themesSet.add(String(t.term)); });
              }
              // collect multiple geo-related fields to improve chance of having locations
              const geoFields = [obj?.country, obj?.region, obj?.subregion, obj?.locale, obj?.city, obj?.culture];
              geoFields.forEach((g: any) => {
                if (g) {
                  const v = String(g).trim();
                  if (v) locSet.add(v);
                }
              });
            } catch {
              // ignore individual fetch errors
            }
          }));
          // update UI progressively after each batch
          if (mounted) {
            setAvailableThemes(Array.from(themesSet).slice(0, 50));
            setAvailableLocations(Array.from(locSet).filter(Boolean).slice(0, 50));
          }
        }
        // fallback: if we didn't find any locations from sample, provide a small default list
        if (mounted) {
          const currentLocs = Array.from(locSet).filter(Boolean);
          if (currentLocs.length === 0) {
            setAvailableLocations([
              'France',
              'United States',
              'China',
              'Japan',
              'Italy',
              'United Kingdom',
              'Egypt',
              'India',
            ]);
          }
        }
      } catch {
        // ignore
      }
    }
    loadSamples();

    return () => { mounted = false; };
  }, []);

  function toggleDepartment(id: number) {
    setSelectedDepartments((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function toggleLocation(loc: string) {
    setSelectedLocations((prev) => (prev.includes(loc) ? prev.filter((p) => p !== loc) : [...prev, loc]));
  }

  function toggleTheme(theme: string) {
    setSelectedThemes((prev) => (prev.includes(theme) ? prev.filter((p) => p !== theme) : [...prev, theme]));
  }

  async function applySearch() {
    setLoading(true);
    try {
      let ids: number[] = [];
      if (selectedDepartments.length > 1 && !query) {
        ids = await listObjects({ departmentIds: selectedDepartments });
      } else {
        const qParam = query && query.trim().length > 0 ? query : (selectedThemes.length > 0 ? selectedThemes.join(' ') : '');

        const searchParams: any = { q: qParam || '' };
        if (selectedDepartments.length === 1) searchParams.departmentId = selectedDepartments[0];
        if (selectedLocations.length) searchParams.geoLocation = selectedLocations.join('|');
        if (dateBegin) searchParams.dateBegin = dateBegin;
        if (dateEnd) searchParams.dateEnd = dateEnd;

        // If user selected themes (tags) and didn't provide a free-form query,
        // prefer tag-based search by passing tags=true to the API.
        if (selectedThemes.length > 0 && !query) {
          const q = selectedThemes.join(' ').toLowerCase();
          ids = await searchByQuery({ q, tags: true, geoLocation: selectedLocations.length ? selectedLocations.join('|') : undefined, departmentId: selectedDepartments.length === 1 ? selectedDepartments[0] : undefined, dateBegin, dateEnd });
        } else {
          ids = await searchByQuery(searchParams);
        }
      }

      const limited = (ids || []).slice(0, 40);

      const details = await Promise.all(limited.map(async (id) => {
        try {
          const obj: any = await fetchObjectById(id);
          return {
            objectID: obj.objectID,
            title: obj.title,
            primaryImageSmall: obj.primaryImageSmall,
            department: obj.department,
            artistDisplayName: obj.artistDisplayName,
          } as MetObjectSummary;
        } catch {
          return null;
        }
      }));

      setResults(details.filter(Boolean) as MetObjectSummary[]);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSelectedDepartments([]);
    setLocation('');
    setSelectedLocations([]);
    setSelectedThemes([]);
    setDateBegin(undefined);
    setDateEnd(undefined);
  }

  return {
    query,
    setQuery,
    departments,
    availableThemes,
    selectedDepartments,
    toggleDepartment,
    selectedLocations,
    toggleLocation,
    selectedThemes,
    toggleTheme,
    availableLocations,
    location,
    setLocation,
    dateBegin,
    setDateBegin,
    dateEnd,
    setDateEnd,
    results,
    loading,
    applySearch,
    clearFilters,
  };
}
