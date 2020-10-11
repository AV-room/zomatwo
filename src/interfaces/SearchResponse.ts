import Restaurant from './Restaurant';

export interface SearchResponse {
  data: {
    results_found: number;
    results_shown: number;
    results_start: number;
    restaurants: { restaurant: Restaurant }[];
  };
}
