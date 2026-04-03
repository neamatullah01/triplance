export type TPackageFilterRequest = {
  searchTerm?: string;
  destination?: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
