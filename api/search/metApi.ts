import { Department } from '@/models/search/types';

const BASE = 'https://collectionapi.metmuseum.org/public/collection/v1';

export async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch(`${BASE}/departments`);
  const json = await res.json();
  return json.departments || [];
}

export async function searchByQuery(params: {
  q: string;
  departmentId?: number; // singular when using search endpoint
  hasImages?: boolean;
  artistOrCulture?: boolean;
  dateBegin?: number;
  dateEnd?: number;
  // new options
  tags?: boolean;
  title?: boolean;
  isHighlight?: boolean;
  isOnView?: boolean;
  medium?: string;
  geoLocation?: string;
}): Promise<number[]> {
  const qs = new URLSearchParams();
  qs.append('q', params.q || '');
  if (params.departmentId) qs.append('departmentId', String(params.departmentId));
  if (typeof params.hasImages === 'boolean') qs.append('hasImages', String(params.hasImages));
  if (typeof params.artistOrCulture === 'boolean') qs.append('artistOrCulture', String(params.artistOrCulture));
  if (params.dateBegin) qs.append('dateBegin', String(params.dateBegin));
  if (params.dateEnd) qs.append('dateEnd', String(params.dateEnd));
  if (params.tags) qs.append('tags', 'true');
  if (params.title) qs.append('title', 'true');
  if (params.isHighlight) qs.append('isHighlight', 'true');
  if (params.isOnView) qs.append('isOnView', 'true');
  if (params.medium) qs.append('medium', params.medium);
  if (params.geoLocation) qs.append('geoLocation', params.geoLocation);

  const res = await fetch(`${BASE}/search?${qs.toString()}`);
  const json = await res.json();
  return json.objectIDs || [];
}

export async function listObjects(params: { departmentIds?: number[]; metadataDate?: string }): Promise<number[]> {
  const qs = new URLSearchParams();
  if (params.departmentIds && params.departmentIds.length) qs.append('departmentIds', params.departmentIds.join('|'));
  if (params.metadataDate) qs.append('metadataDate', params.metadataDate);
  const res = await fetch(`${BASE}/objects?${qs.toString()}`);
  const json = await res.json();
  return json.objectIDs || [];
}

export async function fetchObjectById(id: number) {
  const res = await fetch(`${BASE}/objects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch object');
  return await res.json();
}
