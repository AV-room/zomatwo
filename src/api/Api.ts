import axios, { AxiosRequestConfig } from 'axios';
import { Categories, Cuisines } from '../enums';
import { apiIds } from './ApiIdMap';
import { Filters } from '../interfaces/Filters';
import { Sort } from '../interfaces/Sort';
import { SearchResponse } from '../interfaces/SearchResponse';
import { SearchParams } from '../interfaces/SearchParams';

export const SEARCH_API_MAX_RESULTS = 100;
const ENTITY_TYPE = 'city';
const ENTITY_ID = 297; // Adelaide
// const MAX_RECORD_COUNT = 20;
const baseUrl = 'https://developers.zomato.com/api/v2.1';
const userKey = '3bf73322184a4f70d9f4d634ec1c9fc2'; // 'd7d72ddcee1493db536aeeb88ae2440c';

export const getCuisines = () => {
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

  return axios(requestOptions);
};

export const getFiltered = async (
  filters: Filters,
  sorting: Sort,
  // paginationStart: number = 0,
  // maxRecordCount: number = MAX_RECORD_COUNT,
  otherCuisineIds: number[]
): Promise<SearchResponse[]> => {
  const categoryIds = filters.categories.map(
    (c: string) => apiIds.categories[c as Categories]
  );

  const cuisineIds = filters.cuisines.map((c: string) => {
    return c === Cuisines.other
      ? otherCuisineIds.join(',')
      : apiIds.cuisines[c as Cuisines];
  });

  const params: SearchParams = {
    entity_type: ENTITY_TYPE,
    entity_id: ENTITY_ID,
    category: categoryIds.join(),
    cuisines: cuisineIds.join(),
    sort: sorting.type,
    order: sorting.order
    // start: paginationStart,
    // count: maxRecordCount
  };

  return collectFilterResponses(params);
};

const collectFilterResponses = async (
  params: SearchParams
): Promise<SearchResponse[]> => {
  const BATCH_TOTAL = 20;
  let startIndex = 0;
  let totalResults: number = null;
  const promises = [];
  do {
    if (startIndex === 0) {
      // doing an extra request here...
      const res = await querySearchApi({ ...params, start: startIndex });
      totalResults = await res.data.results_found;
    }
    promises.push(querySearchApi({ ...params, start: startIndex }));
    startIndex = startIndex + BATCH_TOTAL;
  } while (startIndex < Math.min(totalResults, SEARCH_API_MAX_RESULTS));

  return await Promise.all(promises);
};

const querySearchApi = async (params: SearchParams) => {
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
