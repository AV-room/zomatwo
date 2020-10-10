import { Categories, Cuisines } from '../enums';

export const apiIds = {
  categories: {
    [Categories.dining]: 2,
    [Categories.takeaway]: 5,
    [Categories.delivery]: 1,
    [Categories.pubsBars]: 11,
    [Categories.nightlife]: 3
  },
  cuisines: {
    [Cuisines.asian]: 3,
    [Cuisines.bakery]: 5,
    [Cuisines.cafe]: 1039,
    [Cuisines.chinese]: 25,
    [Cuisines.coffee]: 161,
    [Cuisines.fast]: 40,
    [Cuisines.italian]: 55,
    [Cuisines.pizza]: 82,
    [Cuisines.pub]: 983,
    [Cuisines.sandwich]: 304,
    [Cuisines.egyptian]: 146,
    [Cuisines.bubbleTea]: 247,
    [Cuisines.other]: -1 // to get around 'index signature of object type implicitly has any type' error
  }
};
