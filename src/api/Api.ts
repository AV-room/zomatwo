import axios, { AxiosRequestConfig } from 'axios';
import { mean } from 'lodash';
import { Categories, Cuisines } from '../enums';
import { apiIds } from './ApiIdMap';
import { Filters } from '../interfaces/Filters';
import { Sort, SortType, SortOrder } from '../interfaces/Sort';
import { SearchResponse } from '../interfaces/SearchResponse';
import { SearchParams } from '../interfaces/SearchParams';
import Restaurant from '../interfaces/Restaurant';
import { getTimeoutPromise } from '../utils/helpers';
import { searchResponseCollection } from '../mockData/mockData';
import { DEFAULT_COST_BOUNDS, DEFAULT_RATING_BOUNDS } from '../utils/constants';
import { GetCuisinesResponse } from '../interfaces/GetCuisinesResponse';

export const SEARCH_API_MAX_RESULTS = 100;
const ENTITY_TYPE = 'city';
const ENTITY_ID = 297; // Adelaide
const baseUrl = 'https://developers.zomato.com/api/v2.1';
const userKey = '3bf73322184a4f70d9f4d634ec1c9fc2'; // '624ed99052c14f15670341b90e062c3' 'd7d72ddcee1493db536aeeb88ae2440c';

// API calls
export const getCuisines = async (): Promise<number[]> => {
  const route = '/cuisines';
  const requestOptions: AxiosRequestConfig = {
    url: `${baseUrl}${route}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'user-key': userKey
    },
    params: {
      city_id: ENTITY_ID
    }
  };

  let cuisinesResponse: GetCuisinesResponse;
  try {
    cuisinesResponse = await Promise.race([
      axios(requestOptions),
      getTimeoutPromise()
    ]);
  } catch (rejected) {
    return null;
  }

  const allCuisineIds = cuisinesResponse.data.cuisines.map(
    (dataItem) => dataItem.cuisine.cuisine_id
  );

  return allCuisineIds;
};

const getSearchResults = async (
  params: SearchParams
): Promise<SearchResponse> => {
  const route = '/search';
  const requestOptions: AxiosRequestConfig = {
    url: `${baseUrl}${route}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'user-key': userKey
    },
    params
  };

  return axios(requestOptions);
};

// search query coordination
export const orchestrateSearchQuery = async (
  filters: Filters,
  otherCuisineIds: number[]
): Promise<Restaurant[]> => {
  const paramSets: SearchParams[] = createSearchQueryParamSets(
    filters,
    DEFAULT_COST_BOUNDS,
    DEFAULT_RATING_BOUNDS,
    otherCuisineIds
  );

  let searchResponses: SearchResponse[];
  try {
    // MOCK DATA
    // searchResponses = searchResponseCollection;

    searchResponses = await collectSearchResponses(paramSets);
  } catch (rejected) {
    return null;
  }

  let allRestaurants = searchResponses.reduce((acc, curr: SearchResponse) => {
    const restaurants = curr.data.restaurants.map(
      (dataItem: { restaurant: {} }) => dataItem.restaurant
    );
    return [...acc, ...restaurants];
  }, []);

  return allRestaurants;
};

export const createSearchQueryParamSets = (
  filters: Filters,
  DEFAULT_COST_BOUNDS: number[],
  DEFAULT_RATING_BOUNDS: number[],
  otherCuisineIds: number[]
): SearchParams[] => {
  let costSort: Sort;
  let ratingSort: Sort;
  let paramSets: SearchParams[] = [];

  if (filters.cost) {
    costSort = {
      type: 'cost' as SortType,
      order: getSortOrder(filters.cost, DEFAULT_COST_BOUNDS) as SortOrder
    };

    paramSets.push(createSearchQueryParams(filters, costSort, otherCuisineIds));
  }

  if (filters.rating) {
    ratingSort = {
      type: 'rating' as SortType,
      order: getSortOrder(filters.rating, DEFAULT_RATING_BOUNDS) as SortOrder
    };

    paramSets.push(
      createSearchQueryParams(filters, ratingSort, otherCuisineIds)
    );
  }

  if (paramSets.length === 0) {
    const defaultSort: Sort = {
      type: 'cost' as SortType,
      order: 'desc' as SortOrder
    };

    paramSets = [
      createSearchQueryParams(filters, defaultSort, otherCuisineIds)
    ];
  }

  return paramSets;
};

const createSearchQueryParams = (
  filters: Filters,
  sorting: Sort,
  otherCuisineIds: number[]
): SearchParams => {
  const categoryIds = filters.categories.map(
    (c: string) => apiIds.categories[c as Categories]
  );

  const cuisineIds = filters.cuisines.map((c: string) => {
    return c === Cuisines.other
      ? otherCuisineIds.join(',')
      : apiIds.cuisines[c as Cuisines];
  });

  return {
    entity_type: ENTITY_TYPE,
    entity_id: ENTITY_ID,
    category: categoryIds.join(),
    cuisines: cuisineIds.join(),
    sort: sorting.type,
    order: sorting.order
  };
};

// an attempt to target the search call
const getSortOrder = (currentBounds: number[], defaultBounds: number[]) => {
  return mean(currentBounds) < mean(defaultBounds) ? 'asc' : 'desc';
};

const collectSearchResponses = async (
  paramSets: SearchParams[]
): Promise<SearchResponse[]> => {
  const BATCH_TOTAL = 20;
  const promises: Promise<SearchResponse>[] = [];

  for (const paramSet of paramSets) {
    let startIndex = 0;
    let totalResults: number = null;
    do {
      if (startIndex === 0) {
        // doing an extra request here...
        const res = await getSearchResults({ ...paramSet, start: startIndex });
        totalResults = await res.data.results_found;
      }
      promises.push(getSearchResults({ ...paramSet, start: startIndex }));
      startIndex = startIndex + BATCH_TOTAL;
    } while (startIndex < Math.min(totalResults, SEARCH_API_MAX_RESULTS));
  }

  return await Promise.race([Promise.all(promises), getTimeoutPromise()]);
};
