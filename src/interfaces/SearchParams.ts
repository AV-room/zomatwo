import { SortType, SortOrder } from './Sort';

export interface SearchParams {
  entity_id: number;
  entity_type: string;
  category: string;
  cuisines: string;
  sort: SortType;
  order: SortOrder;
  start?: number;
  count?: number;
}
