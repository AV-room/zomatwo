import React, { useState, useEffect, FunctionComponent } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import './App.scss';
import Restaurant from './interfaces/Restaurant';

enum Categories {
  dining = 'dining',
  takeaway = 'takeaway',
  delivery = 'delivery',
  pubsBars = 'pubsBars'
}

enum Cuisines {
  cafe = 'cafe',
  coffee = 'coffee',
  pizza = 'pizza',
  fast = 'fast',
  asian = 'asian',
  bakery = 'bakery',
  italian = 'italian',
  sandwich = 'sandwich',
  chinese = 'chinese',
  pub = 'pub'
  // other = 'other'
}

const apiIds = {
  categories: {
    dining: 2,
    takeaway: 5,
    delivery: 1,
    pubsBars: 11
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
    [Cuisines.sandwich]: 304
  }
};

function App() {
  const [results, setResults] = useState<Restaurant[]>(null);
  // const [categories, setCategories] = useState<string[]>([]);

  const [categories, setCategories] = useState({
    [Categories.dining]: false,
    [Categories.takeaway]: false,
    [Categories.delivery]: false,
    [Categories.pubsBars]: false
  });

  const [cuisines, setCuisines] = useState({
    [Cuisines.cafe]: false,
    [Cuisines.coffee]: false,
    [Cuisines.pizza]: false,
    [Cuisines.fast]: false,
    [Cuisines.asian]: false,
    [Cuisines.bakery]: false,
    [Cuisines.italian]: false,
    [Cuisines.sandwich]: false,
    [Cuisines.chinese]: false,
    [Cuisines.pub]: false
    // [Cuisines.other]: false // TODO: account for other
  });

  useEffect(() => {
    const entityType: string = 'city';
    const entityId: number = 297; // Adelaide, SA

    // get category ids
    const selectedCategories: string[] = Object.keys(categories).filter(
      (cKey) => categories[cKey as Categories]
    );

    const selectedCategoryIds = selectedCategories
      .map((c: string) => apiIds.categories[c as Categories])
      .join(',');

    // get cuisine ids
    const selectedCuisines: string[] = Object.keys(cuisines).filter(
      (cKey) => cuisines[cKey as Cuisines]
    );

    const selectedCuisineIds = selectedCuisines
      .map((c: string) => {
        // if other

        // else
        return apiIds.cuisines[c as Cuisines];
      })
      .join(',');

    console.log('categoryIds', selectedCategoryIds);
    console.log('cuisineIds', selectedCuisineIds);

    const url: string = `https://developers.zomato.com/api/v2.1/search?entity_type=${entityType}&entity_id=${entityId}&category=${selectedCategoryIds}&cuisines=${selectedCuisineIds}`;

    const requestOptions: AxiosRequestConfig = {
      url,
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'user-key': 'd7d72ddcee1493db536aeeb88ae2440c'
      }
    };

    axios(requestOptions).then((res) => {
      const restaurants: Restaurant[] = res.data.restaurants.map(
        (dataItem: { restaurant: {} }) => dataItem.restaurant
      );

      setResults(restaurants);
    });
  }, [categories, cuisines]);

  const categoryCheckboxes = [
    { label: 'Dining', value: Categories.dining },
    { label: 'Take-Away', value: Categories.takeaway },
    { label: 'Delivery', value: Categories.delivery },
    { label: 'Pubs & Bars', value: Categories.pubsBars }
  ];

  const cuisineCheckboxes = [
    { label: 'Cafe Food', value: Cuisines.cafe },
    { label: 'Coffee and Tea', value: Cuisines.coffee },
    { label: 'Pizza', value: Cuisines.pizza },
    { label: 'Fast Food', value: Cuisines.fast },
    { label: 'Asian', value: Cuisines.asian },
    { label: 'Bakery', value: Cuisines.bakery },
    { label: 'Italian', value: Cuisines.italian },
    { label: 'Sandwich', value: Cuisines.sandwich },
    { label: 'Chinese', value: Cuisines.chinese },
    { label: 'Pub Food', value: Cuisines.pub }
    //  { label: 'Other', value: Cuisines.other }
  ];

  const handleCategoriesChange = (event: any) => {
    setCategories({ ...categories, [event.target.name]: event.target.checked });
  };

  const handleCuisinesChange = (event: any) => {
    setCuisines({ ...cuisines, [event.target.name]: event.target.checked });
  };

  return (
    <div className="container">
      <h1>Filters</h1>
      <FormControl component="fieldset">
        <FormLabel component="legend">Category</FormLabel>
        <FormGroup>
          {categoryCheckboxes.map((cb: { label: string; value: any }, i) => (
            <FormControlLabel
              control={
                <Checkbox
                  key={i}
                  checked={categories[cb.value as Categories]}
                  onChange={handleCategoriesChange}
                  name={cb.value}
                />
              }
              label={cb.label}
            />
          ))}
        </FormGroup>
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel component="legend">Cuisines</FormLabel>
        <FormGroup>
          {cuisineCheckboxes.map((cb: { label: string; value: any }, i) => (
            <FormControlLabel
              control={
                <Checkbox
                  key={i}
                  checked={cuisines[cb.value as Cuisines]}
                  onChange={handleCuisinesChange}
                  name={cb.value}
                />
              }
              label={cb.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}

export default App;
