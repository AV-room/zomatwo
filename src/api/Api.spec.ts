import { mockRestaurantsSet } from '../mockData/mockData';
import Restaurant from '../interfaces/Restaurant';
import { Filters } from '../interfaces/Filters';
import { Categories, Cuisines } from '../enums';
import { applySecondaryFilters, createSearchQueryParamSets } from './api';
import { SearchParams } from '../interfaces/SearchParams';
import { apiIds } from './apiIdMap';

describe('createSearchQueryParamSets()', () => {
  let restaurants: Restaurant[];
  const fixedArgs: [number[], number[], number[]] = [
    [0, 500],
    [0, 5],
    [1, 2, 3]
  ];
  const fixedSearchParams = {
    entity_id: 297,
    entity_type: 'city',
    category: `${apiIds.categories[Categories.takeaway]}`,
    cuisines: `${apiIds.cuisines[Cuisines.bubbleTea]}`
  };

  beforeEach(() => {
    restaurants = [...mockRestaurantsSet];
  });

  // should return an array with a default cost sort when the filter set has null cost and rating filters
  // should return an array with a cost sort when the filter set has a non-null cost filter
  // should return an array with a rating sort when the filter set has a non-null rating filter
  // should return an array with a cost sort and a rating sort when the filter set has both non-null cost and rating filters
  // should return an array with a
  it('should return an array of 1 search param set with default cost sort when the filter set has null cost and rating filters', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: null,
      rating: null
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'cost',
        order: 'desc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });

  it('should return an array of 1 search param set with ascending cost sort when the filter set has a non-null, low average cost filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [20, 30],
      rating: null
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'cost',
        order: 'asc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });

  it('should return an array of 1 search param set with descending cost sort when the filter set has a non-null, high average cost filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [300, 500],
      rating: null
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'cost',
        order: 'desc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });

  it('should return an array of 1 search param set with ascending rating sort when the filter set has a non-null, low average rating filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: null,
      rating: [1.2, 2]
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'rating',
        order: 'asc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });

  it('should return an array of 1 search param set with descending rating sort when the filter set has a non-null, high average rating filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: null,
      rating: [3.5, 4.5]
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'rating',
        order: 'desc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });

  it('should return an array of 2 search param sets when the filter set has non-null rating and cost filters', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [300, 500],
      rating: [3.5, 4.5]
    };

    const expected: SearchParams[] = [
      {
        ...fixedSearchParams,
        sort: 'cost',
        order: 'desc'
      },
      {
        ...fixedSearchParams,
        sort: 'rating',
        order: 'desc'
      }
    ];

    expect(createSearchQueryParamSets(filters, ...fixedArgs)).toEqual(expected);
  });
});

describe('applySecondaryFilters()', () => {
  let restaurants: Restaurant[];

  beforeEach(() => {
    restaurants = [...mockRestaurantsSet];
  });

  it('should not modify the restaurant list when there are no cost or ratings filters', () => {
    const noCostOrRatingFilters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: null,
      rating: null
    };
    expect(applySecondaryFilters(noCostOrRatingFilters, restaurants)).toEqual(
      restaurants
    );
  });

  it('should filter out restaurants within the given ratings range when the filter set has a non-null rating filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: null,
      rating: [3.1, 3.2]
    };

    const expectedNames = [
      'Semaphore Fish and Chips',
      'Dolphin Fish Shop and Take Away',
      'Tea Tree Gully Chicken and Seafood'
    ];

    const result = applySecondaryFilters(filters, restaurants);
    expect(result.map((restaurant) => restaurant.name)).toEqual(expectedNames);
  });

  it('should filter out restaurants within the given cost range when the filter set has a non-null cost filter', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [60, 70],
      rating: null
    };

    const expectedNames = [
      'Chapati House 2',
      'Wasai Japanese Kitchen',
      "Rena's Thai Kitchen",
      'Gin Long Canteen'
    ];

    const result = applySecondaryFilters(filters, restaurants);
    expect(result.map((restaurant) => restaurant.name)).toEqual(expectedNames);
  });

  it('should filter out restaurants within the given cost and rating ranges when the filter set has non-null cost and rating filters', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [20, 30],
      rating: [4, 5]
    };

    const expectedNames = ["Soto's Fish Shop"];

    const result = applySecondaryFilters(filters, restaurants);
    expect(result.map((restaurant) => restaurant.name)).toEqual(expectedNames);
  });

  it('should not output duplicates in filtered list', () => {
    const filters: Filters = {
      categories: [Categories.takeaway],
      cuisines: [Cuisines.bubbleTea],
      cost: [20, 30],
      rating: [4, 5]
    };

    const restaurantListWithDupe = [
      ...restaurants,
      restaurants.find((r) => r.name === "Soto's Fish Shop")
    ];
    const expectedNames = ["Soto's Fish Shop"];

    const result = applySecondaryFilters(filters, restaurantListWithDupe);
    expect(result.map((restaurant) => restaurant.name)).toEqual(expectedNames);
  });
});
