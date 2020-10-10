import axios, { AxiosRequestConfig } from 'axios';
import { Categories, Cuisines } from '../enums';
import { apiIds } from './apiIdMap';

export interface Filters {
  categories: string[];
  cuisines: string[];
}

export const getFilterResults = (filters: Filters) => {
  // map to api ids
  const categoryIds = filters.categories.map(
    (c: string) => apiIds.categories[c as Categories]
  );

  const cuisineIds = filters.cuisines.map((c: string) => {
    // if other

    // else
    return apiIds.cuisines[c as Cuisines];
  });

  console.log('categoryIds', categoryIds);
  console.log('cuisineIds', cuisineIds);

  // construct url
  const entityType: string = 'city';
  const entityId: number = 297; // Adelaide, SA

  const requestOptions: AxiosRequestConfig = {
    url: 'https://developers.zomato.com/api/v2.1/search',
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'user-key': 'd7d72ddcee1493db536aeeb88ae2440c'
    },
    params: {
      entityType,
      entityId,
      category: categoryIds.join(),
      cuisines: cuisineIds.join()
    }
  };

  return axios(requestOptions);
};
