export type Department = {
  departmentId: number;
  displayName: string;
};

export type MetObjectSummary = {
  objectID: number;
  title?: string;
  primaryImageSmall?: string;
  department?: string;
  artistDisplayName?: string;
};
