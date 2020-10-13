import { isEqual, uniq } from 'lodash';
import { DEFAULT_COST_BOUNDS, DEFAULT_RATING_BOUNDS } from './utils/constants';
import Restaurant from './interfaces/Restaurant';
import { Filters } from './interfaces/Filters';
import { orchestrateSearchQuery } from './api/Api';
import { withinRange } from './utils/helpers';

export const getFilteredResults = async (
  filters: Filters,
  otherCuisineIds: number[]
): Promise<Restaurant[]> => {
  if (isEqual(filters.cost, DEFAULT_COST_BOUNDS)) {
    filters.cost = null;
  }

  if (isEqual(filters.rating, DEFAULT_RATING_BOUNDS)) {
    filters.rating = null;
  }

  return orchestrateSearchQuery(filters, otherCuisineIds).then(
    (searchResults) => {
      return filters.cost || filters.rating
        ? applySecondaryFilters(filters, searchResults)
        : searchResults;
    }
  );
};

export const applySecondaryFilters = (
  filters: Filters,
  allRestaurants: Restaurant[]
) => {
  let restaurants = uniq(allRestaurants);

  if (filters.cost) {
    restaurants = restaurants.filter((r: Restaurant) =>
      withinRange(filters.cost, r.average_cost_for_two)
    );
  }

  if (filters.rating) {
    restaurants = restaurants.filter((r: Restaurant) =>
      withinRange(filters.rating, parseFloat(r.user_rating.aggregate_rating))
    );
  }

  return restaurants;
};
