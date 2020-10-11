import Restaurant from '../interfaces/Restaurant';

export const mockSearchResponse1 = require('./mockSearchResponse.json');
export const mockSearchResponse2 = require('./mockSearchResponse1.json');

export const searchResponseCollection = [
  mockSearchResponse1,
  mockSearchResponse2
];

export const mockRestaurantSet1: Restaurant[] = mockSearchResponse1.data.restaurants.map(
  (r: { restaurant: {} }) => r.restaurant
);
export const mockRestaurantSet2: Restaurant[] = mockSearchResponse2.data.restaurants.map(
  (r: { restaurant: {} }) => r.restaurant
);

export const mockRestaurantsSet: Restaurant[] = [
  ...mockRestaurantSet1,
  ...mockRestaurantSet2
];
