export type SortType = 'rating' | 'cost';
export type SortOrder = 'asc' | 'desc';

export interface Sort {
  type: SortType;
  order: SortOrder;
}
