import axios, { AxiosRequestConfig } from 'axios';
import { Categories, Cuisines } from '../enums';
import { apiIds } from './ApiIdMap';

export interface Filters {
  categories: string[];
  cuisines: string[];
}

const ENTITY_TYPE = 'city';
const ENTITY_ID = 297; // Adelaide, SA
const baseUrl = 'https://developers.zomato.com/api/v2.1';
const userKey = 'd7d72ddcee1493db536aeeb88ae2440c';

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

export const getFilterResults = (
  filters: Filters,
  otherCuisineIds: number[]
) => {
  const categoryIds = filters.categories.map(
    (c: string) => apiIds.categories[c as Categories]
  );

  const cuisineIds = filters.cuisines.map((c: string) => {
    return c === Cuisines.other
      ? otherCuisineIds.join(',')
      : apiIds.cuisines[c as Cuisines];
  });

  console.log('categoryIds', categoryIds);
  console.log('cuisineIds', cuisineIds);

  const route = '/search';
  const requestOptions: AxiosRequestConfig = {
    url: `${baseUrl}${route}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'user-key': userKey
    },
    params: {
      entity_type: ENTITY_TYPE,
      entity_id: ENTITY_ID,
      category: categoryIds.join(),
      cuisines: cuisineIds.join()
    }
  };

  return axios(requestOptions);
};
